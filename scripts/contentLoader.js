// Simple JSON-based content loader
// Loads content from data/{page}/{module}.json files

document.addEventListener("DOMContentLoaded", () => {
  // Get current page name
  const currentPage = getCurrentPageName();

  // Load content after components are loaded
  setTimeout(() => {
    loadPageContent(currentPage);
  }, 1000);
});

function getCurrentPageName() {
  const path = window.location.pathname;
  const page = path.split("/").pop().replace(".html", "") || "homepage";
  return page === "index" ? "homepage" : page;
}

async function loadPageContent(pageName) {
  // List of modules to load for this page
  const modules = [
    "nav",
    "spotlightBanner",
    "uspSection",
    "categoriesHomepage",
    "articleSection",
    "bannersSection2",
    // "faqSection", // Handled by its own component
    "contentCardsSection",
    "farmBannersSection",
    "categoriesHomepage2",
    "announcementBannersSection",
    "spotlightBannerRegularImage",
    "logosSection",
    "elfsightSection",
    "articleSection2",
    // Add more modules here as needed
  ];

  // Load each module's content
  for (const moduleId of modules) {
    await loadModuleContent(pageName, moduleId);
  }
}

async function loadModuleContent(pageName, moduleId) {
  try {
    let response;
    let dataSource;

    // Content loading priority:
    // 1. Page-specific content
    // 2. Global content (for shared modules like nav)
    // 3. Module default content (fallback)

    const contentPaths = [];

    // For global modules, check global first
    if (
      moduleId === "nav" ||
      moduleId === "uspSection" ||
      // moduleId === "faqSection" || // Handled by its own component
      moduleId === "logosSection" ||
      moduleId === "elfsightSection"
    ) {
      contentPaths.push(
        { path: `content/global/${moduleId}.json`, source: "global" },
        {
          path: `modules/completed/${moduleId}/${moduleId}.json`,
          source: "module-default",
        },
        {
          path: `modules/in-progress/${moduleId}/${moduleId}.json`,
          source: "module-default",
        }
      );
    } else {
      // For other modules, check page-specific first
      contentPaths.push(
        {
          path: `content/${pageName}/${moduleId}.json`,
          source: `page-${pageName}`,
        },
        { path: `content/global/${moduleId}.json`, source: "global" },
        {
          path: `modules/completed/${moduleId}/${moduleId}.json`,
          source: "module-default",
        },
        {
          path: `modules/in-progress/${moduleId}/${moduleId}.json`,
          source: "module-default",
        }
      );
    }

    for (const { path, source } of contentPaths) {
      try {
        response = await fetch(path);
        if (response.ok) {
          dataSource = source;
          break;
        }
      } catch (error) {
        // Continue to next path
      }
    }

    if (!response || !response.ok) {
      console.log(
        `No content file found for module: ${moduleId} on page: ${pageName}`
      );
      return;
    }

    const content = await response.json();
    populateModule(moduleId, content);
  } catch (error) {
    console.log(`Could not load content for ${moduleId}:`, error.message);
  }
}

function populateModule(moduleId, content) {
  const element = document.getElementById(moduleId);
  if (!element) return;

  // Wait a bit more for the component to fully load
  setTimeout(() => {
    switch (moduleId) {
      case "nav":
        populateNav(element, content);
        break;
      case "spotlightBanner":
        populateSpotlightBanner(element, content);
        break;
      case "uspSection":
        populateUSPSection(element, content);
        break;
      case "categoriesHomepage":
        populateCategoriesHomepage(element, content);
        break;
      case "categoriesHomepage2":
        populateCategoriesHomepage(element, content);
        break;
      case "articleSection":
        populateArticleSection(element, content);
        break;
      case "articleSection2":
        populateArticleSection(element, content);
        break;
      case "bannersSection2":
        populateBannersSection2(element, content);
        break;
      case "farmBannersSection":
        populateBannersSection2(element, content);
        break;
      case "announcementBannersSection":
        populateBannersSection2(element, content);
        break;
      // case "faqSection":
      //   populateFaqSection(element, content);
      //   break;
      case "contentCardsSection":
        populateContentCardsSection(element, content);
        break;
      case "spotlightBannerRegularImage":
        populateSpotlightBannerRegularImage(element, content);
        break;
      case "logosSection":
        populateLogosSection(element, content);
        break;
      case "elfsightSection":
        populateElfsightSection(element, content);
        break;
      // Add more module types here as needed
      default:
        console.log(`No populator defined for module: ${moduleId}`);
    }
  }, 200);
}

