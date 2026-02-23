# Setup Guide

## Quick Start

### 1. Get an OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Keep it safe - you'll need it in step 3

### 2. Install the Extension

1. Download or clone this repository
2. Open Chrome
3. Go to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select the `social-drafter` folder
7. The extension icon should appear in your toolbar

### 3. Configure Your Settings

1. Click the FastEngage extension icon
2. Click "⚙️ Settings" at the bottom
3. Enter your OpenAI API key
4. Configure your **Authority Themes** - the 3 topics you want to be known for:
   - Example: "AI product thinking", "Design clarity", "Ship fast"
5. Add **Voice Rules** - 5-10 rules about your writing style:
   - Example: "Be direct", "No fluff", "Add value"
6. Add **Example Replies** - paste 5-10 of your best social media replies
7. Choose your default **Tone**: Neutral, Confident, or Sharp
8. Click "Save Settings"

### 4. Start Using It

1. Go to Twitter/X, LinkedIn, or Reddit
2. Find a post you want to reply to
3. Look for the "⚡ Draft" button (added by the extension)
4. Click it
5. The side panel opens with the post preview
6. Click "Generate Replies"
7. Wait 3-5 seconds
8. Get 3 different reply options
9. Click 📋 to copy your favorite
10. Paste and post!

## Tips for Best Results

### Authority Themes

Be specific about your expertise:
- ✅ "No-code automation for SMBs"
- ❌ "Technology"

### Voice Rules

Make them actionable:
- ✅ "Lead with the insight, skip the setup"
- ❌ "Be good at writing"

### Example Replies

Choose your **highest-performing** replies:
- Replies that got lots of likes
- Replies that sparked conversations
- Replies that got you followers
- Avoid generic "thanks for sharing" type replies

### Intent Selection

- **Auto**: Let AI pick the best angle (default)
- **Agree**: When you want to support and build on the idea
- **Disagree**: When you have a contrarian take
- **Nuance**: When something important is missing
- **Question**: When you want to spark discussion
- **Example**: When you can add a practical case

### Boldness Level

- **1-3**: Safe, professional, polite
- **4-6**: Confident, clear stance (default)
- **7-10**: Spicy, contrarian, attention-grabbing

## Troubleshooting

### "API key not configured" error
- Go to Settings and add your OpenAI API key
- Make sure it starts with `sk-`
- Click Save Settings

### "Draft" button doesn't appear
- Refresh the page
- Make sure you're on Twitter/X, LinkedIn, or Reddit
- Check that the extension is enabled in chrome://extensions/

### Generation takes too long
- Check your internet connection
- OpenAI API might be slow - try again
- Consider upgrading your OpenAI plan for faster responses

### Replies sound too generic
- Add more specific voice rules
- Add more example replies
- Increase boldness level
- Make your authority themes more specific

### Can't copy replies
- Grant clipboard permissions when prompted
- Try right-clicking and selecting "Copy"

## Cost Estimate

Using OpenAI's GPT-4o-mini:
- ~500 tokens per generation
- ~$0.001 per generation
- 1000 replies ≈ $1

Very affordable for regular use.

## Security

- Your API key is stored locally in Chrome
- Never shared with anyone except OpenAI
- Extension only has access to the specific social media sites
- No data collection or analytics

## Support

For issues or questions:
1. Check this guide first
2. Review the README.md
3. Open an issue on GitHub (if applicable)
