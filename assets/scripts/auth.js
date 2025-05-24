import Alpine from 'alpinejs';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Make Alpine globally available
window.Alpine = Alpine;

// Firebase configuration - this will be bundled and minified
// No API keys will be exposed in HTML templates
const firebaseConfig = {
  apiKey: "AIzaSyDNY9U1vlYQgsw1S9_qM7ldxMKwvyuqoWw",
  authDomain: "dsa-30358.firebaseapp.com",
  projectId: "dsa-30358",
  storageBucket: "dsa-30358.firebasestorage.app",
  messagingSenderId: "376908075201",
  appId: "1:376908075201:web:ce8135cb2a269d89eb4440",
  measurementId: "G-4TEBWXS05Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Loading state management
Alpine.store('status', {
  loading: true,
  message: '',
  error: null,
  
  setLoading(isLoading) {
    this.loading = isLoading;
  },
  
  setMessage(message) {
    this.message = message;
  },
  
  setError(error) {
    this.error = error;
    console.error('Auth error:', error);
  },
  
  clearMessages() {
    this.message = '';
    this.error = null;
  }
});

// Authentication store
Alpine.store('auth', {
  currentUser: null,
  userProgress: null,
  preferences: {
    autoSync: true,
    showOnLeaderboard: false
  },
  
  // Email/Password Authentication
  async login(email, password) {
    Alpine.store('status').setLoading(true);
    Alpine.store('status').setMessage('Signing in...');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      this.currentUser = userCredential.user;
      await this.syncUserData();
      Alpine.store('status').setMessage('Signed in successfully!');
      window.location.href = '/account/';
    } catch (error) {
      Alpine.store('status').setError(error.message);
    } finally {
      Alpine.store('status').setLoading(false);
    }
  },
  
  // Register new user
  async register(email, password) {
    Alpine.store('status').setLoading(true);
    Alpine.store('status').setMessage('Creating account...');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      this.currentUser = userCredential.user;
      
      // Create user document in Firestore
      await this.createUserProfile();
      await this.syncUserData();
      
      Alpine.store('status').setMessage('Account created successfully!');
      window.location.href = '/account/';
    } catch (error) {
      Alpine.store('status').setError(error.message);
    } finally {
      Alpine.store('status').setLoading(false);
    }
  },
  
  // Google Authentication
  async loginWithGoogle() {
    Alpine.store('status').setLoading(true);
    Alpine.store('status').setMessage('Signing in with Google...');
    
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      this.currentUser = userCredential.user;
      
      // Check if user exists, if not create profile
      const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
      if (!userDoc.exists()) {
        await this.createUserProfile();
      }
      
      await this.syncUserData();
      Alpine.store('status').setMessage('Signed in with Google successfully!');
      window.location.href = '/account/';
    } catch (error) {
      Alpine.store('status').setError(error.message);
    } finally {
      Alpine.store('status').setLoading(false);
    }
  },
  
  // GitHub Authentication
  async loginWithGithub() {
    Alpine.store('status').setLoading(true);
    Alpine.store('status').setMessage('Signing in with GitHub...');
    
    try {
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      this.currentUser = userCredential.user;
      
      // Check if user exists, if not create profile
      const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
      if (!userDoc.exists()) {
        await this.createUserProfile();
      }
      
      await this.syncUserData();
      Alpine.store('status').setMessage('Signed in with GitHub successfully!');
      window.location.href = '/account/';
    } catch (error) {
      Alpine.store('status').setError(error.message);
    } finally {
      Alpine.store('status').setLoading(false);
    }
  },
  
  // Sign out
  async logout() {
    Alpine.store('status').setLoading(true);
    Alpine.store('status').setMessage('Signing out...');
    
    try {
      await signOut(auth);
      this.currentUser = null;
      this.userProgress = null;
      Alpine.store('status').setMessage('Signed out successfully!');
      window.location.href = '/';
    } catch (error) {
      Alpine.store('status').setError(error.message);
    } finally {
      Alpine.store('status').setLoading(false);
    }
  },
  
  // Create user profile in Firestore
  async createUserProfile() {
    if (!this.currentUser) return;
    
    try {
      const userRef = doc(db, 'users', this.currentUser.uid);
      const localProgress = this.getLocalProgress();
      
      await setDoc(userRef, {
        uid: this.currentUser.uid,
        email: this.currentUser.email,
        displayName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
        photoURL: this.currentUser.photoURL || `https://ui-avatars.com/api/?name=${this.currentUser.email.split('@')[0]}`,
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: this.preferences,
        progress: localProgress || {}
      });
      
      // Add to leaderboard if enabled
      if (this.preferences.showOnLeaderboard) {
        await this.updateLeaderboard();
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  },
  
  // Update user profile
  async updateUserProfile(data) {
    if (!this.currentUser) return;
    
    try {
      const userRef = doc(db, 'users', this.currentUser.uid);
      await updateDoc(userRef, {
        ...data,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  },
  
  // Update leaderboard entry
  async updateLeaderboard() {
    if (!this.currentUser || !this.preferences.showOnLeaderboard) return;
    
    try {
      const leaderboardRef = doc(db, 'leaderboard', this.currentUser.uid);
      const progress = this.userProgress || this.getLocalProgress() || {};
      const totalCompleted = this.calculateTotalCompleted(progress);
      
      await setDoc(leaderboardRef, {
        uid: this.currentUser.uid,
        displayName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
        photoURL: this.currentUser.photoURL || `https://ui-avatars.com/api/?name=${this.currentUser.email.split('@')[0]}`,
        totalCompleted: totalCompleted,
        totalProblems: 450,
        percentComplete: Math.round((totalCompleted / 450) * 100),
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  },
  
  // Calculate total completed problems
  calculateTotalCompleted(progress) {
    if (!progress) return 0;
    
    let total = 0;
    Object.keys(progress).forEach(topic => {
      if (progress[topic] && Array.isArray(progress[topic])) {
        total += progress[topic].length;
      }
    });
    
    return total;
  },
  
  // Get progress from local storage
  getLocalProgress() {
    const progress = {};
    const topicSlugs = [
      'array', 'matrix', 'string', 'searching-sorting', 
      'linked-list', 'binary-trees', 'bst', 'greedy', 
      'backtracking', 'stacks-queues', 'heap', 'graph', 
      'trie', 'dynamic-programming', 'bit-manipulation'
    ];
    
    topicSlugs.forEach(slug => {
      const topicProgress = localStorage.getItem(`topic-${slug}`);
      if (topicProgress) {
        try {
          progress[slug] = JSON.parse(topicProgress);
        } catch (e) {
          console.error(`Error parsing progress for ${slug}:`, e);
          progress[slug] = [];
        }
      } else {
        progress[slug] = [];
      }
    });
    
    return progress;
  },
  
  // Save progress to local storage
  saveLocalProgress(progress) {
    if (!progress) return;
    
    Object.keys(progress).forEach(topic => {
      if (progress[topic] && Array.isArray(progress[topic])) {
        localStorage.setItem(`topic-${topic}`, JSON.stringify(progress[topic]));
      }
    });
  },
  
  // Sync user data between local storage and Firestore
  async syncUserData() {
    if (!this.currentUser) return;
    
    try {
      // Get user data from Firestore
      const userRef = doc(db, 'users', this.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.preferences = userData.preferences || this.preferences;
        
        // Get local progress
        const localProgress = this.getLocalProgress();
        
        // Merge cloud and local progress
        const mergedProgress = this.mergeProgress(localProgress, userData.progress || {});
        
        // Update user progress in memory
        this.userProgress = mergedProgress;
        
        // Save merged progress to local storage
        this.saveLocalProgress(mergedProgress);
        
        // Update Firestore with merged progress
        await updateDoc(userRef, {
          progress: mergedProgress,
          lastLogin: new Date(),
          lastSynced: new Date()
        });
        
        // Update leaderboard if enabled
        if (this.preferences.showOnLeaderboard) {
          await this.updateLeaderboard();
        }
      }
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  },
  
  // Merge local and cloud progress
  mergeProgress(localProgress, cloudProgress) {
    const mergedProgress = {};
    
    // Get all topic keys from both objects
    const allTopics = new Set([
      ...Object.keys(localProgress || {}),
      ...Object.keys(cloudProgress || {})
    ]);
    
    // Merge progress for each topic
    allTopics.forEach(topic => {
      const localTopicProgress = localProgress?.[topic] || [];
      const cloudTopicProgress = cloudProgress?.[topic] || [];
      
      // Combine and deduplicate problem IDs
      const combinedProgress = [...new Set([...localTopicProgress, ...cloudTopicProgress])];
      mergedProgress[topic] = combinedProgress;
    });
    
    return mergedProgress;
  },
  
  // Toggle user preference
  async togglePreference(preference) {
    if (!this.currentUser) return;
    
    this.preferences[preference] = !this.preferences[preference];
    
    try {
      const userRef = doc(db, 'users', this.currentUser.uid);
      await updateDoc(userRef, {
        [`preferences.${preference}`]: this.preferences[preference]
      });
      
      // If toggling leaderboard visibility, update leaderboard
      if (preference === 'showOnLeaderboard') {
        if (this.preferences.showOnLeaderboard) {
          await this.updateLeaderboard();
        } else {
          // Remove from leaderboard
          const leaderboardRef = doc(db, 'leaderboard', this.currentUser.uid);
          await deleteDoc(leaderboardRef);
        }
      }
    } catch (error) {
      console.error(`Error toggling ${preference}:`, error);
    }
  }
});

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    Alpine.store('auth').currentUser = user;
    
    // Sync user data if auto-sync is enabled
    if (Alpine.store('auth').preferences.autoSync) {
      await Alpine.store('auth').syncUserData();
    }
  } else {
    Alpine.store('auth').currentUser = null;
    Alpine.store('auth').userProgress = null;
  }
  
  Alpine.store('status').setLoading(false);
});

// Initialize Alpine.js
Alpine.start();