function populateSpotlightBanner(element, content) {
  // Find the spotlight-banner section inside the element (using class selector)
  const section = element.querySelector(".spotlight-banner") || element;

  // Update text elements
  updateElement(section, "h1", content.title);
  updateElement(section, "h4", content.subtitle);
  updateElement(section, "p", content.description);

  // Update button
  const button = section.querySelector("a.btn");
  if (button && content.buttonText) {
    button.textContent = content.buttonText;
    if (content.buttonLink) {
      button.href = content.buttonLink;
    }
    // Remove target="_blank" for internal links, add for external
    if (content.buttonLink && content.buttonLink.startsWith("http")) {
      button.target = "_blank";
      button.rel = "noopener noreferrer";
    } else {
      button.removeAttribute("target");
      button.removeAttribute("rel");
    }
  }

  // Update mobile image with better alt text
  if (content.backgroundImage) {
    const mobileImage = section.querySelector(".hidden-image img");
    if (mobileImage) {
      mobileImage.src = content.backgroundImage;
      mobileImage.alt =
        content.imageAlt || content.title || "Banner background image";
    }
  }

  // Apply CSS classes based on content settings
  if (content.useWhiteText) {
    section.classList.add("white-text");
  } else {
    section.classList.remove("white-text");
  }

  // Add gradient overlay class if enabled
  if (content.useGradientOverlay) {
    section.classList.add("gradient-overlay");
  } else {
    section.classList.remove("gradient-overlay");
  }

  // Apply custom background image if provided
  if (content.backgroundImage) {
    section.style.backgroundImage = `url(${content.backgroundImage})`;
    // Apply custom background position if provided, default to center
    section.style.backgroundPosition = content.backgroundPosition || "center";
  }
}

function populateUSPSection(element, content) {
  if (!content.usps || !Array.isArray(content.usps)) return;

  // Find all USP items in the section
  const uspItems = element.querySelectorAll(
    ".container.flex-row.a-i-center.j-c-center"
  );

  uspItems.forEach((item, index) => {
    if (content.usps[index]) {
      const usp = content.usps[index];

      // Update icon
      const img = item.querySelector("img");
      if (img && usp.icon) {
        img.src = usp.icon;
        img.alt = usp.alt || `USP ${index + 1} icon`;

        // If it's an SVG file, try to load it inline for better styling control
        if (usp.icon.endsWith(".svg")) {
          loadSVGInline(img, usp.icon, usp.alt);
        }
      }

      // Update title and subtitle
      const paragraphs = item.querySelectorAll("p");
      if (paragraphs.length >= 2) {
        // First paragraph is the title (bold)
        if (usp.title) {
          paragraphs[0].textContent = usp.title;
        }
        // Second paragraph is the subtitle
        if (usp.subtitle) {
          paragraphs[1].textContent = usp.subtitle;
        }
      }
    }
  });
}

function populateNav(element, content) {
  // Find the main-nav section inside the element (using class selector)
  const nav = element.querySelector(".main-nav") || element;

  // Update brand
  const brand = nav.querySelector(".nav-brand");
  if (brand && content.brand) {
    brand.textContent = content.brand;
  }

  // Update logo
  const logo = nav.querySelector(".nav-logo img");
  if (logo && content.logo) {
    logo.src = content.logo;
  }

  // Update search placeholder
  const searchInput = nav.querySelector(".nav-search-input");
  if (searchInput && content.searchPlaceholder) {
    searchInput.placeholder = content.searchPlaceholder;
  }

  // Update sign in button
  const signInBtn = nav.querySelector(".nav-signin-btn");
  if (signInBtn && content.signInText) {
    signInBtn.textContent = content.signInText;
  }

  // Update navigation menu items with links from JSON
  if (content.menuItems && Array.isArray(content.menuItems)) {
    const navLinks = nav.querySelectorAll(".nav-link");

    navLinks.forEach((link, index) => {
      if (content.menuItems[index]) {
        const menuItem = content.menuItems[index];
        link.textContent = menuItem.text;
        link.href = menuItem.link;

        // Handle dropdown indicator
        if (menuItem.hasDropdown) {
          link.classList.add("nav-dropdown");
          if (!link.querySelector(".dropdown-arrow")) {
            const arrow = document.createElement("span");
            arrow.className = "dropdown-arrow";
            arrow.textContent = "▼";
            link.appendChild(document.createTextNode(" "));
            link.appendChild(arrow);
          }
        }
      }
    });
  }

  // Update taglines
  if (content.taglines && Array.isArray(content.taglines)) {
    const taglineElements = nav.querySelectorAll(".nav-tagline");
    taglineElements.forEach((tagline, index) => {
      if (content.taglines[index]) {
        tagline.textContent = content.taglines[index];
      }
    });
  }
}

