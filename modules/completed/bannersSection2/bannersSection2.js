// Banner Section 2 JavaScript
// Enhanced banner card creation with conditional styling
async function createBannerCard(bannerData) {
  try {
    const response = await fetch("modules/components/banner/banner.html");
    const template = await response.text();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;

    const bannerCard = tempDiv.firstElementChild;

    // Apply conditional classes based on JSON properties
    if (bannerData.whiteText) {
      bannerCard.classList.add("white-text");
    }

    if (bannerData.showOverlay) {
      bannerCard.classList.add("show-overlay");
    }

    // Populate the banner card with data
    const img = bannerCard.querySelector(".banner-image img");
    if (img && bannerData.image) {
      img.src = bannerData.image;
      img.alt = bannerData.imageAlt || bannerData.title || "Banner image";

      // Set object-position if specified
      if (bannerData.objectPosition) {
        img.style.objectPosition = bannerData.objectPosition;
      }
    }

    // Update subtitle (h4) - using description as subtitle for backwards compatibility
    const subtitle = bannerCard.querySelector("h4");
    if (subtitle && bannerData.description) {
      subtitle.textContent = bannerData.description;
    }

    // Update title (h2)
    const title = bannerCard.querySelector("h2");
    if (title && bannerData.title) {
      title.textContent = bannerData.title;
    }

    // Update button
    const button = bannerCard.querySelector("a.btn");
    if (button) {
      if (bannerData.buttonText) {
        button.textContent = bannerData.buttonText;
      }
      if (bannerData.link) {
        button.href = bannerData.link;
      }
      // Add button style class (primary, secondary, tertiary, quaternary)
      if (bannerData.buttonStyle) {
        button.classList.add(`btn-${bannerData.buttonStyle}`);
      }
      // Handle external links
      if (bannerData.link && bannerData.link.startsWith("http")) {
        button.target = "_blank";
        button.rel = "noopener noreferrer";
      } else {
        button.removeAttribute("target");
        button.removeAttribute("rel");
      }
    }

    return bannerCard;
  } catch (error) {
    console.log("Could not load banner template:", error);
    return null;
  }
}

// Override the global createBannerCard function with our enhanced version
if (typeof window !== "undefined") {
  window.createBannerCard = createBannerCard;
}
