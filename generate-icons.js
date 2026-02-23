// Simple icon generator using Node.js Canvas API
// Run: node generate-icons.js

// Note: This requires the 'canvas' package
// Install with: npm install canvas
// 
// For MVP, you can skip this and use generate-icons.html in the browser instead

const fs = require('fs');
const path = require('path');

// Check if canvas is available
let Canvas;
try {
  Canvas = require('canvas');
} catch (e) {
  console.log('Canvas module not found. Please either:');
  console.log('1. Run: npm install canvas');
  console.log('2. OR open generate-icons.html in your browser');
  process.exit(1);
}

const { createCanvas } = Canvas;

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Blue background
  ctx.fillStyle = '#1d9bf0';
  ctx.fillRect(0, 0, size, size);
  
  // White circle
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
  ctx.fill();
  
  // Yellow inner circle (lightning effect)
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/5, 0, Math.PI * 2);
  ctx.fill();
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  const filename = path.join(__dirname, 'icons', `icon${size}.png`);
  fs.writeFileSync(filename, buffer);
  console.log(`Generated: icon${size}.png`);
}

// Generate all sizes
[16, 32, 48, 128].forEach(size => generateIcon(size));
console.log('All icons generated successfully!');
