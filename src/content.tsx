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

      const textNode = document.createTextNode("Make a bet");
      const span = document.createElement("span");
      span.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
      span.style.padding = "2px 6px";
      span.style.borderRadius = "4px";
      span.style.color = "#000000";
      span.style.fontWeight = "600";
      span.appendChild(textNode);
      grokBtnClone.querySelector("svg")?.replaceWith(span);
      // grok btn manip

      const reactDiv = document.createElement("div");
      reactDiv.setAttribute("data-vote-component", "true");

      // Place it after the tweet
      tweet.insertAdjacentElement("afterend", reactDiv);

      // Mark the tweet as processed
      tweet.setAttribute("data-vote-component-added", "true");

      // Render React component into the div
      const root = createRoot(reactDiv);

      // Variables to store the expand/collapse functions and state
      let expandForm: (() => void) | null = null;
      let collapseForm: (() => void) | null = null;
      let isFormExpanded = false;

      // Create a function to re-render with updated hover state
      const renderWithHoverState = (isHovering: boolean) => {
        root.render(
          <BettingForm
            isHovering={isHovering}
            onExpandRef={(expandFn, collapseFn, isExpanded) => {
              expandForm = expandFn;
              collapseForm = collapseFn;
              isFormExpanded = isExpanded;
            }}
          />
        );
        // Update span color based on hover state
        span.style.color = isHovering ? "#ffffff" : "#000000";
      };

      // Initial render with hover state false
      renderWithHoverState(false);

      // Add click listener to the "Make a bet" button to toggle form
      grokBtnClone.addEventListener("click", () => {
        if (isFormExpanded && collapseForm) {
          collapseForm();
        } else if (expandForm) {
          expandForm();
        }
      });

      // Add hover listeners to the green box button
      grokBtnClone.addEventListener("mouseenter", () => {
        span.style.color = "#ffffff";
      });

      grokBtnClone.addEventListener("mouseleave", () => {
        span.style.color = "#000000";
      });
    });
}

processExistingTweets();

// Optional: Observe for new tweets being loaded
const observer = new MutationObserver(() => {
  processExistingTweets();
});
observer.observe(document.body, { childList: true, subtree: true });
