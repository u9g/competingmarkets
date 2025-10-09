// function attachSplitDiv(tweet) {
//   // Skip if already has one nearby
//   if (tweet.dataset.splitAttached) return;
//   tweet.dataset.splitAttached = "true";

//   // Create split div container
//   const splitDiv = document.createElement('div');
//   splitDiv.className = 'split-vote-div';
//   splitDiv.style.cssText = `
//     width: 100%;
//     height: 50px;
//     display: flex;
//     margin-top: 8px;
//     border-radius: 8px;
//     overflow: hidden;
//     box-shadow: 0 1px 3px rgba(0,0,0,0.15);
//   `;

//   // Left side - No (Red)
//   const noDiv = document.createElement('div');
//   noDiv.style.cssText = `
//     flex: 1;
//     background-color: #d93025;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     font-size: 16px;
//     font-weight: 600;
//     cursor: pointer;
//   `;
//   noDiv.textContent = 'No';

//   // Right side - Yes (Green)
//   const yesDiv = document.createElement('div');
//   yesDiv.style.cssText = `
//     flex: 1;
//     background-color: #188038;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     font-size: 16px;
//     font-weight: 600;
//     cursor: pointer;
//   `;
//   yesDiv.textContent = 'Yes';

//   // Append both sides
//   splitDiv.appendChild(noDiv);
//   splitDiv.appendChild(yesDiv);

//   // ✅ Find the closest container (tweet’s outer wrapper)
//   const container = tweet.closest('div[data-testid="cellInnerDiv"], div[role="group"], div[role="article"]');
//   if (container && container.parentNode) {
//     container.parentNode.insertBefore(splitDiv, container.nextSibling);
//   } else if (tweet.parentNode) {
//     // fallback
//     tweet.parentNode.appendChild(splitDiv);
//   }
// }

// let children = []

function processExistingTweets(cancelToken) {
    children.forEach(child => child.remove())
    children.length = 0
    document.querySelectorAll("article[data-testid='tweet']").forEach(tweet => {
        const reactDiv = document.createElement('div');
        // helloDiv.textContent = 'HELLO';
        // helloDiv.style.cssText = `
        //   width: 100%;
        //   text-align: center;
        //   margin-top: 8px;
        //   font-weight: bold;
        //   color: red;
        // `;

        // Place it *after* the tweet, not inside
        tweet.insertAdjacentElement('afterend', reactDiv);
    });
}

let cancelToken = { cancelled: false }

processExistingTweets(cancelToken);

// const observer = new MutationObserver(() => {
//   cancelToken.cancelled = true
//   cancelToken = { cancelled: false }
//   processExistingTweets(cancelToken)
// });
// observer.observe(document.body, { childList: true, subtree: true });
