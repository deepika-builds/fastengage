# Changelog

All notable changes to FastEngage will be documented in this file.

## [0.1.0] - 2026-02-23

### Added
- Initial release of FastEngage Chrome extension
- Support for Twitter/X, LinkedIn, and Reddit
- AI-powered reply generation using OpenAI GPT-4o-mini
- Side panel UI with intent selection and boldness control
- Settings page for API key, voice rules, themes, and examples
- Content scripts that inject "Draft" button on posts
- Three reply types: Punchy, Insightful, Bold
- Copy-to-clipboard functionality
- Regenerate option
- Platform detection
- Authority themes integration (bias replies toward user's expertise)
- Voice profile configuration
- Tone selection (Neutral, Confident, Sharp)

### Technical Details
- Manifest V3 compliant
- No external dependencies (vanilla JavaScript)
- Chrome Side Panel API integration
- Background service worker for AI calls
- Local and sync storage for settings
- MutationObserver for dynamic content detection

### Performance
- Target generation time: < 5 seconds
- Average generation time: 3-4 seconds
- Lightweight content scripts
- Minimal performance impact

### Known Limitations
- Requires OpenAI API key (paid)
- English language only
- Chrome browser only
- No offline mode
- No reply history
- No analytics

## [Unreleased]

### Planned Features
- [ ] Support for Instagram and Threads
- [ ] Local AI model option (no API required)
- [ ] Reply history and analytics
- [ ] A/B testing for voice profiles
- [ ] Keyboard shortcuts
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Reply templates
- [ ] Scheduling and reminders
- [ ] Performance metrics dashboard
