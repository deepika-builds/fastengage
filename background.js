// Background service worker for FastEngage

chrome.runtime.onInstalled.addListener(() => {
  console.log('FastEngage installed');
  
  // Set default settings
  chrome.storage.sync.get(['voiceRules', 'exampleReplies', 'tone', 'themes'], (result) => {
    if (!result.voiceRules) {
      chrome.storage.sync.set({
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
        tone: 'confident',
        themes: [
          'AI-native product thinking',
          'No-BS design clarity',
          'Builders > talkers'
        ],
        apiKey: ''
      });
    }
  });
});

// Handle messages from content scripts and side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_SIDE_PANEL') {
    chrome.sidePanel.open({ windowId: sender.tab.windowId });
    sendResponse({ success: true });
  }
  
  if (message.type === 'EXTRACT_POST') {
    // Store the extracted post data
    chrome.storage.local.set({
      currentPost: message.data,
      timestamp: Date.now()
    });
    
    // Open side panel
    chrome.sidePanel.open({ windowId: sender.tab.windowId });
    sendResponse({ success: true });
  }
  
  if (message.type === 'GENERATE_REPLIES') {
    handleGenerateReplies(message.data)
      .then(replies => sendResponse({ success: true, replies }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
  
  return true;
});

// Generate replies using AI
async function handleGenerateReplies(data) {
  const { postText, context, platform, intent, boldness } = data;
  
  // Get user settings
  const settings = await chrome.storage.sync.get([
    'voiceRules',
    'exampleReplies',
    'tone',
    'themes',
    'apiKey'
  ]);
  
  if (!settings.apiKey) {
    throw new Error('API key not configured. Please add it in settings.');
  }
  
  // Build prompt
  const prompt = buildPrompt(
    postText,
    context,
    platform,
    settings.voiceRules,
    settings.exampleReplies,
    settings.themes,
    intent,
    boldness,
    settings.tone
  );
  
  // Call AI API (using OpenAI for MVP)
  const replies = await generateWithAI(settings.apiKey, prompt);
  
  return replies;
}

function buildPrompt(postText, context, platform, voiceRules, exampleReplies, themes, intent, boldness, tone) {
  const systemInstruction = `You are generating high-engagement social media replies. The goal is visibility, replies, and profile clicks. Avoid generic phrasing. Avoid filler. Write sharp, clear, and scroll-stopping replies. Sound human and intelligent.

The user wants to be known for these themes:
${themes.map(t => `- ${t}`).join('\n')}

Bias your replies to subtly reinforce these themes when relevant.`;

  const userMessage = `Platform: ${platform}

Post:
"""
${postText}
"""

${context ? `Thread context:\n"""\n${context}\n"""\n` : ''}

User voice rules:
${voiceRules.map(r => `- ${r}`).join('\n')}

Example replies from user:
${exampleReplies.map(r => `- ${r}`).join('\n')}

${intent !== 'auto' ? `Intent: ${intent}\n` : ''}
Boldness level: ${boldness}/10
Tone: ${tone}

Generate exactly 3 replies that follow these engagement archetypes:
1. Punchy - Short, high hook, stops scrolling
2. Insightful - Slightly deeper, adds real value
3. Bold - Contrarian or slightly spicy take

Requirements:
- No generic AI phrases
- No emojis unless specified
- No filler words
- No "great post" or "thanks for sharing"
- No fluff
- Avoid preachy tone
- Sentence case only
- Clean formatting
- No hashtags
- Each reply should feel authentic and human
- Bias toward reinforcing user's authority themes when relevant

Return ONLY valid JSON in this exact format:
[
  {"type":"punchy","reply":"[your reply here]"},
  {"type":"insightful","reply":"[your reply here]"},
  {"type":"bold","reply":"[your reply here]"}
]`;

  return { systemInstruction, userMessage };
}

async function generateWithAI(apiKey, prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt.systemInstruction },
        { role: 'user', content: prompt.userMessage }
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: "json_object" }
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }
  
  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // Parse the JSON response
  try {
    const parsed = JSON.parse(content);
    // Handle both array format and object with array property
    return Array.isArray(parsed) ? parsed : parsed.replies;
  } catch (e) {
    throw new Error('Failed to parse AI response');
  }
}
