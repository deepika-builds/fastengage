// Side panel script

let currentPost = null;
let currentReplies = null;

// DOM elements
const platformBadge = document.getElementById('platformBadge');
const postPreview = document.getElementById('postPreview');
const controls = document.getElementById('controls');
const loading = document.getElementById('loading');
const repliesContainer = document.getElementById('repliesContainer');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');

const intentSelect = document.getElementById('intentSelect');
const boldnessSlider = document.getElementById('boldnessSlider');
const boldnessValue = document.getElementById('boldnessValue');
const generateBtn = document.getElementById('generateBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const dismissError = document.getElementById('dismissError');
const settingsLink = document.getElementById('settingsLink');

// Event listeners
boldnessSlider.addEventListener('input', (e) => {
  boldnessValue.textContent = e.target.value;
});

generateBtn.addEventListener('click', generateReplies);
regenerateBtn.addEventListener('click', generateReplies);
dismissError.addEventListener('click', hideError);

settingsLink.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

// Copy buttons
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);
    copyReply(index);
  });
});

// Load current post on panel open
function loadCurrentPost() {
  chrome.storage.local.get(['currentPost'], (result) => {
    if (result.currentPost) {
      currentPost = result.currentPost;
      displayPost(currentPost);
    }
  });
  
  // Load and display model info
  chrome.storage.sync.get(['model'], (result) => {
    const model = result.model || 'gpt-4o';
    document.getElementById('modelInfo').textContent = model;
  });
}

// Display post preview
function displayPost(post) {
  platformBadge.textContent = post.platform;
  platformBadge.className = `platform-badge ${post.platform}`;
  
  postPreview.innerHTML = `
    <div class="post-author">@${post.author}</div>
    <div class="post-content">${escapeHtml(post.postText)}</div>
    ${post.context ? `<div class="post-context">Context: ${escapeHtml(post.context)}</div>` : ''}
  `;
  
  controls.style.display = 'block';
}

// Generate replies
async function generateReplies() {
  if (!currentPost) {
    showError('No post selected. Click "Draft" on a social media post first.');
    return;
  }
  
  // Hide previous states
  hideError();
  repliesContainer.style.display = 'none';
  controls.style.display = 'none';
  loading.style.display = 'block';
  
  const startTime = Date.now();
  
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'GENERATE_REPLIES',
      data: {
        postText: currentPost.postText,
        context: currentPost.context,
        platform: currentPost.platform,
        intent: intentSelect.value,
        boldness: parseInt(boldnessSlider.value)
      }
    });
    
    const elapsed = Date.now() - startTime;
    console.log(`Generation completed in ${elapsed}ms`);
    
    if (response.success) {
      currentReplies = response.replies;
      displayReplies(currentReplies);
    } else {
      throw new Error(response.error || 'Failed to generate replies');
    }
  } catch (error) {
    console.error('Generation error:', error);
    showError(error.message);
    controls.style.display = 'block';
  } finally {
    loading.style.display = 'none';
  }
}

// Display generated replies
function displayReplies(replies) {
  if (!Array.isArray(replies) || replies.length !== 3) {
    showError('Invalid response format from AI');
    controls.style.display = 'block';
    return;
  }
  
  replies.forEach((reply, index) => {
    const replyElement = document.getElementById(`reply${index}`);
    replyElement.value = reply.reply; // Use .value for textarea
  });
  
  repliesContainer.style.display = 'block';
}

// Copy reply to clipboard
function copyReply(index) {
  const replyElement = document.getElementById(`reply${index}`);
  if (!replyElement) return;
  
  const text = replyElement.value; // Get value from textarea
  
  navigator.clipboard.writeText(text).then(() => {
    // Visual feedback
    const btn = document.querySelector(`[data-index="${index}"]`);
    const originalText = btn.textContent;
    btn.textContent = '✓';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1500);
  }).catch(err => {
    console.error('Failed to copy:', err);
    showError('Failed to copy to clipboard');
  });
}

// Error handling
function showError(message) {
  errorMessage.textContent = message;
  errorContainer.style.display = 'block';
}

function hideError() {
  errorContainer.style.display = 'none';
}

// Utility
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize
loadCurrentPost();

// Listen for storage changes (new post selected)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.currentPost) {
    currentPost = changes.currentPost.newValue;
    displayPost(currentPost);
    repliesContainer.style.display = 'none';
  }
});
