function loadComponent(elementId, filePath) {
  return fetch(filePath)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to load ${filePath}`);
      return response.text();
    })
    .then((html) => {
      const container = document.getElementById(elementId);
      container.innerHTML = html;
      loadNestedComponents(container); // Load nested components
    })
    .catch((error) => console.error(`Error loading ${filePath}:`, error));
}

// New function to load modular components
function loadModularComponent(moduleId) {
  return new Promise(async (resolve, reject) => {
    try {
      const modulePath = await getModulePath(moduleId);
      if (!modulePath) {
        throw new Error(`Module ${moduleId} not found`);
      }

      // Load HTML
      const htmlPath = `${modulePath}/${moduleId}.html`;
      const htmlResponse = await fetch(htmlPath);
      if (!htmlResponse.ok) throw new Error(`Failed to load ${htmlPath}`);

      const html = await htmlResponse.text();
      const container = document.getElementById(moduleId);
      if (container) {
        container.innerHTML = html;
        loadNestedComponents(container);
      }

      // Load CSS
      await loadModuleCSS(modulePath, moduleId);

      // Load JavaScript
      await loadModuleJS(modulePath, moduleId);

      console.log(`✅ Loaded modular component: ${moduleId}`);
      resolve();
    } catch (error) {
      console.error(`Error loading modular component ${moduleId}:`, error);
      reject(error);
    }
  });
}

// Function to load module CSS
async function loadModuleCSS(modulePath, moduleId) {
  const cssPath = `${modulePath}/${moduleId}.css`;

  try {
    const response = await fetch(cssPath);
    if (response.ok) {
      // Check if CSS is already loaded
      const existingLink = document.querySelector(`link[href="${cssPath}"]`);
      if (!existingLink) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssPath;
        link.setAttribute("data-module", moduleId);
        document.head.appendChild(link);
        console.log(`✅ Loaded CSS for ${moduleId}`);
      }
    }
  } catch (error) {
    console.log(`No CSS file found for ${moduleId}`);
  }
}

// Function to load module JavaScript
async function loadModuleJS(modulePath, moduleId) {
  const jsPath = `${modulePath}/${moduleId}.js`;

  try {
    const response = await fetch(jsPath);
    if (response.ok) {
      // Check if JS is already loaded
      const existingScript = document.querySelector(`script[src="${jsPath}"]`);
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = jsPath;
        script.setAttribute("data-module", moduleId);
        document.body.appendChild(script);
        console.log(`✅ Loaded JS for ${moduleId}`);
      }
    }
  } catch (error) {
    console.log(`No JS file found for ${moduleId}`);
  }
}

// Function to get module path (checks completed first, then in-progress)
async function getModulePath(moduleId) {
  const completedPath = `modules/completed/${moduleId}`;
  const inProgressPath = `modules/in-progress/${moduleId}`;

  // Check completed modules first
  try {
    const response = await fetch(`${completedPath}/${moduleId}.html`);
    if (response.ok) {
      return completedPath;
    }
  } catch (error) {
    // Continue to check in-progress
  }

  // Check in-progress modules
  try {
    const response = await fetch(`${inProgressPath}/${moduleId}.html`);
    if (response.ok) {
      return inProgressPath;
    }
  } catch (error) {
    // Module not found
  }

  return null;
}

function loadNestedComponents(parentElement) {
  const elements = parentElement.querySelectorAll("[data-component]");
  if (elements.length === 0) return;

  elements.forEach((el) => {
    const file = el.getAttribute("data-component");

    fetch(file)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        return response.text();
      })
      .then((html) => {
        el.innerHTML = html;
        loadNestedComponents(el); // Recursively load nested components
      })
      .catch((error) =>
        console.error(`Error loading nested component: ${file}`, error)
      );
  });
}

// Updated components array with modular structure
const components = [
  // Modular components from modules/completed folder
  {
    id: "nav",
    filePath: "modules/completed/nav/nav.html",
    jsFile: "modules/completed/nav/nav.js",
  },
  {
    id: "spotlightBanner",
    filePath: "modules/completed/spotlightBanner/spotlightBanner.html",
    jsFile: "modules/completed/spotlightBanner/spotlightBanner.js",
  },
  {
    id: "uspSection",
    filePath: "modules/completed/uspSection/uspSection.html",
    jsFile: "modules/completed/uspSection/uspSection.js",
  },
  {
    id: "categoriesHomepage",
    filePath: "modules/completed/categoriesHomepage/categoriesHomepage.html",
    jsFile: "modules/completed/categoriesHomepage/categoriesHomepage.js",
  },
  {
    id: "categoriesHomepage2",
    filePath: "modules/completed/categoriesHomepage/categoriesHomepage.html",
    jsFile: "modules/completed/categoriesHomepage/categoriesHomepage.js",
  },
  {
    id: "articleSection",
    filePath: "modules/completed/articleSection/articleSection.html",
    jsFile: "modules/completed/articleSection/articleSection.js",
  },
  {
    id: "articleSection2",
    filePath: "modules/completed/articleSection/articleSection.html",
    jsFile: "modules/completed/articleSection/articleSection.js",
  },
  {
    id: "bannersSection2",
    filePath: "modules/completed/bannersSection2/bannersSection2.html",
    jsFile: "modules/completed/bannersSection2/bannersSection2.js",
  },
  {
    id: "farmBannersSection",
    filePath: "modules/completed/bannersSection2/bannersSection2.html",
    jsFile: "modules/completed/bannersSection2/bannersSection2.js",
  },
  {
    id: "announcementBannersSection",
    filePath: "modules/completed/bannersSection2/bannersSection2.html",
    jsFile: "modules/completed/bannersSection2/bannersSection2.js",
  },

  // Global components
  {
    id: "footer",
    filePath: "modules/global/footer/footer.html",
    cssFile: "modules/global/footer/footer.css",
    jsFile: "modules/global/footer/footer.js",
  },

  /* Spotlight Banner sections */
  // {
  //   id: "spotlightBannerWithCards",
  //   filePath: "components/spotlightBannerWithCards.html",
  //   jsFile: null,
  // },
  {
    id: "spotlightBannerRegularImage",
    filePath:
      "modules/completed/spotlightBannerRegularImage/spotlightBannerRegularImage.html",
    cssFile:
      "modules/completed/spotlightBannerRegularImage/spotlightBannerRegularImage.css",
    jsFile:
      "modules/completed/spotlightBannerRegularImage/spotlightBannerRegularImage.js",
  },
  // {
  //   id: "spotlightBannerRegularImageWithCards",
  //   filePath: "components/spotlightBannerRegularImageWithCards.html",
  //   jsFile: null,
  // },

  /* Categories sections - moved to modular */
  // {
  //   id: "categoriesLandingpage",
  //   filePath: "components/categoriesLandingpage.html",
  //   jsFile: null,
  // },

  /* Banners sections */
  // {
  //   id: "bannersSection",
  //   filePath: "components/bannersSection.html",
  //   jsFile: "scripts/banner.js",
  // },
  /* bannersSection2 - moved to modular */
  // {
  //   id: "bannersSection3",
  //   filePath: "components/bannersSection3.html",
  //   jsFile: null,
  // },

  /* Cards sections */
  {
    id: "contentCardsSection",
    filePath: "modules/completed/contentCardsSection/contentCardsSection.html",
    cssFile: "modules/completed/contentCardsSection/contentCardsSection.css",
    jsFile: "modules/completed/contentCardsSection/contentCardsSection.js",
  },
  // {
  //   id: "productCardsSection",
  //   filePath: "components/productCardsSection.html",
  //   jsFile: null,
  // },
  // {
  //   id: "moodboardCardsSection",
  //   filePath: "components/moodboardCardsSection.html",
  //   jsFile: null,
  // },

  /* Farm banners sections */
  // {
  //   id: "farmBannersSection",
  //   filePath: "components/farmBannersSection.html",
  //   jsFile: null,
  // },

  /* Usps sections - moved to modular */

  /* Lists sections */
  // {
  //   id: "listsSection",
  //   filePath: "components/listsSection.html",
  //   jsFile: "scripts/listSection.js",
  // },
  // {
  //   id: "listsSection2",
  //   filePath: "components/listsSection2.html",
  //   jsFile: "scripts/listSection.js",
  // },

  /* Logos sections */
  {
    id: "logosSection",
    filePath: "modules/completed/logosSection/logosSection.html",
    jsFile: "modules/completed/logosSection/logosSection.js",
  },

  /* Elfsight sections */
  {
    id: "elfsightSection",
    filePath: "modules/completed/elfsightSection/elfsightSection.html",
    jsFile: "modules/completed/elfsightSection/elfsightSection.js",
  },

  /* Article sections - moved to modular */

  /* form sections */
  // {
  //   id: "formSection",
  //   filePath: "components/formSection.html",
  //   jsFile: null,
  // },
  // {
  //   id: "newsletterSection",
  //   filePath: "components/newsletterSection.html",
  //   jsFile: null,
  // },
  // {
  //   id: "gridSection",
  //   filePath: "components/gridSection.html",
  //   jsFile: null,
  // },
  {
    id: "faqSection",
    filePath: "modules/completed/faqSection/faqSection.html",
    cssFile: "modules/completed/faqSection/faqSection.css",
    jsFile: "modules/completed/faqSection/faqSection.js",
  },
];

// Function to load all components
function loadAllComponents() {
  const promises = components.map((component) =>
    loadComponent(component.id, component.filePath)
  );

  // Wait for all components to load
  Promise.all(promises)
    .then(() => {
      // Load CSS and JavaScript files for components
      components.forEach((component) => {
        // Load CSS for modular components
        if (component.filePath.startsWith("modules/")) {
          const cssPath = component.filePath.replace(".html", ".css");
          const existingLink = document.querySelector(
            `link[href="${cssPath}"]`
          );
          if (!existingLink) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cssPath;
            link.setAttribute("data-component", component.id);
            document.head.appendChild(link);
          }
        }

        // Load JavaScript files
        if (component.jsFile) {
          const scriptTag = document.createElement("script");
          scriptTag.src = component.jsFile;
          document.body.appendChild(scriptTag);
        }
      });
    })
    .catch((error) => console.error("❌ Error loading components:", error));
}

// Start loading components on DOMContentLoaded
document.addEventListener("DOMContentLoaded", loadAllComponents);
