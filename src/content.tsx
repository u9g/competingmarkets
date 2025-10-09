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

      if (document.URL !== "https://x.com/home") {
        const cellInnerDiv = tweet.closest('div[data-testid="cellInnerDiv"]');
        if ((cellInnerDiv?.parentElement?.children.length ?? 2) > 1) {
          return;
        }
      }

      // grok btn manip
      const grokBtn = tweet.querySelector<HTMLButtonElement>(
        'button[aria-label="Grok actions"]'
      );
      if (!grokBtn) return;

      const grokBtnEl = grokBtn.parentElement as HTMLElement;

      const parent = grokBtnEl.parentElement;
      if (!parent) return;

      const grokBtnClone = grokBtnEl.cloneNode(true) as HTMLElement; // <- tell TS it's an element
      parent.insertBefore(grokBtnClone, grokBtnEl);

      grokBtnClone.querySelector("svg")?.replaceWith("Make a bet");
      // grok btn manip

      const reactDiv = document.createElement("div");
      reactDiv.setAttribute("data-vote-component", "true");

      // Place it after the tweet
      tweet.insertAdjacentElement("afterend", reactDiv);

      // Mark the tweet as processed
      tweet.setAttribute("data-vote-component-added", "true");

      // Render React component into the div
      const root = createRoot(reactDiv);

      // Create a function to re-render with updated hover state
      const renderWithHoverState = (isHovering: boolean) => {
        root.render(<BettingForm isHovering={isHovering} />);
      };

      // Initial render with hover state false
      renderWithHoverState(false);

      // Add hover listeners to the tweet element
      tweet.addEventListener("mouseenter", () => {
        renderWithHoverState(true);
      });

      tweet.addEventListener("mouseleave", () => {
        renderWithHoverState(false);
      });
    });
}

processExistingTweets();

// Optional: Observe for new tweets being loaded
const observer = new MutationObserver(() => {
  processExistingTweets();
});
observer.observe(document.body, { childList: true, subtree: true });
