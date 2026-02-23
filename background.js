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
  
  // Get user settings and profile
  const settings = await chrome.storage.sync.get([
    'profiles',
    'model',
    'apiKey'
  ]);
  
  if (!settings.apiKey) {
    throw new Error('API key not configured. Please add it in settings.');
  }
  
  // Get profile for this platform
  const profile = settings.profiles?.[platform] || {
    voiceRules: ['Be direct and clear', 'No fluff'],
    exampleReplies: ['Example reply'],
    themes: ['General expertise'],
    tone: 'confident'
  };
  
  const model = settings.model || 'gpt-4o';
  
  // Build prompt
  const prompt = buildPrompt(
    postText,
    context,
    platform,
    profile.voiceRules,
    profile.exampleReplies,
    profile.themes,
    intent,
    boldness,
    profile.tone
  );
  
  // Call AI API
  const replies = await generateWithAI(settings.apiKey, prompt, model);
  
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

async function generateWithAI(apiKey, prompt, model = 'gpt-4o') {
  console.log(`FastEngage: Using model ${model}`);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: prompt.systemInstruction },
        { role: 'user', content: prompt.userMessage }
      ],
      temperature: 0.8,
      max_tokens: 500
    })
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API request failed: ${response.status}`);
  }
  
  const data = await response.json();
  const content = data.choices[0].message.content;
  
  console.log('Raw AI response:', content);
  
  // Parse the JSON response
  try {
    // Try to extract JSON from the response (in case it has markdown or extra text)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;
    const parsed = JSON.parse(jsonStr);
    
    // Validate the response structure
    if (!Array.isArray(parsed) || parsed.length !== 3) {
      throw new Error('Response must be an array of 3 replies');
    }
    
    // Validate each reply has the required fields
    for (const reply of parsed) {
      if (!reply.type || !reply.reply) {
        throw new Error('Each reply must have "type" and "reply" fields');
      }
    }
    
    return parsed;
  } catch (e) {
    console.error('Failed to parse AI response:', content);
    throw new Error(`Failed to parse AI response: ${e.message}`);
  }
}
