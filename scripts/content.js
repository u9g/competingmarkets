// Function to create and attach split div to a tweet
function attachSplitDiv(tweet) {
  // Skip if already has split div
  if (tweet.querySelector('.split-vote-div')) return;

  // Create split div container
  const splitDiv = document.createElement('div');
  splitDiv.className = 'split-vote-div';
  splitDiv.style.cssText = `
    position: relative;
    width: 100%;
    height: 50px;
    display: flex;
    margin-top: 8px;
  `;

  // Left side - No (Red)
  const noDiv = document.createElement('div');
  noDiv.style.cssText = `
    flex: 1;
    background-color: red;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  `;
  noDiv.textContent = 'No';

  // Right side - Yes (Green)
  const yesDiv = document.createElement('div');
  yesDiv.style.cssText = `
    flex: 1;
    background-color: green;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  `;
  yesDiv.textContent = 'Yes';

  // Append both sides to the split div
  splitDiv.appendChild(noDiv);
  splitDiv.appendChild(yesDiv);

  // Add to tweet
  tweet.appendChild(splitDiv);
}

// Process existing tweets
function processExistingTweets() {
  const tweets = document.querySelectorAll("article[data-testid='tweet']");
  tweets.forEach(tweet => attachSplitDiv(tweet));
}

// Initial processing
processExistingTweets();

// Watch for new tweets being added
const observer = new MutationObserver((mutations) => {
  processExistingTweets();
});

// Start observing the document for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});
