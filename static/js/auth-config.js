// auth-config.js - Authentication configuration and logic
// This file is loaded after Alpine.js and Firebase CDN scripts

document.addEventListener('DOMContentLoaded', function() {
  console.log('Auth config script loaded');
  
  // Initialize Firebase with configuration
  // The API key is only in this JS file, not exposed in HTML
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
  if (typeof firebase !== 'undefined') {
    console.log('Firebase is defined, initializing app');
    
    // Check if Firebase is already initialized
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // Wait for Alpine to be ready
    if (typeof Alpine !== 'undefined') {
      console.log('Alpine is defined, setting up auth methods');
      
      // Extend the auth store with actual implementation
      if (Alpine.store('auth')) {
        const authStore = Alpine.store('auth');
        
        // Email/Password Authentication
        authStore.login = async function(email, password) {
          Alpine.store('status').setLoading(true);
          Alpine.store('status').setMessage('Signing in...');
          
          try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            this.currentUser = userCredential.user;
            await this.syncUserData();
            Alpine.store('status').setMessage('Signed in successfully!');
            window.location.href = '/account/';
          } catch (error) {
            Alpine.store('status').setError(error.message);
          } finally {
            Alpine.store('status').setLoading(false);
          }
        };
        
        // Register new user
        authStore.register = async function(email, password) {
          Alpine.store('status').setLoading(true);
          Alpine.store('status').setMessage('Creating account...');
          
          try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
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
        };
        
        // Google Authentication
        authStore.loginWithGoogle = async function() {
          Alpine.store('status').setLoading(true);
          Alpine.store('status').setMessage('Signing in with Google...');
          
          try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const userCredential = await auth.signInWithPopup(provider);
            this.currentUser = userCredential.user;
            
            // Check if user exists, if not create profile
            const userDoc = await db.collection('users').doc(this.currentUser.uid).get();
            if (!userDoc.exists) {
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
        };
        
        // GitHub Authentication
        authStore.loginWithGithub = async function() {
          Alpine.store('status').setLoading(true);
          Alpine.store('status').setMessage('Signing in with GitHub...');
          
          try {
            const provider = new firebase.auth.GithubAuthProvider();
            const userCredential = await auth.signInWithPopup(provider);
            this.currentUser = userCredential.user;
            
            // Check if user exists, if not create profile
            const userDoc = await db.collection('users').doc(this.currentUser.uid).get();
            if (!userDoc.exists) {
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
        };
        
        // Sign out
        authStore.logout = async function() {
          Alpine.store('status').setLoading(true);
          Alpine.store('status').setMessage('Signing out...');
          
          try {
            await auth.signOut();
            this.currentUser = null;
            this.userProgress = null;
            Alpine.store('status').setMessage('Signed out successfully!');
            window.location.href = '/';
          } catch (error) {
            Alpine.store('status').setError(error.message);
          } finally {
            Alpine.store('status').setLoading(false);
          }
        };
        
        // Create user profile in Firestore
        authStore.createUserProfile = async function() {
          if (!this.currentUser) return;
          
          try {
            const userRef = db.collection('users').doc(this.currentUser.uid);
            const localProgress = this.getLocalProgress();
            
            await userRef.set({
              uid: this.currentUser.uid,
              email: this.currentUser.email,
              displayName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
              photoURL: this.currentUser.photoURL || `https://ui-avatars.com/api/?name=${this.currentUser.email.split('@')[0]}`,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
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
        };
        
        // Update user profile
        authStore.updateUserProfile = async function(data) {
          if (!this.currentUser) return;
          
          try {
            const userRef = db.collection('users').doc(this.currentUser.uid);
            await userRef.update({
              ...data,
              lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
          } catch (error) {
            console.error('Error updating user profile:', error);
          }
        };
        
        // Update leaderboard entry
        authStore.updateLeaderboard = async function() {
          if (!this.currentUser || !this.preferences.showOnLeaderboard) return;
          
          try {
            const leaderboardRef = db.collection('leaderboard').doc(this.currentUser.uid);
            const progress = this.userProgress || this.getLocalProgress() || {};
            const totalCompleted = this.calculateTotalCompleted(progress);
            
            await leaderboardRef.set({
              uid: this.currentUser.uid,
              displayName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
              photoURL: this.currentUser.photoURL || `https://ui-avatars.com/api/?name=${this.currentUser.email.split('@')[0]}`,
              totalCompleted: totalCompleted,
              totalProblems: 450,
              percentComplete: Math.round((totalCompleted / 450) * 100),
              lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
          } catch (error) {
            console.error('Error updating leaderboard:', error);
          }
        };
        
        // Calculate total completed problems
        authStore.calculateTotalCompleted = function(progress) {
          if (!progress) return 0;
          
          let total = 0;
          Object.keys(progress).forEach(topic => {
            if (progress[topic] && Array.isArray(progress[topic])) {
              total += progress[topic].length;
            }
          });
          
          return total;
        };
        
        // Get progress from local storage
        authStore.getLocalProgress = function() {
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
        };
        
        // Save progress to local storage
        authStore.saveLocalProgress = function(progress) {
          if (!progress) return;
          
          Object.keys(progress).forEach(topic => {
            if (progress[topic] && Array.isArray(progress[topic])) {
              localStorage.setItem(`topic-${topic}`, JSON.stringify(progress[topic]));
            }
          });
        };
        
        // Sync user data between local storage and Firestore
        authStore.syncUserData = async function() {
          if (!this.currentUser) return;
          
          try {
            // Get user data from Firestore
            const userRef = db.collection('users').doc(this.currentUser.uid);
            const userDoc = await userRef.get();
            
            if (userDoc.exists) {
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
              await userRef.update({
                progress: mergedProgress,
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                lastSynced: firebase.firestore.FieldValue.serverTimestamp()
              });
              
              // Update leaderboard if enabled
              if (this.preferences.showOnLeaderboard) {
                await this.updateLeaderboard();
              }
              
              // Update last synced display
              const lastSyncedElement = document.getElementById('last-synced');
              if (lastSyncedElement) {
                lastSyncedElement.textContent = new Date().toLocaleString();
              }
            }
          } catch (error) {
            console.error('Error syncing user data:', error);
          }
        };
        
        // Merge local and cloud progress
        authStore.mergeProgress = function(localProgress, cloudProgress) {
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
        };
        
        // Toggle user preference
        authStore.togglePreference = async function(preference) {
          if (!this.currentUser) return;
          
          this.preferences[preference] = !this.preferences[preference];
          
          try {
            const userRef = db.collection('users').doc(this.currentUser.uid);
            const update = {};
            update[`preferences.${preference}`] = this.preferences[preference];
            await userRef.update(update);
            
            // If toggling leaderboard visibility, update leaderboard
            if (preference === 'showOnLeaderboard') {
              if (this.preferences.showOnLeaderboard) {
                await this.updateLeaderboard();
              } else {
                // Remove from leaderboard
                const leaderboardRef = db.collection('leaderboard').doc(this.currentUser.uid);
                await leaderboardRef.delete();
              }
            }
          } catch (error) {
            console.error(`Error toggling ${preference}:`, error);
          }
        };
        
        console.log('Auth store methods extended successfully');
      } else {
        console.error('Alpine auth store not found');
      }
    } else {
      console.error('Alpine is not defined');
    }
    
    // Listen for authentication state changes
    auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      
      if (typeof Alpine !== 'undefined' && Alpine.store('auth')) {
        if (user) {
          Alpine.store('auth').currentUser = user;
          
          // Sync user data if auto-sync is enabled
          if (Alpine.store('auth').preferences.autoSync) {
            await Alpine.store('auth').syncUserData();
          }
          
          // Update UI for logged-in state
          const notLoggedIn = document.getElementById('not-logged-in');
          const loggedIn = document.getElementById('logged-in');
          
          if (notLoggedIn) notLoggedIn.style.display = 'none';
          if (loggedIn) loggedIn.style.display = 'block';
          
          // Update user info
          const userName = document.getElementById('user-name');
          if (userName) userName.textContent = user.displayName || user.email.split('@')[0];
          
          const userEmail = document.getElementById('user-email');
          if (userEmail) userEmail.textContent = user.email;
          
          const userAvatar = document.getElementById('user-avatar');
          if (userAvatar) userAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.email.split('@')[0]}`;
        } else {
          Alpine.store('auth').currentUser = null;
          Alpine.store('auth').userProgress = null;
          
          // Update UI for logged-out state
          const notLoggedIn = document.getElementById('not-logged-in');
          const loggedIn = document.getElementById('logged-in');
          
          if (notLoggedIn) notLoggedIn.style.display = 'block';
          if (loggedIn) loggedIn.style.display = 'none';
        }
        
        Alpine.store('status').setLoading(false);
      }
    });
  } else {
    console.error('Firebase is not defined');
  }
});