function updateElement(container, selector, text) {
  if (!container || !text) return;
  const element = container.querySelector(selector);
  if (element) {
    element.textContent = text;
  }
}

async function createCategoryCard(categoryData) {
  const response = await fetch(
    "modules/components/categoryCard/categoryCard.html"
  );
  const template = await response.text();

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = template;

  const card = tempDiv.firstElementChild;
  card.href = categoryData.link;
  card.querySelector("img").src = categoryData.image;
  card.querySelector("p.small").textContent = categoryData.name;

  return card;
}

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

async function createFaqItem(faqData) {
  try {
    const response = await fetch("modules/components/faq/faq.html");
    const template = await response.text();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;

    const faqItem = tempDiv.firstElementChild;

    // Update question (h3)
    const question = faqItem.querySelector("h3");
    if (question && faqData.question) {
      question.textContent = faqData.question;
    }

    // Update answer (p)
    const answer = faqItem.querySelector(".answer p");
    if (answer && faqData.answer) {
      answer.textContent = faqData.answer;
    }

    // Update link if provided
    const link = faqItem.querySelector(".answer a");
    if (link && faqData.link) {
      link.textContent = faqData.link.text;
      link.href = faqData.link.href;
      // Handle external links
      if (faqData.link.href && faqData.link.href.startsWith("http")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.removeAttribute("target");
        link.removeAttribute("rel");
      }
    } else if (link) {
      // Hide link if no link data provided
      link.style.display = "none";
    }

    return faqItem;
  } catch (error) {
    console.log("Could not load FAQ template:", error);
    return null;
  }
}

async function createContentCard(cardData) {
  try {
    const response = await fetch(
      "modules/components/contentCard/contentCard.html"
    );
    const template = await response.text();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;

    const contentCard = tempDiv.firstElementChild;

    // Update image
    const img = contentCard.querySelector(".img-container img");
    if (img && cardData.image) {
      img.src = cardData.image;
      img.alt = cardData.imageAlt || cardData.title || "Content image";
    }

    // Update tag
    const tag = contentCard.querySelector(".tag");
    if (tag && cardData.tag) {
      tag.textContent = cardData.tag;
    }

    // Update date
    const date = contentCard.querySelector(".date");
    if (date && cardData.date) {
      date.textContent = cardData.date;
    }

    // Update title
    const title = contentCard.querySelector(".product-title");
    if (title && cardData.title) {
      title.textContent = cardData.title;
    }

    // Update description
    const description = contentCard.querySelector(".description-text");
    if (description && cardData.description) {
      description.textContent = cardData.description;
    }

    // Update link
    if (cardData.link) {
      contentCard.href = cardData.link;
      // Handle external links
      if (cardData.link.startsWith("http")) {
        contentCard.target = "_blank";
        contentCard.rel = "noopener noreferrer";
      } else {
        contentCard.removeAttribute("target");
        contentCard.removeAttribute("rel");
      }
    }

    return contentCard;
  } catch (error) {
    console.log("Could not load content card template:", error);
    return null;
  }
}

async function createFaqItem(faqData) {
  try {
    const response = await fetch("modules/components/faq/faq.html");
    const template = await response.text();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;

    const faqItem = tempDiv.firstElementChild;

    // Update question (h3)
    const question = faqItem.querySelector("h3");
    if (question && faqData.question) {
      question.textContent = faqData.question;
    }

    // Update answer (p)
    const answer = faqItem.querySelector("#answer p");
    if (answer && faqData.answer) {
      answer.textContent = faqData.answer;
    }

    // Update link if provided
    const link = faqItem.querySelector("#answer a");
    if (link && faqData.link) {
      link.textContent = faqData.link.text;
      link.href = faqData.link.href;
      // Handle external links
      if (faqData.link.href && faqData.link.href.startsWith("http")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.removeAttribute("target");
        link.removeAttribute("rel");
      }
    } else if (link) {
      // Hide link if no link data provided
      link.style.display = "none";
    }

    return faqItem;
  } catch (error) {
    console.log("Could not load FAQ template:", error);
    return null;
  }
}

