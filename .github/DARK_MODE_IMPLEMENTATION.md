# Day/Night (Light/Dark) Mode Implementation

## Overview

This document describes the implementation of the day/night mode feature for CSM-Wiki. The implementation allows users to switch between light and dark themes, with support for:

- Manual theme selection via a toggle button
- Automatic detection of system/browser color scheme preferences
- Persistent storage of user preference in localStorage
- Smooth transitions between themes
- GitHub-inspired color schemes for both light and dark modes

## Architecture

### 1. Theme Switcher JavaScript (`assets/js/theme-switcher.js`)

The core functionality is implemented in a self-executing JavaScript module that:

- **Detects Initial Theme**: Checks localStorage first, then falls back to system preference
- **Applies Theme**: Sets `data-theme` attribute on `<html>` element
- **Updates UI**: Changes toggle button icon (🌙 for light mode, ☀️ for dark mode)
- **Handles Mermaid**: Automatically adjusts Mermaid diagram themes
- **Listens for System Changes**: Responds to OS-level theme changes (if user hasn't manually set preference)
- **Persists Preference**: Saves user choice to localStorage

#### Key Features:

```javascript
// Theme detection priority:
// 1. localStorage (user preference)
// 2. prefers-color-scheme media query (system preference)
// 3. Default to light theme

// Storage key: 'csm-wiki-theme'
// Possible values: 'light' or 'dark'
```

### 2. Theme Colors SCSS (`_sass/custom/theme-colors.scss`)

Comprehensive CSS custom properties (CSS variables) for both themes:

#### Light Theme Colors
- Background: `#ffffff`
- Text: `#24292f`
- Links: `#0969da`
- Code blocks: `#f6f8fa`
- Borders: `#d0d7de`

#### Dark Theme Colors (GitHub-inspired)
- Background: `#0d1117`
- Text: `#e6edf3`
- Links: `#2f81f7`
- Code blocks: `#161b22`
- Borders: `#30363d`

#### Callout Colors
Both themes include custom colors for all callout types:
- Note (blue)
- Tip (green)
- Warning (yellow)
- Important (purple)
- Caution (red)

### 3. Theme Toggle Button (`_includes/nav_footer_custom.html`)

A floating action button (FAB) positioned at the bottom-right corner:

- **Desktop**: 3rem × 3rem, positioned 1rem from bottom and right
- **Mobile**: 2.5rem × 2.5rem, positioned 0.5rem from edges
- **Interactions**: Scale animation on hover/click
- **Accessibility**: Proper ARIA labels that update with theme

### 4. Updated Stylesheets

#### `assets/css/just-the-docs-default.scss`
All hardcoded colors replaced with CSS custom properties:
- Heading underlines
- TOC panels (floating and inline)
- Back to top button
- Links and navigation

#### `_sass/custom/custom.scss`
Imports the theme-colors file to apply dark mode styles.

### 5. Head Custom (`_includes/head_custom.html`)

Includes the theme-switcher.js script (without defer to prevent flash of wrong theme).

## File Structure

```
CSM-Wiki/
├── assets/
│   ├── js/
│   │   └── theme-switcher.js         # Core theme switching logic
│   └── css/
│       └── just-the-docs-default.scss # Updated with CSS variables
├── _sass/
│   └── custom/
│       ├── theme-colors.scss         # Theme color definitions
│       └── custom.scss               # Imports theme colors
└── _includes/
    ├── head_custom.html              # Includes theme-switcher.js
    └── nav_footer_custom.html        # Theme toggle button
```

## How It Works

### Theme Application Flow

1. **Page Load**:
   ```
   theme-switcher.js loads (synchronously)
   → getInitialTheme() checks localStorage and system preference
   → applyTheme() sets data-theme="light" or data-theme="dark"
   → CSS custom properties take effect
   ```

2. **User Clicks Toggle Button**:
   ```
   toggleTheme() is called
   → Current theme is determined from data-theme attribute
   → New theme is opposite of current
   → applyTheme() updates data-theme and localStorage
   → Button icon changes (🌙 ↔ ☀️)
   → CSS transitions smoothly animate color changes
   ```

3. **System Theme Changes**:
   ```
   prefers-color-scheme media query listener fires
   → Check if user has explicit preference in localStorage
   → If NO explicit preference: auto-switch to match system
   → If YES explicit preference: do nothing (respect user choice)
   ```

### CSS Variable System

The theme system uses CSS custom properties that cascade throughout the site:

```scss
:root {
  --body-background-color: #ffffff;  // Light default
  --body-text-color: #24292f;
  // ... more variables
}

[data-theme="dark"] {
  --body-background-color: #0d1117;  // Dark override
  --body-text-color: #e6edf3;
  // ... more variables
}

// Usage in CSS:
body {
  background-color: var(--body-background-color);
  color: var(--body-text-color);
}
```

## Browser Support

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **localStorage**: Required for preference persistence
- **CSS Custom Properties**: Required for theming
- **prefers-color-scheme**: Optional, enhances UX
- **Graceful Degradation**: Falls back to light theme if features unsupported

## Testing Checklist

- [ ] Toggle button appears and is clickable
- [ ] Clicking button switches theme immediately
- [ ] Theme preference persists across page reloads
- [ ] System preference is detected on first visit
- [ ] Transitions are smooth (0.3s)
- [ ] All callouts render correctly in both themes
- [ ] Code blocks are readable in both themes
- [ ] Images display well with borders in dark mode
- [ ] TOC panels styled correctly in both themes
- [ ] Navigation links visible in both themes
- [ ] Search functionality works in both themes
- [ ] Mermaid diagrams render with appropriate theme

## Customization Guide

### Changing Colors

Edit `_sass/custom/theme-colors.scss`:

```scss
:root {
  --link-color: #0969da;  // Light theme link color
}

[data-theme="dark"] {
  --link-color: #2f81f7;  // Dark theme link color
}
```

### Moving Toggle Button

Edit `_includes/nav_footer_custom.html`:

```css
#theme-toggle {
  bottom: 1rem;   /* Adjust vertical position */
  right: 1rem;    /* Adjust horizontal position */
}
```

### Adjusting Transition Speed

Edit `_sass/custom/theme-colors.scss`:

```scss
:root {
  transition: background-color 0.5s ease, color 0.5s ease;  // Slower
}
```

### Adding New Theme Elements

1. Define CSS variable in theme-colors.scss
2. Use variable in your styles
3. The variable will automatically adapt to current theme

## Performance Considerations

- **No Flash**: theme-switcher.js loads synchronously to apply theme before render
- **Minimal JS**: ~100 lines of vanilla JavaScript, no dependencies
- **CSS-Only Switching**: Theme changes via CSS variables, very performant
- **LocalStorage**: Single key-value pair, minimal overhead

## Accessibility

- **ARIA Labels**: Button has descriptive labels that update with theme
- **Keyboard Accessible**: Toggle button is keyboard navigable
- **Screen Readers**: Theme changes announced via ARIA label updates
- **Contrast**: All colors meet WCAG AA standards for contrast
- **Focus Indicators**: Maintained in both themes

## Future Enhancements

Potential improvements for future iterations:

1. **More Themes**: Add additional color schemes (e.g., high contrast, sepia)
2. **Custom Theme Builder**: Allow users to customize colors
3. **Schedule-Based Switching**: Auto-switch based on time of day
4. **Per-Page Themes**: Different themes for different sections
5. **Theme Preview**: Show preview before applying
6. **Export/Import Themes**: Share theme configurations

## Troubleshooting

### Theme not persisting
- Check if localStorage is enabled in browser
- Check browser console for errors
- Clear localStorage and try again: `localStorage.removeItem('csm-wiki-theme')`

### Colors not changing
- Check if `data-theme` attribute is set on `<html>` element
- Verify CSS custom properties are supported
- Check browser console for SCSS compilation errors

### Toggle button not visible
- Check z-index conflicts with other elements
- Verify `nav_footer_custom.html` is being included
- Check if button is hidden by other CSS rules

### Mermaid diagrams not themed
- Verify mermaid.js is loaded after theme-switcher.js
- Check browser console for mermaid errors
- Ensure mermaid version supports theming

## Credits

- Color scheme inspired by GitHub's dark theme
- Implementation follows accessibility best practices
- Smooth transitions inspired by modern web design trends

## License

This implementation is part of the CSM-Wiki project and is distributed under the same license as the main project (Apache 2.0).
