# Testing Checklist for FastEngage

Use this checklist before deploying or sharing the extension.

## Pre-Installation Testing

- [ ] All files are present in the project directory
- [ ] Icons are generated (icon16.png, icon32.png, icon48.png, icon128.png)
- [ ] manifest.json is valid (no syntax errors)
- [ ] Git repository is clean and committed

## Installation Testing

- [ ] Extension loads without errors in chrome://extensions/
- [ ] Extension icon appears in toolbar
- [ ] No console errors in service worker
- [ ] Settings page opens without errors
- [ ] Side panel can be opened

## Settings Configuration Testing

- [ ] Can enter and save API key
- [ ] Can enter and save authority themes (3 fields)
- [ ] Can add voice rules (multiple)
- [ ] Can remove voice rules
- [ ] Can add example replies (multiple)
- [ ] Can remove example replies
- [ ] Can select tone (dropdown works)
- [ ] Settings persist after closing and reopening
- [ ] Reset to defaults works
- [ ] Form validation works (empty API key shows error)
- [ ] Success message shows after saving

## Twitter/X Testing

- [ ] Go to twitter.com or x.com
- [ ] "Draft" button appears on posts
- [ ] "Draft" button has correct styling
- [ ] Clicking "Draft" opens side panel
- [ ] Post content is correctly extracted
- [ ] Post author is correctly extracted
- [ ] Thread context is extracted (if reply)
- [ ] Platform badge shows "twitter"
- [ ] Button works on multiple posts
- [ ] Button persists when scrolling and loading new posts

## LinkedIn Testing

- [ ] Go to linkedin.com
- [ ] "Draft Reply" button appears on posts
- [ ] Button has correct styling
- [ ] Clicking button opens side panel
- [ ] Post content is correctly extracted
- [ ] Post author is correctly extracted
- [ ] Platform badge shows "linkedin"
- [ ] Button works on multiple posts
- [ ] Button persists when scrolling

## Reddit Testing

- [ ] Go to reddit.com
- [ ] "Draft" button appears on posts/comments
- [ ] Button has correct styling
- [ ] Clicking button opens side panel
- [ ] Post content is correctly extracted
- [ ] Platform badge shows "reddit"
- [ ] Button works on multiple posts/comments

## Side Panel UI Testing

- [ ] Panel displays correctly (no layout issues)
- [ ] Post preview shows correctly
- [ ] Platform badge displays with correct color
- [ ] Author name displays
- [ ] Context displays (if available)
- [ ] Intent dropdown works
- [ ] All intent options are present
- [ ] Boldness slider works
- [ ] Slider value updates when dragged
- [ ] Generate button is clickable
- [ ] Settings link works

## AI Generation Testing

- [ ] Clicking "Generate" shows loading state
- [ ] Loading spinner displays
- [ ] Generation completes in < 10 seconds
- [ ] Three replies are generated
- [ ] Replies are different from each other
- [ ] Replies are relevant to the post
- [ ] Replies follow voice rules
- [ ] Replies reflect authority themes
- [ ] No generic AI phrases (check for "great post", "thanks for sharing")
- [ ] Replies use sentence case
- [ ] No unwanted emojis
- [ ] No hashtags

## Reply Card Testing

- [ ] Three reply cards display
- [ ] Each card has correct type label (Punchy, Insightful, Bold)
- [ ] Reply text is readable
- [ ] Copy buttons work
- [ ] Copy button shows "✓" feedback after clicking
- [ ] Text is actually copied to clipboard
- [ ] Regenerate button works
- [ ] Regenerate generates new replies

## Error Handling Testing

- [ ] Test with no API key (should show error)
- [ ] Test with invalid API key (should show error)
- [ ] Test with no internet (should show error)
- [ ] Test with malformed settings (should handle gracefully)
- [ ] Error messages are clear and helpful
- [ ] Dismiss error button works
- [ ] Can recover from errors without reloading

## Intent Selection Testing

Test each intent option:
- [ ] Auto (default)
- [ ] Agree
- [ ] Disagree
- [ ] Add Nuance
- [ ] Ask Question
- [ ] Contrarian
- [ ] Add Example

For each:
- [ ] Generates appropriate reply type
- [ ] Reply matches selected intent

## Boldness Level Testing

- [ ] Test at level 1 (very safe)
- [ ] Test at level 5 (balanced)
- [ ] Test at level 10 (very bold)
- [ ] Notice difference in reply tone

## Performance Testing

- [ ] Generation time < 5 seconds (most of the time)
- [ ] UI doesn't freeze during generation
- [ ] Content scripts don't slow down page load
- [ ] No memory leaks (check after extended use)
- [ ] Console has no errors or warnings

## Multi-Post Testing

- [ ] Test on 5+ different posts
- [ ] Test on different post types (text, with images, videos)
- [ ] Test on posts of different lengths
- [ ] Test on posts in different languages (English primary)
- [ ] Test thread context extraction

## Edge Cases

- [ ] Very long post (500+ characters)
- [ ] Very short post (single word)
- [ ] Post with emojis
- [ ] Post with URLs
- [ ] Post with hashtags
- [ ] Post with mentions
- [ ] Post with code blocks
- [ ] Empty post (just images)
- [ ] Deleted post
- [ ] Private/protected post

## Browser Compatibility

- [ ] Chrome latest version
- [ ] Chrome one version back
- [ ] Test on macOS (if available)
- [ ] Test on Windows (if available)
- [ ] Test on Linux (if available)

## Security Testing

- [ ] API key is not logged to console
- [ ] API key is not visible in network tab
- [ ] Extension only requests necessary permissions
- [ ] No unauthorized network requests
- [ ] User data is not sent anywhere except OpenAI

## Cost Testing

- [ ] Monitor API usage in OpenAI dashboard
- [ ] Verify cost per reply is ~$0.001
- [ ] Check token usage is reasonable (< 600 tokens per gen)

## User Experience

- [ ] Overall flow is intuitive
- [ ] < 15 seconds from click to copied reply
- [ ] Instructions are clear
- [ ] Error messages are helpful
- [ ] Design is clean and minimal
- [ ] No unnecessary friction

## Documentation Verification

- [ ] README is accurate
- [ ] QUICKSTART is accurate
- [ ] SETUP_GUIDE is accurate
- [ ] All links work
- [ ] Examples are relevant
- [ ] Instructions are clear

## Final Checks

- [ ] All tests passed
- [ ] No critical bugs found
- [ ] Performance is acceptable
- [ ] Ready for user testing
- [ ] Documentation is complete

## Known Issues

Document any issues found during testing:

1. Issue: _________________________________
   Severity: [ ] Critical [ ] Major [ ] Minor
   Status: [ ] Fixed [ ] Won't Fix [ ] Todo

2. Issue: _________________________________
   Severity: [ ] Critical [ ] Major [ ] Minor
   Status: [ ] Fixed [ ] Won't Fix [ ] Todo

3. Issue: _________________________________
   Severity: [ ] Critical [ ] Major [ ] Minor
   Status: [ ] Fixed [ ] Won't Fix [ ] Todo

## Notes

Additional observations or feedback:
_______________________________________________
_______________________________________________
_______________________________________________

## Tester Information

- Date: _______________
- Tester: _______________
- Chrome Version: _______________
- OS: _______________

---

**Status**: [ ] Ready to Ship [ ] Needs Work [ ] Blocked
