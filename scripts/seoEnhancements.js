// SEO and Performance Enhancement Script

class SEOEnhancements {
  constructor() {
    this.init();
  }

  init() {
    // Run enhancements after DOM is loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.applyEnhancements()
      );
    } else {
      this.applyEnhancements();
    }
  }

  applyEnhancements() {
    this.preloadCriticalImages();
    this.addStructuredData();
    this.optimizeImages();
    this.addMetaTags();
  }

  // Preload above-the-fold images
  preloadCriticalImages() {
    // Preload spotlight banner background image
    const spotlightBanner = document.getElementById("spotlightBanner");
    if (spotlightBanner) {
      const bgImage = window.getComputedStyle(spotlightBanner).backgroundImage;
      if (bgImage && bgImage !== "none") {
        const imageUrl = bgImage.slice(4, -1).replace(/"/g, "");
        this.preloadImage(imageUrl);
      }
    }
  }

  preloadImage(src) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  }

  // Add structured data for better SEO
  addStructuredData() {
    const spotlightBanner = document.getElementById("spotlightBanner");
    if (!spotlightBanner) return;

    const title = spotlightBanner.querySelector("h1")?.textContent;
    const description = spotlightBanner.querySelector("p")?.textContent;

    if (title && description) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: title,
        description: description,
        url: window.location.origin,
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }

  // Add lazy loading to images below the fold
  optimizeImages() {
    // Add loading="lazy" to images that aren't critical
    const images = document.querySelectorAll("img:not([loading])");
    images.forEach((img, index) => {
      // Skip first few images (above the fold)
      if (index > 2) {
        img.loading = "lazy";
      }
    });
  }

  // Add dynamic meta tags
  addMetaTags() {
    const spotlightBanner = document.getElementById("spotlightBanner");
    if (!spotlightBanner) return;

    const title = spotlightBanner.querySelector("h1")?.textContent;
    const description = spotlightBanner.querySelector("p")?.textContent;

    if (title) {
      // Update page title if not already set
      if (document.title === "Section, components and modules") {
        document.title = title;
      }

      // Add Open Graph tags
      this.addMetaTag("property", "og:title", title);
      this.addMetaTag("property", "og:type", "website");
      this.addMetaTag("property", "og:url", window.location.href);
    }

    if (description) {
      this.addMetaTag("name", "description", description);
      this.addMetaTag("property", "og:description", description);
    }
  }

  addMetaTag(attribute, name, content) {
    // Check if meta tag already exists
    const existing = document.querySelector(`meta[${attribute}="${name}"]`);
    if (existing) {
      existing.content = content;
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute(attribute, name);
      meta.content = content;
      document.head.appendChild(meta);
    }
  }
}

// Initialize SEO enhancements
new SEOEnhancements();