async function populateCategoriesHomepage(element, content) {
  if (!content.categories || !Array.isArray(content.categories)) return;

  // Find the categoriesHomepage section inside the element
  const section = element.querySelector("#categoriesHomepage") || element;

  // Update title
  updateElement(section, "h2", content.title);
  // Update buttons (both desktop and mobile)
  if (content.button) {
    const desktopBtn = section.querySelector(".desktop-btn");
    const mobileBtn = section.querySelector(".mobile-btn");

    if (desktopBtn) {
      desktopBtn.textContent = content.button.text;
      desktopBtn.href = content.button.link;
    }

    if (mobileBtn) {
      mobileBtn.textContent = content.button.text;
      mobileBtn.href = content.button.link;
    }
  }

  // Find the categories container (the flex-row container)
  const container = section.querySelector(
    ".container.flex-row.gap-24px.side-scroll"
  );
  if (!container) return;

  // Clear existing content
  container.innerHTML = "";

  // Create category cards using the module template
  for (const category of content.categories) {
    const categoryCard = await createCategoryCard(category);
    container.appendChild(categoryCard);
  }
}

function populateArticleSection(element, content) {
  if (!content || !content.blocks) return;

  // Find the articleSection inside the element
  const section = element.querySelector("#articleSection") || element;

  // Apply background styling if provided
  if (content.backgroundColor) {
    section.style.backgroundColor = content.backgroundColor;
  }
  if (content.backgroundClass) {
    section.classList.add(content.backgroundClass);
  }

  // Find the content container
  const contentContainer = section.querySelector(
    ".container.max-8.flex-column.a-i-start.gap-2"
  );
  if (!contentContainer) return;

  // Clear existing content
  contentContainer.innerHTML = "";

  // Create blocks based on the blocks array
  content.blocks.forEach((block) => {
    const blockElement = createBlockElement(block);
    if (blockElement) {
      contentContainer.appendChild(blockElement);
    }
  });
}

