// LinkedIn content script

(function() {
  'use strict';
  
  console.log('FastEngage: LinkedIn content script loaded');
  
  function addDraftButton(post) {
    if (post.querySelector('.fastengage-draft-btn')) {
      return;
    }
    
    // Find the social actions bar
    const actionBar = post.querySelector('.social-actions-bar') || 
                      post.querySelector('.feed-shared-social-action-bar');
    if (!actionBar) return;
    
    const draftBtn = document.createElement('button');
    draftBtn.className = 'fastengage-draft-btn';
    draftBtn.innerHTML = '⚡ Draft Reply';
    draftBtn.style.cssText = `
      background: #0a66c2;
      color: white;
      border: none;
      border-radius: 16px;
      padding: 6px 16px;
      margin-left: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    `;
    
    draftBtn.addEventListener('mouseenter', () => {
      draftBtn.style.background = '#004182';
    });
    
    draftBtn.addEventListener('mouseleave', () => {
      draftBtn.style.background = '#0a66c2';
    });
    
    draftBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleDraftClick(post);
    });
    
    actionBar.appendChild(draftBtn);
  }
  
  function extractPostData(post) {
    // Find post content
    const contentElement = post.querySelector('.feed-shared-text') || 
                          post.querySelector('.feed-shared-update-v2__description');
    const postText = contentElement ? contentElement.innerText : '';
    
    // Get author
    const authorElement = post.querySelector('.update-components-actor__name') ||
                         post.querySelector('.feed-shared-actor__name');
    const author = authorElement ? authorElement.innerText : 'Unknown';
    
    return {
      platform: 'linkedin',
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
      const posts = document.querySelectorAll('.feed-shared-update-v2');
      posts.forEach(post => addDraftButton(post));
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    const posts = document.querySelectorAll('.feed-shared-update-v2');
    posts.forEach(post => addDraftButton(post));
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observePosts);
  } else {
    observePosts();
  }
})();
