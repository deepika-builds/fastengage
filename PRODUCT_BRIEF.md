# Product Brief - FastEngage

## Objective
Build a Chrome extension that instantly drafts high-engagement replies to social media posts while preserving user voice and authority themes.

## Primary KPIs
- Time-to-reply: < 15 seconds
- Generation time: < 5 seconds
- High-likelihood of replies or profile visits

## Engagement Strategy
Generate replies using proven engagement archetypes:
1. Strong agreement with reframing
2. Sharp disagreement (polite but confident)
3. Add missing layer/nuance
4. One-line insight that expands the idea
5. Ask an intelligent follow-up question
6. Contrarian micro-take
7. Compress the post into a sharper insight
8. Add tactical example

## MVP Scope
**Platforms**: Twitter/X, LinkedIn, Reddit  
**Mode**: Human-in-the-loop only (no auto-posting)

## Core Flow
1. User sees a post
2. Clicks "Draft" button
3. Extension extracts post content + context
4. Applies user voice rules and authority themes
5. Generates 3 engagement-optimized replies:
   - Punchy (short, high hook)
   - Insightful (deeper, adds value)
   - Bold (contrarian/spicy)
6. User copies and posts

## Voice Profile
Settings page allows:
- 5-10 voice rules (bullet format)
- 5-10 example high-performing replies
- 3 authority themes (domains to be known for)
- Tone slider: Neutral, Confident, Sharp

## Output Requirements
Exactly 3 replies with constraints:
- ❌ No generic AI phrases
- ❌ No emojis (unless specified)
- ❌ No filler words
- ❌ No "great post" or "thanks for sharing"
- ❌ No hashtags
- ❌ No preachy tone
- ✅ Sentence case only
- ✅ Clean formatting
- ✅ Authentic and human

## UI Requirements
Side panel with:
- Platform detection
- Intent dropdown
- Boldness slider (1-10)
- Generate button
- 3 reply cards with copy buttons
- Regenerate option
- Settings link

## Technical Architecture
- Manifest V3 Chrome extension
- Content scripts for platform integration
- Side Panel API for UI
- Background service worker for AI calls
- OpenAI GPT-4o-mini API
- Chrome storage for settings

## What This Is NOT
- Not an auto-bot
- Not auto-commenting
- Not scraping at scale
- Not growth hacking

**It is: A cognitive accelerator for high-velocity creators.**

## Strategic Insight
The real leverage isn't just drafting replies—it's drafting replies that:
- Position you strategically
- Reinforce your authority themes
- Signal your domain expertise
- Build your personal brand

The AI biases replies to reinforce the user's 3 authority themes, making every engagement count toward long-term positioning.
