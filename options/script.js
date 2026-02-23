// Options page script

// DOM elements
const apiKeyInput = document.getElementById('apiKey');
const theme1Input = document.getElementById('theme1');
const theme2Input = document.getElementById('theme2');
const theme3Input = document.getElementById('theme3');
const voiceRulesContainer = document.getElementById('voiceRulesContainer');
const exampleRepliesContainer = document.getElementById('exampleRepliesContainer');
const toneSelect = document.getElementById('toneSelect');
const addRuleBtn = document.getElementById('addRuleBtn');
const addExampleBtn = document.getElementById('addExampleBtn');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Load settings on page load
loadSettings();

// Event listeners
addRuleBtn.addEventListener('click', () => addVoiceRule(''));
addExampleBtn.addEventListener('click', () => addExampleReply(''));
saveBtn.addEventListener('click', saveSettings);
resetBtn.addEventListener('click', resetToDefaults);

// Load settings from storage
function loadSettings() {
  chrome.storage.sync.get([
    'apiKey',
    'themes',
    'voiceRules',
    'exampleReplies',
    'tone'
  ], (result) => {
    // API Key
    apiKeyInput.value = result.apiKey || '';
    
    // Themes
    const themes = result.themes || [
      'AI-native product thinking',
      'No-BS design clarity',
      'Builders > talkers'
    ];
    theme1Input.value = themes[0] || '';
    theme2Input.value = themes[1] || '';
    theme3Input.value = themes[2] || '';
    
    // Voice rules
    const voiceRules = result.voiceRules || [
      'Be direct and clear',
      'No fluff or filler',
      'Add real value',
      'Stay confident',
      'Avoid generic phrases'
    ];
    voiceRules.forEach(rule => addVoiceRule(rule));
    
    // Example replies
    const exampleReplies = result.exampleReplies || [
      'This mirrors what I saw building X - the key was Y',
      'Hard disagree. Z is overlooked here',
      'Adding: the real unlock is when you combine A with B'
    ];
    exampleReplies.forEach(example => addExampleReply(example));
    
    // Tone
    toneSelect.value = result.tone || 'confident';
  });
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

// Save settings
function saveSettings() {
  hideMessages();
  
  // Collect voice rules
  const voiceRules = Array.from(voiceRulesContainer.querySelectorAll('input'))
    .map(input => input.value.trim())
    .filter(rule => rule.length > 0);
  
  // Collect example replies
  const exampleReplies = Array.from(exampleRepliesContainer.querySelectorAll('textarea'))
    .map(textarea => textarea.value.trim())
    .filter(example => example.length > 0);
  
  // Collect themes
  const themes = [
    theme1Input.value.trim(),
    theme2Input.value.trim(),
    theme3Input.value.trim()
  ].filter(theme => theme.length > 0);
  
  // Validate
  if (!apiKeyInput.value.trim()) {
    showError('API key is required');
    return;
  }
  
  if (voiceRules.length === 0) {
    showError('Please add at least one voice rule');
    return;
  }
  
  if (exampleReplies.length === 0) {
    showError('Please add at least one example reply');
    return;
  }
  
  if (themes.length === 0) {
    showError('Please add at least one authority theme');
    return;
  }
  
  // Save to storage
  chrome.storage.sync.set({
    apiKey: apiKeyInput.value.trim(),
    themes: themes,
    voiceRules: voiceRules,
    exampleReplies: exampleReplies,
    tone: toneSelect.value
  }, () => {
    showSuccess('Settings saved successfully!');
    
    // Auto-hide success message after 3 seconds
    setTimeout(hideMessages, 3000);
  });
}

// Reset to defaults
function resetToDefaults() {
  if (!confirm('Are you sure you want to reset all settings to defaults?')) {
    return;
  }
  
  // Clear containers
  voiceRulesContainer.innerHTML = '';
  exampleRepliesContainer.innerHTML = '';
  
  // Reset form
  apiKeyInput.value = '';
  theme1Input.value = 'AI-native product thinking';
  theme2Input.value = 'No-BS design clarity';
  theme3Input.value = 'Builders > talkers';
  toneSelect.value = 'confident';
  
  // Add defaults
  const defaultRules = [
    'Be direct and clear',
    'No fluff or filler',
    'Add real value',
    'Stay confident',
    'Avoid generic phrases'
  ];
  defaultRules.forEach(rule => addVoiceRule(rule));
  
  const defaultExamples = [
    'This mirrors what I saw building X - the key was Y',
    'Hard disagree. Z is overlooked here',
    'Adding: the real unlock is when you combine A with B'
  ];
  defaultExamples.forEach(example => addExampleReply(example));
  
  showSuccess('Settings reset to defaults. Click "Save Settings" to apply.');
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
