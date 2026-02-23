// Reddit content script

(function() {
  'use strict';
  
  console.log('FastEngage: Reddit content script loaded');
  
  function addDraftButton(post) {
    if (post.querySelector('.fastengage-draft-btn')) {
      return;
    }
    
    let actionBar = null;
    
    // For new Reddit (shreddit-comment/shreddit-post)
    if (post.tagName === 'SHREDDIT-COMMENT' || post.tagName === 'SHREDDIT-POST') {
      // Look inside the shadow DOM or find visible action elements
      const replyLink = post.querySelector('a[aria-label*="Reply"]') || 
                       post.querySelector('button[aria-label*="Reply"]');
      
      if (replyLink) {
        actionBar = replyLink.parentElement;
      }
      
      // Alternative: look for the slot element that contains actions
      if (!actionBar) {
        const slots = post.querySelectorAll('[slot]');
        for (const slot of slots) {
          if (slot.querySelector('button') || slot.querySelector('a')) {
            actionBar = slot;
            break;
          }
        }
      }
    }
    
    // For old Reddit and other layouts
    if (!actionBar) {
      actionBar = 
        post.querySelector('[data-testid="comment-action-bar"]') ||
        post.querySelector('[data-testid="post-comment-action-bar"]') ||
        post.querySelector('.Comment__actions') ||
        post.querySelector('div[role="group"]') ||
        post.querySelector('.usertext-buttons') ||
        post.querySelector('.entry .buttons');
    }
    
    // Last resort: find any container with links/buttons
    if (!actionBar) {
      const links = post.querySelectorAll('a[href*="comments"], button');
      if (links.length > 0) {
        actionBar = links[0].parentElement;
      }
    }
    
    if (!actionBar) {
      console.log('FastEngage: Could not find action bar for post', post.tagName, post);
      return;
    }
    
    const draftBtn = document.createElement('button');
    draftBtn.className = 'fastengage-draft-btn';
    draftBtn.innerHTML = '⚡';
    draftBtn.title = 'Draft reply with FastEngage';
    draftBtn.style.cssText = `
      background: #fff4f0;
      color: #ff4500;
      border: none;
      border-radius: 4px;
      padding: 3px 7px;
      margin-left: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      z-index: 1;
    `;
    
    draftBtn.addEventListener('mouseenter', () => {
      draftBtn.style.background = '#ffe5d9';
    });
    
    draftBtn.addEventListener('mouseleave', () => {
      draftBtn.style.background = '#fff4f0';
    });
    
    draftBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleDraftClick(post);
    });
    
    actionBar.appendChild(draftBtn);
    console.log('FastEngage: Added draft button to', post.tagName);
  }
  
  function extractPostData(post) {
    let postText = '';
    let author = 'Unknown';
    
    // For shreddit-comment elements
    if (post.tagName === 'SHREDDIT-COMMENT') {
      // Get attributes directly
      author = post.getAttribute('author') || 'Unknown';
      
      // Try to get text content from slots
      const textSlot = post.querySelector('[slot="comment"]') || 
                      post.querySelector('[slot="text-body"]');
      if (textSlot) {
        postText = textSlot.innerText || textSlot.textContent;
      }
      
      // Fallback: get all text content
      if (!postText) {
        postText = post.innerText || post.textContent;
      }
    }
    // For shreddit-post elements  
    else if (post.tagName === 'SHREDDIT-POST') {
      author = post.getAttribute('author') || 'Unknown';
      
      const titleSlot = post.querySelector('[slot="title"]');
      const textSlot = post.querySelector('[slot="text-body"]');
      
      if (titleSlot) {
        postText = titleSlot.innerText || titleSlot.textContent;
      }
      if (textSlot) {
        postText += '\n\n' + (textSlot.innerText || textSlot.textContent);
      }
      
      if (!postText) {
        postText = post.innerText || post.textContent;
      }
    }
    // For old Reddit and other layouts
    else {
      const titleElement = 
        post.querySelector('h1') || 
        post.querySelector('[data-testid="post-content"] h3') ||
        post.querySelector('h3') ||
        post.querySelector('.title');
      
      const contentElement = 
        post.querySelector('[data-testid="post-content"] > div') ||
        post.querySelector('[data-click-id="text"]') || 
        post.querySelector('.Comment__body') ||
        post.querySelector('[data-testid="comment"]') ||
        post.querySelector('.usertext-body');
      
      if (titleElement) {
        postText = titleElement.innerText;
      } else if (contentElement) {
        postText = contentElement.innerText;
      }
      
      const authorElement = 
        post.querySelector('[data-testid="post_author_link"]') ||
        post.querySelector('a[href*="/user/"]') ||
        post.querySelector('.author');
      
      if (authorElement) {
        author = authorElement.innerText.replace(/^u\//, '');
      }
    }
    
    // Clean up text
    postText = postText.trim().substring(0, 2000); // Limit length
    
    console.log('FastEngage: Extracted Reddit post:', { 
      postText: postText.substring(0, 100) + '...', 
      author 
    });
    
    return {
      platform: 'reddit',
      postText,
      author,
      context: '',
      url: window.location.href
    };
  }
  
  function handleDraftClick(post) {
    const postData = extractPostData(post);
    
    chrome.runtime.sendMessage({
      type: 'EXTRACT_POST',
      data: postData
    }, (response) => {
      if (response && response.success) {
        console.log('Post extracted and side panel opened');
      }
    });
  }
  
  function observePosts() {
    const observer = new MutationObserver(() => {
      // Try multiple selectors for different Reddit versions
      const posts = document.querySelectorAll(
        '[data-testid="post-container"], ' +
        'shreddit-post, ' +
        '.Post, ' +
        'article'
      );
      
      const comments = document.querySelectorAll(
        '[data-testid="comment"], ' +
        'shreddit-comment, ' +
        '.Comment'
      );
      
      console.log(`FastEngage: Found ${posts.length} posts and ${comments.length} comments`);
      
      posts.forEach(post => addDraftButton(post));
      comments.forEach(comment => addDraftButton(comment));
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Initial scan
    setTimeout(() => {
      const posts = document.querySelectorAll(
        '[data-testid="post-container"], ' +
        'shreddit-post, ' +
        '.Post, ' +
        'article'
      );
      
      const comments = document.querySelectorAll(
        '[data-testid="comment"], ' +
        'shreddit-comment, ' +
        '.Comment'
      );
      
      console.log(`FastEngage: Initial scan - ${posts.length} posts and ${comments.length} comments`);
      
      posts.forEach(post => addDraftButton(post));
      comments.forEach(comment => addDraftButton(comment));
    }, 1000);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observePosts);
  } else {
    observePosts();
  }
})();
