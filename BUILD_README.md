# Build Process for SEO-Friendly Static Site

## Overview

This build script converts your JavaScript-injected content into static HTML for better SEO and faster loading.

## How It Works

1. **Reads JSON content** from `content/` directory
2. **Processes HTML templates** and injects content
3. **Copies all assets** (CSS, JS, images, modules)
4. **Generates static HTML** in `dist/` directory

## Usage

### Build the site:

```bash
npm run build
```

### Build and serve locally:

```bash
npm run dev
```

### Just serve the built site:

```bash
npm run serve
```

## What Gets Generated

- ✅ **Static HTML** with content pre-rendered
- ✅ **All assets copied** (CSS, JS, images)
- ✅ **SEO files** (robots.txt, sitemap.xml)
- ✅ **Component modules** for dynamic features

## Benefits

- 🚀 **Faster loading** - No JS required for initial content
- 🔍 **Better SEO** - Search engines see content immediately
- 📱 **Social sharing** - Meta tags and content visible to crawlers
- ⚡ **Progressive enhancement** - JS still works for interactivity

## Deployment

1. Run `npm run build`
2. Deploy the `dist/` folder to GitHub Pages
3. Update GitHub Pages to serve from `dist/` directory

## Adding New Content

1. **Update JSON files** in `content/` directory
2. **Add generators** in `build.js` for new sections
3. **Run build** to regenerate static files

## Current Generators

- ✅ FAQ Section (from `content/global/faqSection.json`)
- 🔄 More sections can be added as needed

## Future Enhancements

- Add generators for all dynamic sections
- Implement content validation
- Add build optimization (minification, compression)
- Create deployment automation
