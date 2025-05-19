document.addEventListener('DOMContentLoaded', function() {
  // Get the current topic slug from the URL
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const topicSlug = pathParts[0];
  
  // Initialize problem data storage
  let problemsData = [];
  const totalProblems = parseInt(document.getElementById('total-problems').textContent);
  
  // Load saved data from localStorage
  function loadSavedData() {
    // Create a key for this topic
    const storageKey = `topic-${topicSlug}`;
    
    // Try to load existing data
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        problemsData = JSON.parse(savedData);
      } else {
        // Initialize with default data
        problemsData = Array(totalProblems).fill().map((_, index) => ({
          id: index,
          done: false,
          bookmark: false,
          notes: ''
        }));
        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify(problemsData));
      }
      
      // Store the total problems count
      localStorage.setItem(`${topicSlug}-total-problems`, totalProblems.toString());
      
      // Update UI based on loaded data
      updateUI();
    } catch (error) {
      console.error('Error loading saved data:', error);
      // Initialize with empty data on error
      problemsData = Array(totalProblems).fill().map((_, index) => ({
        id: index,
        done: false,
        bookmark: false,
        notes: ''
      }));
    }
  }
  
  // Update UI based on current data
  function updateUI() {
    // Count completed problems
    const completedCount = problemsData.filter(problem => problem.done).length;
    
    // Update progress indicators
    const percentage = Math.round((completedCount / totalProblems) * 100);
    document.getElementById('progress-percentage').textContent = `${percentage}%`;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    document.getElementById('completed-problems').textContent = completedCount;
    
    // Update checkboxes and bookmarks
    problemsData.forEach(problem => {
      const checkbox = document.querySelector(`.problem-checkbox[data-problem-id="${problem.id}"]`);
      if (checkbox) {
        checkbox.checked = problem.done;
      }
      
      const bookmarkButton = document.querySelector(`.bookmark-button[data-problem-id="${problem.id}"]`);
      if (bookmarkButton) {
        if (problem.bookmark) {
          bookmarkButton.classList.add('text-yellow-500');
          bookmarkButton.classList.remove('text-gray-400');
        } else {
          bookmarkButton.classList.add('text-gray-400');
          bookmarkButton.classList.remove('text-yellow-500');
        }
      }
    });
  }
  
  // Save data to localStorage
  function saveData() {
    const storageKey = `topic-${topicSlug}`;
    localStorage.setItem(storageKey, JSON.stringify(problemsData));
    updateUI();
  }
  
  // Handle checkbox changes
  document.querySelectorAll('.problem-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const problemId = parseInt(this.dataset.problemId);
      const problem = problemsData.find(p => p.id === problemId);
      
      if (problem) {
        problem.done = this.checked;
        saveData();
      }
    });
  });
  
  // Handle bookmark clicks
  document.querySelectorAll('.bookmark-button').forEach(button => {
    button.addEventListener('click', function() {
      const problemId = parseInt(this.dataset.problemId);
      const problem = problemsData.find(p => p.id === problemId);
      
      if (problem) {
        problem.bookmark = !problem.bookmark;
        saveData();
      }
    });
  });
  
  // Notes modal functionality
  const notesModal = document.getElementById('notes-modal');
  const notesModalTitle = document.getElementById('notes-modal-title');
  const notesContent = document.getElementById('notes-content');
  const notesSaveBtn = document.getElementById('notes-save');
  const notesCancelBtn = document.getElementById('notes-cancel');
  let currentProblemId = null;
  
  // Open notes modal
  document.querySelectorAll('.notes-button').forEach(button => {
    button.addEventListener('click', function() {
      currentProblemId = parseInt(this.dataset.problemId);
      const problem = problemsData.find(p => p.id === currentProblemId);
      const problemTitle = document.querySelector(`tr[data-index="${currentProblemId}"]`).dataset.title;
      
      notesModalTitle.textContent = `Notes: ${problemTitle}`;
      notesContent.value = problem ? problem.notes || '' : '';
      notesModal.classList.remove('hidden');
    });
  });
  
  // Close notes modal
  notesCancelBtn.addEventListener('click', function() {
    notesModal.classList.add('hidden');
    currentProblemId = null;
  });
  
  // Save notes
  notesSaveBtn.addEventListener('click', function() {
    if (currentProblemId !== null) {
      const problem = problemsData.find(p => p.id === currentProblemId);
      if (problem) {
        problem.notes = notesContent.value;
        saveData();
      }
      notesModal.classList.add('hidden');
      currentProblemId = null;
    }
  });
  
  // Search functionality
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#problems-table tr');
    
    rows.forEach(row => {
      const problemId = parseInt(row.dataset.index);
      const problem = problemsData.find(p => p.id === problemId);
      const title = row.dataset.title.toLowerCase();
      const notes = problem ? (problem.notes || '').toLowerCase() : '';
      
      if (title.includes(searchTerm) || notes.includes(searchTerm)) {
        row.classList.remove('hidden');
      } else {
        row.classList.add('hidden');
      }
    });
  });
  
  // Pick random problem
  const pickRandomBtn = document.getElementById('pick-random');
  pickRandomBtn.addEventListener('click', function() {
    const rows = Array.from(document.querySelectorAll('#problems-table tr:not(.hidden)'));
    if (rows.length > 0) {
      // Remove any existing highlights
      rows.forEach(row => row.classList.remove('bg-yellow-100', 'dark:bg-yellow-900'));
      
      // Pick a random row
      const randomIndex = Math.floor(Math.random() * rows.length);
      const randomRow = rows[randomIndex];
      
      // Highlight the row
      randomRow.classList.add('bg-yellow-100', 'dark:bg-yellow-900');
      
      // Scroll to the row
      randomRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  
  // Initialize
  loadSavedData();
});
