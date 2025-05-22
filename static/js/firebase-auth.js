// Initialize Firebase and authentication
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the account page
  const isAccountPage = window.location.pathname.includes('/account/');
  const isLeaderboardPage = window.location.pathname.includes('/leaderboard/');
  
  if (isAccountPage || isLeaderboardPage) {
    console.log("Initializing Firebase auth on", isAccountPage ? "account page" : "leaderboard page");
    
    // Add Account and Leaderboard links to navigation if not already present
    updateNavigation();
    
    // Initialize Firebase auth
    initAuth();
  }
});

// Add Account and Leaderboard links to navigation
function updateNavigation() {
  console.log("Updating navigation with Account and Leaderboard links");
  
  // Check if we're on a page with the navigation menu
  const navMenu = document.getElementById('navMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (navMenu) {
    // Check if account link already exists
    if (!navMenu.querySelector('a[href="/account/"]')) {
      // Create account link
      const accountLink = document.createElement('a');
      accountLink.href = '/account/';
      accountLink.className = 'hover:text-primary-200 transition-colors duration-300';
      accountLink.textContent = 'Account';
      
      // Add before the About link
      const aboutLink = navMenu.querySelector('a[href="/about/"]');
      if (aboutLink) {
        navMenu.insertBefore(accountLink, aboutLink);
      } else {
        // If About link not found, add before dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
          navMenu.insertBefore(accountLink, darkModeToggle);
        } else {
          // If dark mode toggle not found, append to nav
          navMenu.appendChild(accountLink);
        }
      }
    }
    
    // Check if leaderboard link already exists
    if (!navMenu.querySelector('a[href="/leaderboard/"]')) {
      // Create leaderboard link
      const leaderboardLink = document.createElement('a');
      leaderboardLink.href = '/leaderboard/';
      leaderboardLink.className = 'hover:text-primary-200 transition-colors duration-300';
      leaderboardLink.textContent = 'Leaderboard';
      
      // Add after account link
      const accountLink = navMenu.querySelector('a[href="/account/"]');
      if (accountLink && accountLink.nextSibling) {
        navMenu.insertBefore(leaderboardLink, accountLink.nextSibling);
      } else {
        // If account link not found or is last, add before About link
        const aboutLink = navMenu.querySelector('a[href="/about/"]');
        if (aboutLink) {
          navMenu.insertBefore(leaderboardLink, aboutLink);
        } else {
          // If About link not found, add before dark mode toggle
          const darkModeToggle = document.getElementById('darkModeToggle');
          if (darkModeToggle) {
            navMenu.insertBefore(leaderboardLink, darkModeToggle);
          } else {
            // If dark mode toggle not found, append to nav
            navMenu.appendChild(leaderboardLink);
          }
        }
      }
    }
  }
  
  if (mobileMenu) {
    // Similar logic for mobile menu
    if (!mobileMenu.querySelector('a[href="/account/"]')) {
      const mobileAccountLink = document.createElement('a');
      mobileAccountLink.href = '/account/';
      mobileAccountLink.className = 'block hover:text-primary-200 transition';
      mobileAccountLink.textContent = 'Account';
      
      const mobileAboutLink = mobileMenu.querySelector('a[href="/about/"]');
      if (mobileAboutLink) {
        mobileMenu.insertBefore(mobileAccountLink, mobileAboutLink);
      } else {
        mobileMenu.appendChild(mobileAccountLink);
      }
    }
    
    if (!mobileMenu.querySelector('a[href="/leaderboard/"]')) {
      const mobileLeaderboardLink = document.createElement('a');
      mobileLeaderboardLink.href = '/leaderboard/';
      mobileLeaderboardLink.className = 'block hover:text-primary-200 transition';
      mobileLeaderboardLink.textContent = 'Leaderboard';
      
      const mobileAccountLink = mobileMenu.querySelector('a[href="/account/"]');
      if (mobileAccountLink && mobileAccountLink.nextSibling) {
        mobileMenu.insertBefore(mobileLeaderboardLink, mobileAccountLink.nextSibling);
      } else {
        const mobileAboutLink = mobileMenu.querySelector('a[href="/about/"]');
        if (mobileAboutLink) {
          mobileMenu.insertBefore(mobileLeaderboardLink, mobileAboutLink);
        } else {
          mobileMenu.appendChild(mobileLeaderboardLink);
        }
      }
    }
  }
  
  console.log("Navigation updated successfully");
}

