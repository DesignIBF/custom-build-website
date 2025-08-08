#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🚀 Starting build process...");

// Helper function to read JSON files
function readJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.warn(`⚠️  Could not read ${filePath}:`, error.message);
    return null;
  }
}

// Helper function to read HTML template
function readHTML(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.warn(`⚠️  Could not read ${filePath}:`, error.message);
    return "";
  }
}

// Helper function to write HTML file
function writeHTML(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Generated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to write ${filePath}:`, error.message);
  }
}

// Generate FAQ section HTML
function generateFAQHTML(faqData) {
  if (!faqData || !faqData.faqs) return "";

  let html = `
    <section id="faqSection" class="bg-dark-cream">
      <div class="container max-10 flex-row gap-24px">
        <div class="container max-4 flex-column j-c-start gap-1">
          <div class="intro-text-container container flex-column a-i-start gap-25">
            <h4>${faqData.subtitle || ""}</h4>
            <h2>${faqData.title || "Frequently Asked Questions"}</h2>
            <p>${faqData.description || ""}</p>
          </div>
          <a href="${faqData.button?.href || "#"}" class="btn btn-primary">${
    faqData.button?.text || "View All FAQs"
  }</a>
        </div>
        <div class="faq-container container flex-column gap-1">
  `;

  faqData.faqs.forEach((faq, index) => {
    html += `
          <div class="container faq-item flex-column" id="faq-${index}">
            <div class="container flex-row between a-i-center">
              <h3>${faq.question}</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
                <rect x="52" width="52" height="52" rx="26" transform="rotate(90 52 0)" fill="#F6F2F0"/>
                <path d="M26 16.6629L26 35.3296L34 27.3296M26 35.3374L18 27.3374" stroke="#0C331F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="answer container flex-column gap-25">
              <p>${faq.answer}</p>
              ${
                faq.link && faq.link.text
                  ? `<a href="${faq.link.href}" target="_blank">${faq.link.text}</a>`
                  : ""
              }
            </div>
          </div>
    `;
  });

  html += `
        </div>
      </div>
    </section>
  `;

  return html;
}

// Copy static assets
function copyAssets() {
  const assetDirs = ["css", "assets", "scripts", "modules", "content"];

  assetDirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      const destDir = path.join("dist", dir);

      // Copy files recursively
      function copyRecursive(src, dest) {
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          fs.readdirSync(src).forEach((file) => {
            copyRecursive(path.join(src, file), path.join(dest, file));
          });
        } else {
          fs.copyFileSync(src, dest);
        }
      }

      copyRecursive(dir, destDir);
      console.log(`📁 Copied ${dir} to dist/`);
    }
  });
}

// Main build function
function build() {
  console.log("📖 Reading content files...");

  // Read JSON content files
  const faqData = readJSON("content/global/faqSection.json");

  // List of HTML pages to process
  const pages = [
    "index.html",
    "about.html",
    "products.html",
    "farms.html",
    "states.html",
    "education.html",
    "blogs.html",
    "contact.html",
  ];

  console.log("🔧 Processing templates...");

  pages.forEach((page) => {
    const template = readHTML(page);
    if (!template) return;

    let processedHTML = template;

    // Replace the FAQ section div with generated HTML (only for pages that have it)
    if (template.includes('<div id="faqSection"></div>')) {
      const faqHTML = generateFAQHTML(faqData);
      processedHTML = processedHTML.replace(
        /<div id="faqSection"><\/div>/g,
        faqHTML
      );
    }

    // Write the processed HTML
    writeHTML(`dist/${page}`, processedHTML);
  });

  // Copy static assets
  copyAssets();

  // Copy robots.txt and sitemap.xml
  if (fs.existsSync("robots.txt")) {
    fs.copyFileSync("robots.txt", "dist/robots.txt");
    console.log("📄 Copied robots.txt");
  }

  if (fs.existsSync("sitemap.xml")) {
    fs.copyFileSync("sitemap.xml", "dist/sitemap.xml");
    console.log("📄 Copied sitemap.xml");
  }

  console.log("🎉 Build complete! Static files ready in dist/");
  console.log('💡 Run "npm run serve" to preview the built site');
}

// Create dist directory if it doesn't exist
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
  console.log("📁 Created dist directory");
}

// Run the build
build();
