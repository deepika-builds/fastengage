# Development Guide

## Project Structure

```
social-drafter/
├── manifest.json              # Extension configuration
├── background.js              # Service worker (AI generation logic)
├── content-scripts/
│   ├── twitter.js            # Twitter/X integration
│   ├── linkedin.js           # LinkedIn integration
│   └── reddit.js             # Reddit integration
├── sidepanel/
│   ├── index.html            # Side panel UI
│   ├── styles.css            # Side panel styles
│   └── script.js             # Side panel logic
├── options/
│   ├── index.html            # Settings page
│   ├── styles.css            # Settings styles
│   └── script.js             # Settings logic
├── icons/                     # Extension icons
└── docs/                      # Documentation
```

## Key Components

### 1. Background Service Worker (`background.js`)
- Handles message passing between content scripts and side panel
- Manages AI API calls to OpenAI
- Builds prompts with user voice rules and themes
- Stores/retrieves user settings

### 2. Content Scripts
Each platform has its own content script:
- **twitter.js**: Injects "Draft" button into Twitter/X posts
- **linkedin.js**: Injects "Draft" button into LinkedIn posts  
- **reddit.js**: Injects "Draft" button into Reddit posts

Content scripts:
- Observe DOM for new posts
- Extract post content and context
- Handle button clicks
- Send data to background script

### 3. Side Panel (`sidepanel/`)
- Displays post preview
- Shows intent and boldness controls
- Triggers reply generation
- Displays 3 generated replies
- Handles copy-to-clipboard

### 4. Options Page (`options/`)
- API key configuration
- Authority themes setup
- Voice rules management
- Example replies collection
- Tone preference

## Development Workflow

### Setup
```bash
# Navigate to project
cd /Users/deepikarao/Documents/social-drafter

# Load extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select this folder
```

### Testing
```bash
# After making changes:
# 1. Go to chrome://extensions/
# 2. Click reload icon on FastEngage card
# 3. Test on Twitter/LinkedIn/Reddit
```

### Debugging

**Content Scripts:**
```javascript
// Open DevTools on the page
// Content script logs appear in page console
console.log('Debug content script');
```

**Background Worker:**
```javascript
// Go to chrome://extensions/
// Click "Service worker" link under FastEngage
// Background logs appear in worker console
console.log('Debug background');
```

**Side Panel:**
```javascript
// Open side panel
// Right-click in panel → Inspect
// Side panel logs appear in panel DevTools
console.log('Debug side panel');
```

## API Integration

### OpenAI API
The extension uses OpenAI's GPT-4o-mini model for fast, cost-effective generation.

**Key settings:**
- Model: `gpt-4o-mini`
- Temperature: `0.8` (creative but not random)
- Max tokens: `500` (enough for 3 replies)
- Response format: `json_object` (structured output)

**Prompt structure:**
```
System: Engagement strategy + user themes
User: Post + context + voice rules + examples + intent + boldness
Output: JSON array of 3 replies
```

## Adding New Platforms

To add support for a new platform:

1. Create new content script: `content-scripts/[platform].js`
2. Add to manifest.json:
```json
{
  "matches": ["https://[platform].com/*"],
  "js": ["content-scripts/[platform].js"]
}
```
3. Implement in content script:
   - Observe DOM for posts
   - Add "Draft" button
   - Extract post data
   - Send to background script
4. Test thoroughly

## Performance Optimization

### Current optimizations:
- Lightweight content scripts (no dependencies)
- Efficient DOM observation (MutationObserver)
- Minimal API payload (only essential data)
- Fast model (gpt-4o-mini)
- Local storage for settings
- No external analytics or tracking

### Future optimizations:
- Cache frequently used prompts
- Batch API requests
- Lazy load side panel
- Preload settings
- Service worker optimization

## Security Considerations

### Current security measures:
- API key stored in Chrome sync storage (encrypted)
- No data sent to third parties except OpenAI
- Content scripts isolated to specific domains
- No eval() or unsafe code execution
- CSP (Content Security Policy) compliance

### Best practices:
- Never log API keys
- Validate all user input
- Sanitize HTML output
- Use HTTPS only
- Follow Chrome extension security guidelines

## Extension Permissions

**Required permissions:**
- `activeTab`: Access current tab for content extraction
- `storage`: Save user settings and API key
- `sidePanel`: Display side panel UI

**Host permissions:**
- `twitter.com`, `x.com`: Twitter integration
- `linkedin.com`: LinkedIn integration  
- `reddit.com`: Reddit integration

## Testing Checklist

Before releasing:
- [ ] Test on Twitter/X (multiple post types)
- [ ] Test on LinkedIn (posts, comments)
- [ ] Test on Reddit (posts, comments)
- [ ] Test with different API keys
- [ ] Test with invalid API key (error handling)
- [ ] Test with empty settings
- [ ] Test copy-to-clipboard
- [ ] Test regenerate function
- [ ] Test all intent options
- [ ] Test boldness slider
- [ ] Test settings save/load
- [ ] Test on different Chrome versions
- [ ] Test performance (generation time)
- [ ] Test error handling (network issues)
- [ ] Test side panel on different screen sizes

## Common Issues

### "Draft" button not appearing
- Check content script is injected
- Verify DOM selectors are correct
- Platform may have changed their HTML structure
- Check browser console for errors

### Slow generation
- Check internet connection
- OpenAI API may be slow
- Consider caching or using faster model
- Check prompt size (fewer tokens = faster)

### Replies too generic
- User needs better voice rules
- Need more example replies
- Themes not specific enough
- Prompt engineering improvement needed

## Contributing Guidelines

If expanding this project:
1. Follow existing code style
2. Keep performance in mind
3. Test on all platforms
4. Update documentation
5. Add comments for complex logic
6. Keep dependencies minimal

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Content Scripts Guide](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Side Panel API](https://developer.chrome.com/docs/extensions/reference/sidePanel/)
