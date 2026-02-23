// Reddit content script

(function() {
  'use strict';
  
  console.log('FastEngage: Reddit content script loaded');
  
  function addDraftButton(post) {
    if (post.querySelector('.fastengage-draft-btn')) {
      return;
    }
    
    const actionBar = post.querySelector('.Comment__actions') || 
                      post.querySelector('[data-click-id="comment"]')?.parentElement;
    if (!actionBar) return;
    
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
    const titleElement = post.querySelector('h1') || post.querySelector('[data-testid="post-content"] h3');
    const contentElement = post.querySelector('[data-click-id="text"]') || 
                          post.querySelector('.Comment__body');
    
    const postText = titleElement ? titleElement.innerText : 
                    (contentElement ? contentElement.innerText : '');
    
    const authorElement = post.querySelector('[data-testid="post_author_link"]') ||
                         post.querySelector('._2tbHP6ZydRpjI44J3syuqC');
    const author = authorElement ? authorElement.innerText : 'Unknown';
    
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
      const posts = document.querySelectorAll('[data-testid="post-container"]');
      const comments = document.querySelectorAll('.Comment');
      
      posts.forEach(post => addDraftButton(post));
      comments.forEach(comment => addDraftButton(comment));
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    const posts = document.querySelectorAll('[data-testid="post-container"]');
    const comments = document.querySelectorAll('.Comment');
    posts.forEach(post => addDraftButton(post));
    comments.forEach(comment => addDraftButton(comment));
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observePosts);
  } else {
    observePosts();
  }
})();
