import React from "react";
import { createRoot } from "react-dom/client";
import VoteComponent from "./VoteComponent";

function processExistingTweets(): void {
  document
    .querySelectorAll<HTMLElement>("article[data-testid='tweet']")
    .forEach((tweet) => {
      // Check if we've already added a reactDiv to this tweet
      if (tweet.hasAttribute("data-vote-component-added")) {
        return;
      }

      const reactDiv = document.createElement("div");
      reactDiv.setAttribute("data-vote-component", "true");

      // Place it after the tweet
      tweet.insertAdjacentElement("afterend", reactDiv);

      // Mark the tweet as processed
      tweet.setAttribute("data-vote-component-added", "true");

      // Render React component into the div
      const root = createRoot(reactDiv);
      root.render(<VoteComponent />);
    });
}

processExistingTweets();

// Optional: Observe for new tweets being loaded
const observer = new MutationObserver(() => {
  processExistingTweets();
});
observer.observe(document.body, { childList: true, subtree: true });
