# Modern Toast Notification System

A lightweight, customizable toast notification system for web applications with zero dependencies.

## Features

### 1. Multiple Toast Types
- ✅ Success (green with checkmark icon)
- ❌ Error (red with X icon in circle)
- ⚠️ Warning (orange with inverted "i" in triangle)
- ℹ️ Info (blue with "i" in circle)

### 2. Positioning
- `top-right` (default)
- `top-left`
- `bottom-right`
- `bottom-left`

### 3. Progress & Timing
- Automatic dismiss with configurable duration
- Visual progress bar
- Pause on hover (progress bar and timer pause when hovering)
- Resume on mouse leave

### 4. Animations
- Smooth entry animations (slides in from edge)
- Smooth exit animations
- Direction-aware animations (slides from right or left based on position)
- Fade in/out effects

### 5. Interactive Features
- Close button with hover effect
- Manual dismiss through close button only
- Progress bar indicates remaining time
- Hover to pause auto-dismiss

### 6. Customization Options
```javascript
const toast = new InfinityToast({
    position: 'top-right',         // Position of toasts
    duration: 3000,               // Duration in milliseconds
    showIcon: true,              // Show/hide type icons
    showCloseButton: true,       // Show/hide close button
    containerClass: 'custom-container', // Custom container class
    toastClass: 'custom-toast'   // Custom toast class
});
```

### 7. Modern Design
- Clean, minimal interface
- Responsive layout
- Shadow effects
- Smooth transitions
- High-contrast icons
- Accessible colors

## Usage

### 1. Basic Implementation
```javascript
import toast from './index.js';

// Show different types of notifications
toast.success('Operation completed successfully!');
toast.error('An error occurred!');
toast.warning('Please be careful!');
toast.info('Here is some information.');
```

### 2. Custom Instance
```javascript
import { InfinityToast } from './index.js';

const customToast = new InfinityToast({
    position: 'bottom-right',
    duration: 5000,
    showIcon: true,
    showCloseButton: true
});

customToast.success('Custom toast message!');
```

### 3. Multiple Instances
You can create multiple toast instances with different configurations:
```javascript
const topToast = new InfinityToast({ position: 'top-right' });
const bottomToast = new InfinityToast({ position: 'bottom-left' });
```

## Styling

The toast system includes built-in styles with CSS variables for easy customization:

- Success color: `#4caf50`
- Error color: `#f44336`
- Warning color: `#ff9800`
- Info color: `#2196f3`

Each toast type has its own class for custom styling:
- `.infinity-toast.success`
- `.infinity-toast.error`
- `.infinity-toast.warning`
- `.infinity-toast.info`

## Technical Details

### Auto-cleanup
- Toasts are automatically removed from the DOM after animation
- Memory-efficient with proper event listener cleanup
- Smooth animation handling with requestAnimationFrame

### Performance
- Lightweight implementation
- No external dependencies
- Efficient DOM operations
- Hardware-accelerated animations

### Browser Support
- Works in all modern browsers
- Uses standard web APIs
- ES6 module support

## License

MIT

## Author

Created by Dinesh Babu