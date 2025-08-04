# Design Document

## Overview

The modular website system transforms the iBuyFlowers website into a scalable, maintainable architecture where each component is self-contained with its own HTML, CSS, JavaScript, and JSON files. This design eliminates duplicate IDs, provides clear separation of concerns, and establishes a consistent development workflow.

## Architecture

### Folder Structure

```
modules/
├── completed/           # Production-ready modules
│   ├── nav/
│   │   ├── nav.html
│   │   ├── nav.css
│   │   ├── nav.js
│   │   └── nav.json
│   └── spotlightBanner/
│       ├── spotlightBanner.html
│       ├── spotlightBanner.css
│       ├── spotlightBanner.js
│       └── spotlightBanner.json
├── in-progress/         # Development modules
│   └── [module-name]/
│       ├── [module-name].html
│       ├── [module-name].css
│       ├── [module-name].js
│       └── [module-name].json
└── README.md           # Documentation
```

### Component Loading System

The existing `loadComponents.js` will be enhanced to:

1. Load modules from both `completed/` and `in-progress/` folders
2. Automatically include CSS files for each module
3. Execute JavaScript files when modules are loaded
4. Handle the content population from JSON files

### ID vs Class Strategy

- **Container IDs**: Maintained for loading system (`<div id="nav">`, `<div id="spotlightBanner">`)
- **Component Classes**: All internal elements use classes (`.main-nav`, `.spotlight-banner`)
- **CSS Selectors**: All styling uses class selectors
- **JavaScript Targeting**: Content loader targets classes within ID containers

## Components and Interfaces

### Module Structure Interface

Each module follows this interface:

```typescript
interface Module {
  html: string; // Component template
  css: string; // Component styles
  js?: string; // Optional functionality
  json: object; // Component data
}
```

### Content Loader Interface

Enhanced contentLoader.js will handle:

```javascript
interface ContentLoader {
  loadModuleContent(pageName: string, moduleId: string): Promise<void>;
  populateModule(moduleId: string, content: object): void;
  loadModuleFromPath(modulePath: string): Promise<void>;
}
```

### Module Registration System

```javascript
interface ModuleRegistry {
  completed: string[]; // List of completed modules
  inProgress: string[]; // List of in-progress modules
  getModulePath(moduleName: string): string;
  isCompleted(moduleName: string): boolean;
}
```

## Data Models

### Module Configuration

```json
{
  "name": "moduleName",
  "status": "completed" | "in-progress",
  "dependencies": ["dependency1", "dependency2"],
  "hasJavaScript": boolean,
  "dataSource": "global" | "page-specific"
}
```

### Global Navigation Data

```json
{
  "brand": "string",
  "taglines": ["string"],
  "logo": "string",
  "menuItems": [
    {
      "text": "string",
      "link": "string",
      "hasDropdown": boolean
    }
  ],
  "searchPlaceholder": "string",
  "signInText": "string"
}
```

### Spotlight Banner Data

```json
{
  "title": "string",
  "subtitle": "string",
  "description": "string",
  "buttonText": "string",
  "buttonLink": "string",
  "backgroundImage": "string",
  "backgroundPosition": "string",
  "imageAlt": "string",
  "useWhiteText": boolean,
  "useGradientOverlay": boolean
}
```

## Error Handling

### Module Loading Errors

- **Missing Files**: Graceful degradation if CSS/JS files don't exist
- **Invalid JSON**: Log error and continue with default content
- **Network Failures**: Retry mechanism for loading failures
- **Dependency Issues**: Clear error messages for missing dependencies

### Development Workflow Errors

- **Naming Conflicts**: Validation to prevent duplicate module names
- **File Structure**: Automated checks for required files
- **CSS Conflicts**: Scoped styles to prevent global conflicts
- **JavaScript Errors**: Isolated error handling per module

## Testing Strategy

### Unit Testing

- **Module Isolation**: Each module can be tested independently
- **Content Loading**: Test JSON data population
- **CSS Scoping**: Verify styles don't leak between modules
- **JavaScript Functionality**: Test module-specific behavior

### Integration Testing

- **Page Assembly**: Test complete page loading with multiple modules
- **Cross-Module Communication**: Verify modules work together
- **Responsive Behavior**: Test modules across different screen sizes
- **Performance**: Measure loading times and resource usage

### Development Testing

- **Module Validation**: Automated checks for required files
- **Structure Compliance**: Verify folder structure adherence
- **Code Quality**: Linting and formatting checks
- **Documentation**: Ensure README files are up to date

## Migration Strategy

### Phase 1: Infrastructure Setup

1. Create modular folder structure
2. Update content loading system
3. Migrate completed modules (nav, spotlightBanner)
4. Test existing functionality

### Phase 2: CSS Extraction

1. Extract module-specific CSS from styles.css
2. Update CSS imports in main stylesheet
3. Verify styling consistency
4. Test responsive behavior

### Phase 3: Module Migration

1. Move remaining components to modular structure
2. Extract and organize JavaScript files
3. Create JSON data files for each module
4. Update component loading system

### Phase 4: Cleanup and Optimization

1. Remove duplicate files from old structure
2. Optimize loading performance
3. Update documentation
4. Final testing and validation

## Performance Considerations

### Loading Optimization

- **Lazy Loading**: Load modules only when needed
- **CSS Bundling**: Combine module CSS files for production
- **JavaScript Minification**: Compress module JS files
- **Caching Strategy**: Implement proper cache headers

### Resource Management

- **File Size**: Keep module files small and focused
- **Dependencies**: Minimize cross-module dependencies
- **Memory Usage**: Efficient DOM manipulation
- **Network Requests**: Batch loading where possible

## Security Considerations

### Content Security

- **XSS Prevention**: Sanitize JSON data before DOM insertion
- **File Access**: Restrict module loading to authorized paths
- **Input Validation**: Validate all JSON data structures
- **Error Information**: Avoid exposing sensitive error details

### Development Security

- **File Permissions**: Proper access controls on module files
- **Code Review**: Review process for new modules
- **Dependency Management**: Secure handling of module dependencies
- **Version Control**: Track changes to module files
