# Icon Setup Instructions

Since we can't generate PNG files programmatically without dependencies, here are two options:

## Option 1: Use the HTML Generator (Easiest)

1. Open `generate-icons.html` in Chrome
2. Click each button to download the icons
3. Save them in the `icons/` folder with the correct names:
   - icon16.png
   - icon32.png
   - icon48.png
   - icon128.png

## Option 2: Use an Online Tool

1. Open the `icons/icon.svg` file
2. Go to https://www.favicon-generator.org/ or https://realfavicongenerator.net/
3. Upload the SVG
4. Generate and download PNG files in sizes: 16, 32, 48, 128
5. Save them in the `icons/` folder

## Option 3: Manual Creation

For now, you can test the extension without proper icons. Chrome will show a default icon.
The extension will still work fine - icons are just for visual polish.

## Temporary Workaround

The extension manifest is currently set up to use these icon paths. If you want to test 
without creating icons, you can temporarily remove the icon references from manifest.json
(though Chrome will show warnings).