// Initialize Firebase auth
function initAuth() {
  console.log("Initializing Firebase authentication");
  
  // Set up auth button listeners
  const googleSignIn = document.getElementById('google-signin');
  const githubSignIn = document.getElementById('github-signin');
  const signOut = document.getElementById('sign-out');
  const syncNow = document.getElementById('sync-now');
  
  if (googleSignIn) {
    googleSignIn.addEventListener('click', function() {
      console.log("Google sign-in button clicked");
      alert("Google sign-in would be triggered here. In a production environment, this would open a Google authentication popup.");
      // Simulate successful login for demonstration
      simulateSuccessfulLogin('Google User', 'user@gmail.com', 'https://ui-avatars.com/api/?name=Google+User');
    });
  }
  
  if (githubSignIn) {
    githubSignIn.addEventListener('click', function() {
      console.log("GitHub sign-in button clicked");
      alert("GitHub sign-in would be triggered here. In a production environment, this would open a GitHub authentication popup.");
      // Simulate successful login for demonstration
      simulateSuccessfulLogin('GitHub User', 'user@github.com', 'https://ui-avatars.com/api/?name=GitHub+User');
    });
  }
  
  if (signOut) {
    signOut.addEventListener('click', function() {
      console.log("Sign-out button clicked");
      // Simulate sign out
      simulateSignOut();
    });
  }
  
  if (syncNow) {
    syncNow.addEventListener('click', function() {
      console.log("Sync now button clicked");
      alert("Data synchronization triggered. In a production environment, this would sync your local progress with Firestore.");
      // Update last synced time
      document.getElementById('last-synced').textContent = new Date().toLocaleString();
    });
  }
  
  // Set up settings toggle listeners
  const autoSyncToggle = document.getElementById('auto-sync');
  const showLeaderboardToggle = document.getElementById('show-leaderboard');
  
  if (autoSyncToggle) {
    autoSyncToggle.addEventListener('change', function() {
      console.log("Auto-sync toggle changed:", this.checked);
      localStorage.setItem('auto-sync', this.checked);
    });
  }
  
  if (showLeaderboardToggle) {
    showLeaderboardToggle.addEventListener('change', function() {
      console.log("Show leaderboard toggle changed:", this.checked);
      localStorage.setItem('show-leaderboard', this.checked);
    });
  }
  
  console.log("Auth initialization complete");
}

// Simulate successful login
function simulateSuccessfulLogin(displayName, email, photoURL) {
  console.log("Simulating successful login for:", displayName);
  
  // Hide login view, show logged in view
  document.getElementById('not-logged-in').classList.add('hidden');
  document.getElementById('logged-in').classList.remove('hidden');
  
  // Update user info
  document.getElementById('user-name').textContent = displayName;
  document.getElementById('user-email').textContent = email;
  
  // Set user avatar
  const avatarElement = document.getElementById('user-avatar');
  if (avatarElement) {
    avatarElement.src = photoURL;
  }
  
  // Update last synced time
  const lastSynced = new Date();
  document.getElementById('last-synced').textContent = lastSynced.toLocaleString();
  
  // Update progress display
  updateProgressDisplay();
  
  console.log("Login simulation complete");
}

// Simulate sign out
function simulateSignOut() {
  console.log("Simulating sign out");
  
  // Hide logged in view, show login view
  document.getElementById('not-logged-in').classList.remove('hidden');
  document.getElementById('logged-in').classList.add('hidden');
  
  console.log("Sign out simulation complete");
}

// Update progress display
function updateProgressDisplay() {
  console.log("Updating progress display");
  
  // This is a placeholder function that will be replaced with actual data
  // from localStorage and Firebase in the implementation
  const totalProblems = 450;
  let completedProblems = 0;
  
  // Topic slugs from the existing site
  const topicSlugs = {
    'array': 'Array',
    'matrix': 'Matrix',
    'string': 'String',
    'searching-sorting': 'Searching & Sorting',
    'linked-list': 'Linked List',
    'binary-trees': 'Binary Trees',
    'bst': 'Binary Search Trees',
    'greedy': 'Greedy',
    'backtracking': 'Backtracking',
    'stacks-queues': 'Stacks & Queues',
    'heap': 'Heap',
    'graph': 'Graph',
    'trie': 'Trie',
    'dynamic-programming': 'Dynamic Programming',
    'bit-manipulation': 'Bit Manipulation'
  };
  
  // Topic problem counts
  const topicProblemCounts = {
    'array': 36,
    'matrix': 10,
    'string': 43,
    'searching-sorting': 36,
    'linked-list': 36,
    'binary-trees': 35,
    'bst': 22,
    'greedy': 35,
    'backtracking': 19,
    'stacks-queues': 38,
    'heap': 18,
    'graph': 44,
    'trie': 6,
    'dynamic-programming': 60,
    'bit-manipulation': 10
  };
  
  // For demonstration, simulate some completed problems
  completedProblems = 45; // 10% completion for demonstration
  
  // Update the DOM with calculated values
  document.getElementById('total-problems').textContent = totalProblems;
  document.getElementById('completed-problems').textContent = completedProblems;
  
  const overallPercentage = Math.round((completedProblems / totalProblems) * 100);
  document.getElementById('overall-progress').style.width = `${overallPercentage}%`;
  document.getElementById('progress-percentage').textContent = overallPercentage;
  
  // Update topic progress
  const topicProgressHTML = [];
  Object.keys(topicSlugs).forEach(slug => {
    // For demonstration, simulate some completed problems per topic
    const topicCompleted = Math.floor(Math.random() * topicProblemCounts[slug]);
    const totalTopicProblems = topicProblemCounts[slug];
    const percentage = Math.round((topicCompleted / totalTopicProblems) * 100);
    
    // Add to topic progress HTML
    const progressBar = document.querySelector(`[data-topic="${slug}"] .progress-bar-fill`);
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
    
    const progressText = document.querySelector(`[data-topic="${slug}"] .progress-text`);
    if (progressText) {
      progressText.textContent = `${topicCompleted}/${totalTopicProblems}`;
    }
  });
  
  console.log("Progress display updated");
}