function createBlockElement(block) {
  let element;

  switch (block.type) {
    case "paragraph":
      element = document.createElement("p");
      element.textContent = block.text;
      if (block.class) {
        element.className = block.class;
      }
      break;

    case "heading":
      element = document.createElement(`h${block.level || 2}`);
      element.textContent = block.text;
      if (block.class) {
        element.className = block.class;
      }
      break;

    case "list":
      element = document.createElement(block.listType || "ul");
      if (block.items && Array.isArray(block.items)) {
        block.items.forEach((item) => {
          const li = document.createElement("li");

          // Handle different item types
          if (typeof item === "string") {
            li.textContent = item;
          } else if (typeof item === "object") {
            // Item can be a link object
            if (item.type === "link") {
              const link = document.createElement("a");
              link.textContent = item.text;
              link.href = item.href || "#";
              if (item.style) link.className = item.style;
              li.appendChild(link);
            } else {
              li.textContent = item.text || "";
            }
          }

          element.appendChild(li);
        });
      }
      break;

    case "blockquote":
      element = document.createElement("blockquote");
      let blockquoteClasses = ["container", "flex-column", "max-6", "gap-1"];
      if (block.size) blockquoteClasses.push(block.size); // small
      element.className = blockquoteClasses.join(" ");
      element.innerHTML = `
        "${block.text}"
        ${block.author ? `<p class="description">${block.author}</p>` : ""}
      `;
      break;

    case "image":
      element = document.createElement("div");
      element.className = "container flex-column a-i-end gap-5";
      element.innerHTML = `
        <div class="aspect-ratio-container container order-1-mobile">
          <a target="_blank" href="${block.link || "#"}">
            <div class="img-container">
              <img class="img-hd border-4px" src="${block.src}" alt="${
        block.alt || ""
      }" />
            </div>
          </a>
        </div>
        ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ""}
      `;
      break;

    case "video":
      element = document.createElement("div");
      element.className = "video-container";

      if (block.platform === "youtube") {
        element.innerHTML = `
          <iframe 
            width="${block.width || "100%"}" 
            height="${block.height || "400"}"
            src="https://www.youtube.com/embed/${block.id}" 
            title="${block.title || "Video"}"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `;
      } else if (block.platform === "vimeo") {
        element.innerHTML = `
          <iframe 
            width="${block.width || "100%"}" 
            height="${block.height || "400"}"
            src="https://player.vimeo.com/video/${block.id}" 
            title="${block.title || "Video"}"
            frameborder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `;
      }
      break;

    case "spacer":
      element = document.createElement("div");
      element.style.height = block.height || "2rem";
      break;

    case "text":
      element = document.createElement("p");
      element.textContent = block.text;

      // Build class string from style and size
      let classes = [];
      if (block.style) classes.push(block.style); // bold, regular, italic
      if (block.size) classes.push(block.size); // small
      if (classes.length > 0) {
        element.className = classes.join(" ");
      }
      break;

    case "description":
      element = document.createElement("p");
      element.textContent = block.text;
      let descClasses = ["description"];
      if (block.color) descClasses.push(block.color); // green
      element.className = descClasses.join(" ");
      break;

    case "link":
      element = document.createElement("a");
      element.textContent = block.text;
      element.href = block.href || "#";
      if (block.style) {
        element.className = block.style; // primary, secondary
      }
      if (block.class) {
        element.className = block.class; // Custom classes like "btn btn-primary"
      }
      if (block.target) {
        element.target = block.target;
      }
      break;

    case "button":
      // Check visibility first - if false, don't create the element
      if (block.visible === false || block.visible === "false") {
        return null;
      }

      // If button has a link, create an anchor element instead
      if (block.href || block.link) {
        element = document.createElement("a");
        element.href = block.href || block.link;
        if (block.target) {
          element.target = block.target;
        }
      } else {
        element = document.createElement("button");
        if (block.onclick) {
          element.setAttribute("onclick", block.onclick);
        }
      }

      element.textContent = block.text;
      if (block.class) {
        element.className = block.class;
      }
      break;

    case "container":
      element = document.createElement("div");
      element.className = block.class || "container";

      // If container has nested blocks, create them
      if (block.blocks && Array.isArray(block.blocks)) {
        block.blocks.forEach((nestedBlock) => {
          const nestedElement = createBlockElement(nestedBlock);
          if (nestedElement) {
            element.appendChild(nestedElement);
          }
        });
      }
      break;

    case "divider":
      element = document.createElement("hr");
      if (block.class) {
        element.className = block.class;
      }
      break;

    default:
      console.log(`Unknown block type: ${block.type}`);
      return null;
  }

  return element;
}

async function populateBannersSection2(element, content) {
  if (!content) return;

  // Find the banners section inside the element
  const section = element.querySelector(".banners-section") || element;

  // Update title
  updateElement(section, ".section-title", content.title);

  // Update buttons (both desktop and mobile)
  if (content.button) {
    const desktopBtn = section.querySelector(".desktop-btn");
    const mobileBtn = section.querySelector(".mobile-btn");

    if (desktopBtn) {
      desktopBtn.textContent = content.button.text;
      desktopBtn.href = content.button.href || "#";
    }

    if (mobileBtn) {
      mobileBtn.textContent = content.button.text;
      mobileBtn.href = content.button.href || "#";
    }
  }

  // Find the banners container
  const container = section.querySelector(".banners-container");
  if (!container) return;

  // Clear existing content
  container.innerHTML = "";

  // Create banner cards using the banner component template
  if (content.banners && Array.isArray(content.banners)) {
    for (const banner of content.banners) {
      const bannerElement = await createBannerCard(banner);
      if (bannerElement) {
        container.appendChild(bannerElement);
      }
    }
  }
}

