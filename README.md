# FastEngage

A Chrome extension that generates high-engagement social media replies in under 10 seconds.

## Features

- **Instant Reply Generation**: Generate 3 engagement-optimized replies in < 5 seconds
- **Multi-Platform Support**: Works on Twitter/X, LinkedIn, and Reddit
- **Voice Preservation**: Configure your writing style and authority themes
- **Smart Engagement**: Uses proven engagement archetypes (punchy, insightful, bold)
- **Human-in-the-Loop**: No auto-posting, you're always in control

## Installation

### For Development

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `social-drafter` folder
5. The extension is now installed

### Configuration

1. Click the FastEngage icon in your browser toolbar
2. Click "Settings" in the side panel
3. Add your OpenAI API key (get one at https://platform.openai.com/api-keys)
4. Configure your authority themes (what you want to be known for)
5. Add 5-10 voice rules that capture your writing style
6. Paste 5-10 examples of your best-performing replies
7. Save settings

## Usage

1. Navigate to Twitter/X, LinkedIn, or Reddit
2. Find a post you want to reply to
3. Click the "⚡ Draft" button that appears on the post
4. The side panel will open showing the post preview
5. (Optional) Adjust the intent and boldness level
6. Click "Generate Replies"
7. Review the 3 generated replies
8. Click the copy button (📋) to copy your chosen reply
9. Paste into the platform's reply box and post

## How It Works

FastEngage uses AI to generate replies that follow proven engagement patterns:

1. **Punchy**: Short, high-hook replies that stop scrolling
2. **Insightful**: Deeper responses that add real value
3. **Bold**: Contrarian or slightly spicy takes

The extension learns your voice from:
- Your authority themes (domains you want to be known for)
- Your voice rules (how you write)
- Your example replies (your best work)

All replies are optimized for:
- Visibility
- Reply generation
- Profile clicks

## Requirements

- Chrome browser (Manifest V3)
- OpenAI API key

## Privacy

- No data is stored on external servers
- API key is stored locally in Chrome's sync storage
- Post content is only sent to OpenAI's API for generation
- No tracking or analytics

## Performance

- Target generation time: < 5 seconds
- Time-to-reply KPI: < 15 seconds
- Lightweight side panel UI
- Minimal performance impact

## Engagement Strategy

The extension generates replies using these high-engagement archetypes:

1. Strong agreement with reframing
2. Sharp disagreement (polite but confident)
3. Add missing layer/nuance
4. One-line insight that expands the idea
5. Ask an intelligent follow-up question
6. Contrarian micro-take
7. Compress the post into a sharper insight
8. Add tactical example

## What This Is NOT

- Not an auto-bot
- Not auto-commenting
- Not scraping at scale
- Not growth hacking
- Not automation

**It is: A cognitive accelerator.**

## Tech Stack

- Manifest V3 Chrome Extension
- Vanilla JavaScript (no frameworks)
- OpenAI GPT-4o-mini API
- Chrome Side Panel API
- Content Scripts for platform integration

## Roadmap

- [ ] Add support for more platforms (Instagram, Threads)
- [ ] Local AI model option (no API key required)
- [ ] Reply history and analytics
- [ ] A/B testing different voice profiles
- [ ] Browser notifications for high-engagement opportunities

## License

MIT

## Author

Built for high-velocity content creators who want to engage without decision fatigue.
