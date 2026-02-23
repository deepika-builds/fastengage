// Reddit content script

(function() {
  'use strict';
  
  console.log('FastEngage: Reddit content script loaded');
  
  function addDraftButton(post) {
    if (post.querySelector('.fastengage-draft-btn')) {
      return;
    }
    
    // Try multiple selectors for different Reddit layouts
    let actionBar = 
      post.querySelector('[data-testid="comment-action-bar"]') ||
      post.querySelector('[data-testid="post-comment-action-bar"]') ||
      post.querySelector('.Comment__actions') || 
      post.querySelector('[slot="commentActionRow"]') ||
      post.querySelector('div[style*="display: flex"][style*="gap"]');
    
    // If still not found, try finding any action bar with common Reddit buttons
    if (!actionBar) {
      const commentLink = post.querySelector('a[href*="/comments/"]');
      if (commentLink) {
        actionBar = commentLink.closest('div[style*="display"]');
      }
    }
    
    if (!actionBar) {
      console.log('FastEngage: Could not find action bar for post', post);
      return;
    }
    
    const draftBtn = document.createElement('button');
    draftBtn.className = 'fastengage-draft-btn';
    draftBtn.innerHTML = '⚡ Draft';
    draftBtn.style.cssText = `
      background: #ff4500;
      color: white;
      border: none;
      border-radius: 16px;
      padding: 4px 12px;
      margin-left: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
    `;
    
    draftBtn.addEventListener('mouseenter', () => {
      draftBtn.style.background = '#cc3700';
    });
    
    draftBtn.addEventListener('mouseleave', () => {
      draftBtn.style.background = '#ff4500';
    });
    
    draftBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleDraftClick(post);
    });
    
    actionBar.appendChild(draftBtn);
  }
  
  function extractPostData(post) {
    // Try multiple selectors for post title/content
    const titleElement = 
      post.querySelector('h1') || 
      post.querySelector('[data-testid="post-content"] h3') ||
      post.querySelector('[slot="title"]') ||
      post.querySelector('h3');
    
    const contentElement = 
      post.querySelector('[data-testid="post-content"] > div') ||
      post.querySelector('[data-click-id="text"]') || 
      post.querySelector('[slot="text-body"]') ||
      post.querySelector('.Comment__body') ||
      post.querySelector('[data-testid="comment"]');
    
    let postText = '';
    if (titleElement) {
      postText = titleElement.innerText;
    } else if (contentElement) {
      postText = contentElement.innerText;
    }
    
    // Try to find author
    const authorElement = 
      post.querySelector('[data-testid="post_author_link"]') ||
      post.querySelector('a[href*="/user/"]') ||
      post.querySelector('[slot="authorName"]');
    const author = authorElement ? authorElement.innerText.replace(/^u\//, '') : 'Unknown';
    
    console.log('FastEngage: Extracted Reddit post:', { postText: postText.substring(0, 100), author });
    
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
