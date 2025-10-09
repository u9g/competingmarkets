import React from "react";
import { createRoot } from "react-dom/client";
import { BettingForm } from "./form";
import "../app/globals.css";

function processExistingTweets(): void {
  document
    .querySelectorAll<HTMLElement>("article[data-testid='tweet']")
    .forEach((tweet) => {
      // Check if we've already added a reactDiv to this tweet
      if (tweet.hasAttribute("data-vote-component-added")) {
        return;
      }

      const cellInnerDiv = tweet.closest('div[data-testid="cellInnerDiv"]');
      if ((cellInnerDiv?.parentElement?.children.length ?? 2) > 1) {
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
      root.render(<BettingForm />);
    });
}

processExistingTweets();

// Optional: Observe for new tweets being loaded
const observer = new MutationObserver(() => {
  processExistingTweets();
});
observer.observe(document.body, { childList: true, subtree: true });
