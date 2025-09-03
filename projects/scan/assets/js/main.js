// Moved to html

class SpoilerImg extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute("src");
    const alt = this.getAttribute("alt") || "Spoiler image — click to reveal";
    const href = this.getAttribute("href"); // Get the href attribute
    // Check if this spoiler is marked as final via attribute
    const isFinal = this.hasAttribute("final") && this.getAttribute("final") === "true";
    // Check if this spoiler is marked as airender via attribute
    const isAiRender = this.hasAttribute("airender") && this.getAttribute("airender") === "true";
    
    // Update the label based on whether it's a link or spoiler reveal
    const labelText = href ? "Click to open link" : "Spoiler — Click to reveal";
    const ariaLabel = href ? "Link. Click to open." : "Spoiler. Click to reveal.";
    
    this.outerHTML = `
      <div class="spoiler-container is-hidden ${isFinal ? "final-spoiler" : ""} ${isAiRender ? "airender-spoiler" : ""}" ${href ? `data-href="${href}"` : ""}>
        <img src="${src}" alt="${alt}" class="spoiler-img">
        <div class="spoiler-overlay" role="button" tabindex="0" aria-pressed="false" aria-label="${ariaLabel}">
          <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              ${href ? 
                // Link icon
                `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                 <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>` :
                // Eye icon (original spoiler icon)
                `<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/>
                 <circle cx="12" cy="12" r="3"/>
                 <path d="M6 6l12 12"/>`
              }
            </g>
          </svg>
          <div class="label">${labelText}</div>
        </div>
      </div>
    `;
  }
}

customElements.define("spoiler-img", SpoilerImg);

document.addEventListener("click", e => {
  const overlay = e.target.closest(".spoiler-overlay");
  if (!overlay) return;
  
  const container = overlay.closest(".spoiler-container");
  const href = container.getAttribute("data-href");
  
  if (href) {
    // If there's a link, navigate to it
    window.open(href, '_blank');
  } else {
    // Original spoiler reveal behavior
    container.classList.remove("is-hidden");
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-pressed", "true");
  }
});

document.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("spoiler-overlay")) {
    e.preventDefault();
    e.target.click();
  }
});

// Fade out background overlay on scroll
const bigOverlay = document.getElementById("overlay");
if (bigOverlay) {
  window.addEventListener("scroll", () => {
    let scrollY = window.scrollY;
    let fadePoint = window.innerHeight * 0.7;
    if (scrollY > fadePoint) {
      bigOverlay.style.opacity = Math.max(1 - (scrollY - fadePoint) / 300, 0);
    } else {
      bigOverlay.style.opacity = 1;
    }
  });
}

// Inject CSS for final-spoiler and airender-spoiler into the page
const style = document.createElement("style");
style.textContent = `
  .final-spoiler .spoiler-img {
    position: relative;
    border: 4px solid transparent;
    border-radius: 12px;
    background-image: linear-gradient(white, white),
                      linear-gradient(45deg, gold, orange, gold);
    background-origin: border-box;
    background-clip: content-box, border-box;
    animation: sparkleBorder 2s infinite;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
  }
  @keyframes sparkleBorder {
    0%   { box-shadow: 0 0 10px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 255, 0, 0.3); }
    50%  { box-shadow: 0 0 20px rgba(255, 215, 0, 0.9), 0 0 40px rgba(255, 255, 0, 0.5); }
    100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 255, 0, 0.3); }
  }
  .airender-spoiler .spoiler-img {
    border: 4px solid #a464c2; /* Solid purple border */
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(164, 100, 194, 0.7); /* Purple glow */
  }
`;
document.head.appendChild(style);
