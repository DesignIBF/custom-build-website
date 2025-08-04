# Modules Directory

This directory contains the modular components for the iBuyFlowers website.

## Structure

### `/completed/`

Contains fully implemented and tested modules that are ready for production use. Each module has:

- `moduleName.html` - Component HTML template
- `moduleName.css` - Component-specific styles
- `moduleName.js` - Component JavaScript functionality
- `moduleName.json` - Component data/configuration

### `/in-progress/`

Contains modules currently being developed or requiring updates.

## Completed Modules

### ✅ nav

- **Description**: Main navigation component with brand, menu items, search, and sign-in
- **Features**: Responsive design, dropdown support, global data loading
- **Files**: nav.html, nav.css, nav.js, nav.json

### ✅ spotlightBanner

- **Description**: Hero banner component with title, subtitle, description, and CTA button
- **Features**: Background images, gradient overlays, white text option
- **Files**: spotlightBanner.html, spotlightBanner.css, spotlightBanner.js, spotlightBanner.json

## Development Workflow

1. **Start new module**: Create folder in `/in-progress/` with all 4 required files
2. **Develop**: Build HTML structure, styles, functionality, and data
3. **Test**: Verify module works correctly in isolation and integrated
4. **Complete**: Move to `/completed/` folder when ready for production

## File Naming Convention

All files within a module folder should be named consistently:

- `moduleName.html`
- `moduleName.css`
- `moduleName.js`
- `moduleName.json`

## Integration

Modules are loaded by the main component loading system which:

- Loads HTML templates into page containers
- Applies CSS styles automatically
- Executes JavaScript functionality
- Populates content from JSON data files