async function populateFaqSection(element, content) {
  if (!content) return;

  // Find the faqSection inside the element
  const section = element.querySelector("#faqSection") || element;

  // Update intro text
  updateElement(section, "h4", content.subtitle);
  updateElement(section, "h2", content.title);
  updateElement(section, "p", content.description);

  // Update button
  if (content.button) {
    const button = section.querySelector("a.btn");
    if (button) {
      button.textContent = content.button.text;
      button.href = content.button.href;
      // Handle external links
      if (content.button.href && content.button.href.startsWith("http")) {
        button.target = "_blank";
        button.rel = "noopener noreferrer";
      } else {
        button.removeAttribute("target");
        button.removeAttribute("rel");
      }
    }
  }

  // Find the FAQ container (the div with multiple data-component elements)
  const faqContainer = section.querySelector(".container.flex-column.gap-1");
  if (!faqContainer) return;

  // Clear existing FAQ items
  faqContainer.innerHTML = "";

  // Create FAQ items using the faq component template
  if (content.faqs && Array.isArray(content.faqs)) {
    for (const faq of content.faqs) {
      const faqElement = await createFaqItem(faq);
      if (faqElement) {
        faqContainer.appendChild(faqElement);
      }
    }
  }
}

async function populateFaqSection(element, content) {
  if (!content) return;

  // Find the faqSection inside the element
  const section = element.querySelector("#faqSection") || element;

  // Update intro text
  updateElement(section, "h4", content.subtitle);
  updateElement(section, "h2", content.title);
  updateElement(section, "p", content.description);

  // Update button
  if (content.button) {
    const button = section.querySelector("a.btn");
    if (button) {
      button.textContent = content.button.text;
      button.href = content.button.href;
      // Handle external links
      if (content.button.href && content.button.href.startsWith("http")) {
        button.target = "_blank";
        button.rel = "noopener noreferrer";
      } else {
        button.removeAttribute("target");
        button.removeAttribute("rel");
      }
    }
  }

  // Find the FAQ container
  const faqContainer = section.querySelector(".faq-container");
  if (!faqContainer) return;

  // Clear existing FAQ items
  faqContainer.innerHTML = "";

  // Create FAQ items using the faq component template
  if (content.faqs && Array.isArray(content.faqs)) {
    for (const faq of content.faqs) {
      const faqElement = await createFaqItem(faq);
      if (faqElement) {
        faqContainer.appendChild(faqElement);
      }
    }
  }
}

async function populateContentCardsSection(element, content) {
  if (!content) return;

  // Find the contentCardsSection inside the element
  const section = element.querySelector("#contentCardsSection") || element;

  // Update title
  updateElement(section, "h2", content.title);

  // Update buttons (both desktop and mobile)
  if (content.button) {
    const desktopBtn = section.querySelector(".content-cards-desktop-btn");
    const mobileBtn = section.querySelector(".content-cards-mobile-btn");

    if (desktopBtn) {
      desktopBtn.textContent = content.button.text;
      desktopBtn.href = content.button.href;
    }

    if (mobileBtn) {
      mobileBtn.textContent = content.button.text;
      mobileBtn.href = content.button.href;
    }
  }

  // Find the content cards container
  const cardsContainer = section.querySelector(".content-cards-container");
  if (!cardsContainer) return;

  // Clear existing content cards
  cardsContainer.innerHTML = "";

  // Create content cards organized in rows of 4
  if (content.cards && Array.isArray(content.cards)) {
    // Group cards into rows of 4
    for (let i = 0; i < content.cards.length; i += 4) {
      const rowCards = content.cards.slice(i, i + 4);

      // Create a row container
      const rowContainer = document.createElement("div");
      rowContainer.className = "content-cards-row  side-scroll";

      // Add cards to this row
      for (const card of rowCards) {
        const cardElement = await createContentCard(card);
        if (cardElement) {
          rowContainer.appendChild(cardElement);
        }
      }

      // Add the row to the main container
      cardsContainer.appendChild(rowContainer);
    }
  }
}

