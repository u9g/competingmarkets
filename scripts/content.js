// Chrome extension that overlays a loading indicator on the tab icon when ChatGPT is generating an image

(function () {
  'use strict';

  console.log('Content script loaded!');

  // Store the original favicon
  let originalFavicon = null;
  let isGenerating = false;
  let currentFaviconData = null;
  let faviconCheckInterval = null;

  // Function to get the current favicon
  function getCurrentFavicon() {
    const link = document.querySelector("link[rel*='icon']");
    const result = link ? link.href : null;
    console.log('getCurrentFavicon:', result);
    return result;
  }

  // Function to draw a red X over the favicon when loading
  function setLoadingFavicon() {
    if (isGenerating) return;
    isGenerating = true;


    // Save original favicon if not already saved
    if (!originalFavicon) {
      originalFavicon = getCurrentFavicon();
    }

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      // Draw original favicon
      ctx.drawImage(img, 0, 0, 32, 32);

      // Draw semi-transparent dark overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, 32, 32);

      // Draw red X
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(6, 6);
      ctx.lineTo(26, 26);
      ctx.moveTo(26, 6);
      ctx.lineTo(6, 26);
      ctx.stroke();

      updateFavicon(canvas.toDataURL());
    };
    img.onerror = function () {
      // If can't load favicon, draw red X on solid background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 32, 32);

      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(6, 6);
      ctx.lineTo(26, 26);
      ctx.moveTo(26, 6);
      ctx.lineTo(6, 26);
      ctx.stroke();

      updateFavicon(canvas.toDataURL());
    };
    img.src = originalFavicon || '/favicon.ico';
  }

  // Function to draw a green checkmark on the favicon (always shown when not loading)
  function setCompletedFavicon() {
    isGenerating = false;

    // Save original favicon if not already saved
    if (!originalFavicon) {
      originalFavicon = getCurrentFavicon();
    }

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      // Draw original favicon
      ctx.drawImage(img, 0, 0, 32, 32);

      // Draw semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, 32, 32);

      // Draw green checkmark
      ctx.strokeStyle = '#10a37f';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(8, 16);
      ctx.lineTo(13, 22);
      ctx.lineTo(24, 10);
      ctx.stroke();

      updateFavicon(canvas.toDataURL());
    };
    img.onerror = function () {
      // If can't load favicon, draw checkmark on solid background
      ctx.fillStyle = '#10a37f';
      ctx.fillRect(0, 0, 32, 32);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(8, 16);
      ctx.lineTo(13, 22);
      ctx.lineTo(24, 10);
      ctx.stroke();

      updateFavicon(canvas.toDataURL());
    };
    img.src = originalFavicon || '/favicon.ico';
  }

  // Function to update the favicon
  function updateFavicon(href) {
    console.log('updateFavicon called with:', href);
    currentFaviconData = href;

    // Remove all existing favicon links
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    console.log('Found', existingLinks.length, 'existing favicon links');
    existingLinks.forEach(link => link.remove());

    // Create new favicon link
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    newLink.type = 'image/png';
    newLink.href = href;
    document.head.appendChild(newLink);

    console.log('Favicon updated to:', newLink.href);

    // Start monitoring to prevent ChatGPT from overwriting it
    startFaviconMonitor();
  }

  // Monitor and restore favicon if ChatGPT tries to change it
  function startFaviconMonitor() {
    if (faviconCheckInterval) {
      clearInterval(faviconCheckInterval);
    }

    // Use interval as backup - less frequent to reduce performance impact
    faviconCheckInterval = setInterval(() => {
      const currentLink = document.querySelector("link[rel*='icon']");

      // If favicon was removed or changed, restore it
      if (!currentLink || currentLink.href !== currentFaviconData) {
        console.log('Favicon was changed! Restoring...');
        forceFaviconUpdate();
      }
    }, 500); // Check every 500ms instead of 100ms

    // Also use MutationObserver only on head element (not subtree)
    const headObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // Only check direct children of head
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'LINK' && node.rel && node.rel.includes('icon')) {
              if (node.href !== currentFaviconData) {
                console.log('New favicon link detected, replacing...');
                setTimeout(() => {
                  node.remove();
                  forceFaviconUpdate();
                }, 0);
              }
            }
          });
        } else if (mutation.type === 'attributes' && mutation.target.nodeName === 'LINK' &&
          mutation.target.rel && mutation.target.rel.includes('icon')) {
          if (mutation.target.href !== currentFaviconData) {
            console.log('Favicon href changed, restoring...');
            mutation.target.href = currentFaviconData;
          }
        }
      }
    });

    headObserver.observe(document.head, {
      childList: true,
      subtree: false,  // Only watch direct children, not all descendants
      attributes: true,
      attributeFilter: ['href']
    });
  }

  function forceFaviconUpdate() {
    // Remove any new favicon links
    const links = document.querySelectorAll("link[rel*='icon']");
    links.forEach(link => link.remove());

    // Restore our favicon
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    newLink.type = 'image/png';
    newLink.href = currentFaviconData;
    document.head.appendChild(newLink);
  }

  // Observer to detect when ChatGPT is generating an image
  function observeForImageGeneration() {
    console.log('observeForImageGeneration called');
    console.log('Current hostname:', window.location.hostname);

    // Check if we're on ChatGPT
    if (!window.location.hostname.includes('chatgpt.com') &&
      !window.location.hostname.includes('chat.openai.com')) {
      console.log('Not on ChatGPT, exiting');
      return;
    }

    console.log('On ChatGPT! Showing initial green checkmark');
    // Show green checkmark initially
    setCompletedFavicon();

    // Look for image generation indicators in the DOM
    const observer = new MutationObserver((mutations) => {
      // Look for loading-shimmer spans which indicate image generation
      const loadingShimmers = document.querySelectorAll('span.loading-shimmer');
      const imageGenerationActive = loadingShimmers.length > 0;

      console.log('Checking for shimmer... Found:', loadingShimmers.length, 'isGenerating:', isGenerating);

      if (imageGenerationActive && !isGenerating) {
        console.log('Loading shimmer detected! Showing red X.');
        setLoadingFavicon();
      } else if (!imageGenerationActive && isGenerating) {
        console.log('Loading shimmer gone! Showing green checkmark.');
        setCompletedFavicon();
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeForImageGeneration);
  } else {
    observeForImageGeneration();
  }
})();
