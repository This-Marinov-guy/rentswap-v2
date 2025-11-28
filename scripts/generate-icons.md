# PWA Icon Generation Instructions

The manifest.json requires the following icons to be created:

## Required Icons

Place these icons in `/public/icons/`:

1. **icon-192x192.png** - 192x192 pixels
2. **icon-512x512.png** - 512x512 pixels

## Optional Screenshots

Place these screenshots in `/public/screenshots/`:

1. **home.png** - 540x720 pixels (mobile screenshot)
2. **desktop.png** - 1280x720 pixels (desktop screenshot)

## Source Logo

Use the RentSwap logo located at: `/public/assets/svg/logo.svg`

## Generation Options

### Option 1: Online Tool (Recommended)
Use a PWA icon generator like:
- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/

### Option 2: Using ImageMagick (if installed)
```bash
# Convert SVG to PNG icons
convert -background none public/assets/svg/logo.svg -resize 192x192 public/icons/icon-192x192.png
convert -background none public/assets/svg/logo.svg -resize 512x512 public/icons/icon-512x512.png
```

### Option 3: Using Sharp (Node.js)
Install sharp: `npm install -D sharp`

Then create a script to generate icons programmatically.

## Maskable Icons

For better mobile app appearance, consider creating maskable icons with safe zone padding (80% of the icon should be within the safe zone).

## Testing

After generating icons, test your PWA manifest at:
- Chrome DevTools > Application > Manifest
- https://manifest-validator.appspot.com/
