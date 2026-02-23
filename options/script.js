// Options page script with profile management

let currentProfile = 'twitter';
const profiles = {};

// DOM elements
const apiKeyInput = document.getElementById('apiKey');
const modelSelect = document.getElementById('modelSelect');
const theme1Input = document.getElementById('theme1');
const theme2Input = document.getElementById('theme2');
const theme3Input = document.getElementById('theme3');
const voiceRulesContainer = document.getElementById('voiceRulesContainer');
const exampleRepliesContainer = document.getElementById('exampleRepliesContainer');
const toneSelect = document.getElementById('toneSelect');
const addRuleBtn = document.getElementById('addRuleBtn');
const addExampleBtn = document.getElementById('addExampleBtn');
const saveBtn = document.getElementById('saveBtn');
const copyProfileBtn = document.getElementById('copyProfileBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Profile tabs
const profileTabs = document.querySelectorAll('.profile-tab');

// Load settings on page load
loadSettings();

// Event listeners
profileTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchProfile(tab.dataset.profile);
  });
});

addRuleBtn.addEventListener('click', () => addVoiceRule(''));
addExampleBtn.addEventListener('click', () => addExampleReply(''));
saveBtn.addEventListener('click', saveCurrentProfile);
copyProfileBtn.addEventListener('click', copyToOtherProfiles);

// Switch between profiles
function switchProfile(profile) {
  // Save current profile data before switching
  saveProfileData(currentProfile);
  
  // Switch to new profile
  currentProfile = profile;
  
  // Update UI
  profileTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.profile === profile);
  });
  
  // Update profile indicators
  const indicators = document.querySelectorAll('.profile-indicator');
  indicators.forEach(ind => {
    ind.textContent = `(${profile})`;
  });
  
  // Load profile data
  loadProfileData(profile);
}

// Save current profile data to memory
function saveProfileData(profile) {
  const voiceRules = Array.from(voiceRulesContainer.querySelectorAll('input'))
    .map(input => input.value.trim())
    .filter(rule => rule.length > 0);
  
  const exampleReplies = Array.from(exampleRepliesContainer.querySelectorAll('textarea'))
    .map(textarea => textarea.value.trim())
    .filter(example => example.length > 0);
  
  const themes = [
    theme1Input.value.trim(),
    theme2Input.value.trim(),
    theme3Input.value.trim()
  ].filter(theme => theme.length > 0);
  
  profiles[profile] = {
    themes,
    voiceRules,
    exampleReplies,
    tone: toneSelect.value
  };
}

// Load profile data from memory
function loadProfileData(profile) {
  const data = profiles[profile] || {
    themes: [],
    voiceRules: [],
    exampleReplies: [],
    tone: 'confident'
  };
  
  // Clear containers
  voiceRulesContainer.innerHTML = '';
  exampleRepliesContainer.innerHTML = '';
  
  // Load themes
  theme1Input.value = data.themes[0] || '';
  theme2Input.value = data.themes[1] || '';
  theme3Input.value = data.themes[2] || '';
  
  // Load voice rules
  if (data.voiceRules.length === 0) {
    // Add defaults
    addVoiceRule('Be direct and clear');
    addVoiceRule('No fluff or filler');
    addVoiceRule('Add real value');
  } else {
    data.voiceRules.forEach(rule => addVoiceRule(rule));
  }
  
  // Load example replies
  if (data.exampleReplies.length === 0) {
    addExampleReply('');
  } else {
    data.exampleReplies.forEach(example => addExampleReply(example));
  }
  
  // Load tone
  toneSelect.value = data.tone;
}

// Load settings from storage
function loadSettings() {
  chrome.storage.sync.get([
    'apiKey',
    'model',
    'profiles'
  ], (result) => {
    // API Key
    apiKeyInput.value = result.apiKey || '';
    
    // Model
    modelSelect.value = result.model || 'gpt-4o-mini';
    
    // Profiles
    if (result.profiles) {
      Object.assign(profiles, result.profiles);
    } else {
      // Initialize with defaults
      profiles.twitter = getDefaultProfile();
      profiles.linkedin = getDefaultProfile();
      profiles.reddit = getDefaultProfile();
    }
    
    // Load current profile
    loadProfileData(currentProfile);
  });
}

function getDefaultProfile() {
  return {
    themes: [
      'AI-native product thinking',
      'No-BS design clarity',
      'Builders > talkers'
    ],
    voiceRules: [
      'Be direct and clear',
      'No fluff or filler',
      'Add real value',
      'Stay confident',
      'Avoid generic phrases'
    ],
    exampleReplies: [
      'This mirrors what I saw building X - the key was Y',
      'Hard disagree. Z is overlooked here',
      'Adding: the real unlock is when you combine A with B'
    ],
    tone: 'confident'
  };
}

// Add voice rule input
function addVoiceRule(value = '') {
  const div = document.createElement('div');
  div.className = 'voice-rule-item';
  div.innerHTML = `
    <input type="text" placeholder="e.g., Be direct and clear" value="${escapeHtml(value)}">
    <button class="btn-remove" onclick="this.parentElement.remove()">Remove</button>
  `;
  voiceRulesContainer.appendChild(div);
}

// Add example reply input
function addExampleReply(value = '') {
  const div = document.createElement('div');
  div.className = 'example-reply-item';
  div.innerHTML = `
    <textarea placeholder="Paste one of your high-performing replies...">${escapeHtml(value)}</textarea>
    <button class="btn-remove" onclick="this.parentElement.remove()">Remove</button>
  `;
  exampleRepliesContainer.appendChild(div);
}

// Save current profile
function saveCurrentProfile() {
  hideMessages();
  
  // Save current profile data
  saveProfileData(currentProfile);
  
  // Validate
  if (!apiKeyInput.value.trim()) {
    showError('API key is required');
    return;
  }
  
  // Save to storage
  chrome.storage.sync.set({
    apiKey: apiKeyInput.value.trim(),
    model: modelSelect.value,
    profiles: profiles
  }, () => {
    showSuccess(`${currentProfile} profile saved!`);
    setTimeout(hideMessages, 2000);
  });
}

// Copy current profile to other profiles
function copyToOtherProfiles() {
  if (!confirm('Copy current profile settings to ALL other platforms?')) {
    return;
  }
  
  saveProfileData(currentProfile);
  const currentData = profiles[currentProfile];
  
  // Copy to all other profiles
  Object.keys(profiles).forEach(profile => {
    if (profile !== currentProfile) {
      profiles[profile] = JSON.parse(JSON.stringify(currentData));
    }
  });
  
  showSuccess('Profile copied to all platforms!');
  setTimeout(hideMessages, 2000);
}

// Show/hide messages
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = 'block';
  errorMessage.style.display = 'none';
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  successMessage.style.display = 'none';
}

function hideMessages() {
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';
}

// Utility
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
