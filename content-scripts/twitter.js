// Twitter/X content script

(function() {
  'use strict';
  
  console.log('FastEngage: Twitter content script loaded');
  
  // Add "Draft Reply" button to tweets
  function addDraftButton(tweet) {
    // Check if button already exists
    if (tweet.querySelector('.fastengage-draft-btn')) {
      return;
    }
    
    // Find the action bar (likes, retweets, etc.)
    const actionBar = tweet.querySelector('[role="group"]');
    if (!actionBar) return;
    
    // Create draft button
    const draftBtn = document.createElement('button');
    draftBtn.className = 'fastengage-draft-btn';
    draftBtn.innerHTML = '⚡ Draft';
    draftBtn.style.cssText = `
      background: #1d9bf0;
      color: white;
      border: none;
      border-radius: 16px;
      padding: 4px 12px;
      margin-left: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    `;
    
    draftBtn.addEventListener('mouseenter', () => {
      draftBtn.style.background = '#1a8cd8';
    });
    
    draftBtn.addEventListener('mouseleave', () => {
      draftBtn.style.background = '#1d9bf0';
    });
    
    draftBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleDraftClick(tweet);
    });
    
    actionBar.appendChild(draftBtn);
  }
  
  // Extract post content and context
  function extractPostData(tweet) {
    // Find the tweet text
    const tweetText = tweet.querySelector('[data-testid="tweetText"]');
    const postText = tweetText ? tweetText.innerText : '';
    
    // Try to get author
    const authorElement = tweet.querySelector('[data-testid="User-Name"]');
    const author = authorElement ? authorElement.innerText.split('\n')[0] : 'Unknown';
    
    // Get thread context (if this is a reply)
    let context = '';
    const parentTweet = tweet.previousElementSibling;
    if (parentTweet && parentTweet.querySelector('[data-testid="tweetText"]')) {
      const parentText = parentTweet.querySelector('[data-testid="tweetText"]');
      context = parentText ? parentText.innerText : '';
    }
    
    return {
      platform: 'twitter',
      postText,
      author,
      context,
      url: window.location.href
    };
  }
  
  function handleDraftClick(tweet) {
    const postData = extractPostData(tweet);
    
    // Send to background script
    chrome.runtime.sendMessage({
      type: 'EXTRACT_POST',
      data: postData
    }, (response) => {
      if (response && response.success) {
        console.log('Post extracted and side panel opened');
      }
    });
  }
  
  // Observer to detect new tweets
  function observeTweets() {
    const observer = new MutationObserver((mutations) => {
      // Find all tweet articles
      const tweets = document.querySelectorAll('article[data-testid="tweet"]');
      tweets.forEach(tweet => addDraftButton(tweet));
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Initial scan
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    tweets.forEach(tweet => addDraftButton(tweet));
  }
  
  // Start observing after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeTweets);
  } else {
    observeTweets();
  }
})();