function populateSpotlightBannerRegularImage(element, content) {
  if (!content) return;

  // Find the spotlightBannerRegularImage section inside the element
  const section =
    element.querySelector("#spotlightBannerRegularImage") || element;

  // Update text elements
  updateElement(section, "h4", content.subtitle);
  updateElement(section, "h2", content.title);
  updateElement(section, "p", content.description);

  // Apply background color if specified
  if (content.backgroundColor) {
    section.style.backgroundColor = content.backgroundColor;
  }

  // Update button
  if (content.button) {
    const button = section.querySelector("a.btn");
    if (button) {
      button.textContent = content.button.text;
      button.href = content.button.href;

      // Remove existing button style classes
      button.classList.remove(
        "btn-primary",
        "btn-secondary",
        "btn-tertiary",
        "btn-quaternary"
      );

      // Add button style class if specified
      if (content.button.style) {
        button.classList.add(`btn-${content.button.style}`);
      } else {
        // Default to secondary if no style specified
        button.classList.add("btn-secondary");
      }

      // Handle external links
      if (content.button.href && content.button.href.startsWith("http")) {
        button.target = "_blank";
        button.rel = "noopener noreferrer";
      } else {
        button.removeAttribute("target");
        button.removeAttribute("rel");
      }
    }
  }

  // Update image
  if (content.image) {
    const img = section.querySelector(".img-container img");
    if (img) {
      img.src = content.image.src;
      img.alt = content.image.alt || content.title || "Spotlight banner image";
    }

    // Update image link
    const imageLink = section.querySelector(".aspect-ratio-container a");
    if (imageLink && content.image.link) {
      imageLink.href = content.image.link;
      // Handle external links
      if (content.image.link.startsWith("http")) {
        imageLink.target = "_blank";
        imageLink.rel = "noopener noreferrer";
      } else {
        imageLink.removeAttribute("target");
        imageLink.removeAttribute("rel");
      }
    }
  }

  // Update credits
  updateElement(section, "figcaption", content.credits);
}

function loadSVGInline(imgElement, svgPath, altText) {
  fetch(svgPath)
    .then((response) => response.text())
    .then((svgContent) => {
      // Create a temporary div to parse the SVG
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = svgContent;
      const svgElement = tempDiv.querySelector("svg");

      if (svgElement) {
        // Copy classes and attributes from img to svg
        if (imgElement.className) {
          svgElement.className = imgElement.className;
        }

        // Set alt text as title for accessibility
        if (altText) {
          const titleElement = document.createElement("title");
          titleElement.textContent = altText;
          svgElement.insertBefore(titleElement, svgElement.firstChild);
        }

        // Replace img with svg
        imgElement.parentNode.replaceChild(svgElement, svgElement);
      }
    })
    .catch((error) => {
      console.log(`Could not load SVG inline: ${svgPath}`, error);
      // Fallback to regular img src
      imgElement.src = svgPath;
      imgElement.alt = altText || "";
    });
}

function populateLogosSection(element, content) {
  if (!content) return;

  // Find the logosSection inside the element
  const section = element.querySelector(".logosSection") || element;

  // Update title
  updateElement(section, "h2", content.title);

  // Find the logos container
  const container = section.querySelector(".logos-container");
  if (!container) return;

  // Clear existing content
  container.innerHTML = "";

  // Create logo elements
  if (content.logos && Array.isArray(content.logos)) {
    content.logos.forEach((logo) => {
      const logoLink = document.createElement("a");
      logoLink.rel = "nofollow";
      if (logo.link && logo.link !== "#") {
        logoLink.href = logo.link;
        // Handle external links
        if (logo.link.startsWith("http")) {
          logoLink.target = "_blank";
          logoLink.rel = "noopener noreferrer nofollow";
        }
      }

      const logoImg = document.createElement("img");
      logoImg.src = logo.src;
      logoImg.alt = logo.alt || "Partner logo";

      logoLink.appendChild(logoImg);
      container.appendChild(logoLink);
    });
  }
}
function populateElfsightSection(element, content) {
  if (!content) return;

  // Find the elfsightSection inside the element
  const section = element.querySelector(".elfsightSection") || element;

  // Update title
  updateElement(section, "h2", content.title);

  // Find the elfsight container
  const container = section.querySelector(".elfsight-container");
  if (!container) return;

  // Clear existing content
  container.innerHTML = "";

  // Load Elfsight platform script if not already loaded
  if (
    content.scriptSrc &&
    !document.querySelector(`script[src="${content.scriptSrc}"]`)
  ) {
    const script = document.createElement("script");
    script.src = content.scriptSrc;
    script.defer = true;
    document.head.appendChild(script);
  }

  // Insert the Elfsight embed code
  if (content.embedCode) {
    container.innerHTML = content.embedCode;

    // Force Elfsight to reinitialize if the platform is already loaded
    setTimeout(() => {
      if (window.eapps && window.eapps.reinit) {
        window.eapps.reinit();
      }
    }, 100);
  }
}
