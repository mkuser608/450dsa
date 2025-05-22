// Direct DOM manipulation for login simulation
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded, initializing auth simulation");
  
  // Check if we're on the account page
  const isAccountPage = window.location.pathname.includes('/account/');
  
  if (isAccountPage) {
    console.log("On account page, setting up auth buttons");
    
    // Set up Google sign-in button
    const googleSignIn = document.getElementById('google-signin');
    if (googleSignIn) {
      googleSignIn.addEventListener('click', function() {
        console.log("Google sign-in clicked");
        // Show alert
        alert("Google sign-in would be triggered here. Simulating successful login.");
        
        // Hide not-logged-in section
        const notLoggedIn = document.getElementById('not-logged-in');
        if (notLoggedIn) notLoggedIn.classList.add('hidden');
        
        // Show logged-in section
        const loggedIn = document.getElementById('logged-in');
        if (loggedIn) loggedIn.classList.remove('hidden');
        
        // Update user info
        const userName = document.getElementById('user-name');
        if (userName) userName.textContent = "Google User";
        
        const userEmail = document.getElementById('user-email');
        if (userEmail) userEmail.textContent = "user@gmail.com";
        
        // Update avatar
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) userAvatar.src = "https://ui-avatars.com/api/?name=Google+User";
        
        // Update last synced
        const lastSynced = document.getElementById('last-synced');
        if (lastSynced) lastSynced.textContent = new Date().toLocaleString();
        
        // Update completed problems count for demonstration
        const completedProblems = document.getElementById('completed-problems');
        if (completedProblems) completedProblems.textContent = "45";
        
        // Update progress bar
        const overallProgress = document.getElementById('overall-progress');
        if (overallProgress) overallProgress.style.width = "10%";
        
        const progressPercentage = document.getElementById('progress-percentage');
        if (progressPercentage) progressPercentage.textContent = "10";
        
        console.log("Login simulation complete");
      });
    }
    
    // Set up GitHub sign-in button
    const githubSignIn = document.getElementById('github-signin');
    if (githubSignIn) {
      githubSignIn.addEventListener('click', function() {
        console.log("GitHub sign-in clicked");
        // Show alert
        alert("GitHub sign-in would be triggered here. Simulating successful login.");
        
        // Hide not-logged-in section
        const notLoggedIn = document.getElementById('not-logged-in');
        if (notLoggedIn) notLoggedIn.classList.add('hidden');
        
        // Show logged-in section
        const loggedIn = document.getElementById('logged-in');
        if (loggedIn) loggedIn.classList.remove('hidden');
        
        // Update user info
        const userName = document.getElementById('user-name');
        if (userName) userName.textContent = "GitHub User";
        
        const userEmail = document.getElementById('user-email');
        if (userEmail) userEmail.textContent = "user@github.com";
        
        // Update avatar
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) userAvatar.src = "https://ui-avatars.com/api/?name=GitHub+User";
        
        // Update last synced
        const lastSynced = document.getElementById('last-synced');
        if (lastSynced) lastSynced.textContent = new Date().toLocaleString();
        
        // Update completed problems count for demonstration
        const completedProblems = document.getElementById('completed-problems');
        if (completedProblems) completedProblems.textContent = "45";
        
        // Update progress bar
        const overallProgress = document.getElementById('overall-progress');
        if (overallProgress) overallProgress.style.width = "10%";
        
        const progressPercentage = document.getElementById('progress-percentage');
        if (progressPercentage) progressPercentage.textContent = "10";
        
        console.log("Login simulation complete");
      });
    }
    
    // Set up sign-out button
    const signOut = document.getElementById('sign-out');
    if (signOut) {
      signOut.addEventListener('click', function() {
        console.log("Sign-out clicked");
        
        // Show not-logged-in section
        const notLoggedIn = document.getElementById('not-logged-in');
        if (notLoggedIn) notLoggedIn.classList.remove('hidden');
        
        // Hide logged-in section
        const loggedIn = document.getElementById('logged-in');
        if (loggedIn) loggedIn.classList.add('hidden');
        
        console.log("Sign-out simulation complete");
      });
    }
  }
});
