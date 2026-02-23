# Icon Generation

The extension needs icons in the following sizes:
- 16x16 (toolbar)
- 32x32 (toolbar retina)
- 48x48 (extension management)
- 128x128 (Chrome Web Store)

## Quick Setup

For now, we're using a placeholder SVG. To generate proper PNG icons:

### Option 1: Using an online tool
1. Go to https://www.favicon-generator.org/ or similar
2. Upload `icons/icon.svg`
3. Generate and download 16x16, 32x32, 48x48, and 128x128 PNG versions
4. Name them: icon16.png, icon32.png, icon48.png, icon128.png
5. Place in the `icons/` folder

### Option 2: Using ImageMagick (command line)
```bash
# Install ImageMagick
brew install imagemagick  # macOS
# sudo apt-get install imagemagick  # Linux

# Generate icons
convert icons/icon.svg -resize 16x16 icons/icon16.png
convert icons/icon.svg -resize 32x32 icons/icon32.png
convert icons/icon.svg -resize 48x48 icons/icon48.png
convert icons/icon.svg -resize 128x128 icons/icon128.png
```

### Option 3: Use a design tool
1. Open icon.svg in Figma, Sketch, or Adobe Illustrator
2. Export as PNG at each required size
3. Save with the correct names

## Design Notes

The icon features:
- Lightning bolt (⚡) symbolizing speed and instant engagement
- Blue background (#1d9bf0) matching Twitter's brand
- Simple, recognizable design
- Works at small sizes

Feel free to customize the design to match your brand!
