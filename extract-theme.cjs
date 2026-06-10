const fs = require('fs');
const html = fs.readFileSync('e:/Rifqi File/Dokumen/Bang Kesehatan/Ngoding/ui-stitch-bang-kesehatan.html', 'utf-8');
const match = html.match(/tailwind\.config\s*=\s*(\{[\s\S]*?\})\s*<\/script>/);

if (match) {
  const scriptContent = `module.exports = ${match[1]};`;
  fs.writeFileSync('tailwind-temp.js', scriptContent);
  const config = require('./tailwind-temp.js');
  
  let css = '\n\n/* =========================================================\n   Google Stitch CMS Theme Tokens\n   ========================================================= */\n@theme {\n';
  
  // Colors
  const colors = config.theme.extend.colors;
  for (const [key, value] of Object.entries(colors)) {
    css += `  --color-${key}: ${value};\n`;
  }
  
  // Font Families
  const fontFamilies = config.theme.extend.fontFamily;
  for (const [key, value] of Object.entries(fontFamilies)) {
    css += `  --font-${key}: "${value[0]}", sans-serif;\n`;
  }
  
  // Font Sizes (Note: Tailwind v4 maps --text-sm to specific font-size and line-height implicitly, 
  // but for custom token names like 'headline-md', we define the base variable)
  const fontSizes = config.theme.extend.fontSize;
  for (const [key, value] of Object.entries(fontSizes)) {
    css += `  --text-${key}: ${value[0]};\n`;
    css += `  --text-${key}--line-height: ${value[1].lineHeight};\n`;
    if (value[1].fontWeight) css += `  --text-${key}--font-weight: ${value[1].fontWeight};\n`;
    if (value[1].letterSpacing) css += `  --text-${key}--letter-spacing: ${value[1].letterSpacing};\n`;
  }
  
  // Spacing
  const spacing = config.theme.extend.spacing;
  for (const [key, value] of Object.entries(spacing)) {
    css += `  --spacing-${key}: ${value};\n`;
  }

  // Border Radius
  const radius = config.theme.extend.borderRadius;
  for (const [key, value] of Object.entries(radius)) {
    css += `  --radius-${key === 'DEFAULT' ? 'DEFAULT' : key}: ${value};\n`;
  }
  
  css += '}\n';
  
  const currentCssPath = 'e:/Rifqi File/Dokumen/Bang Kesehatan/Ngoding/src/index.css';
  const currentCss = fs.readFileSync(currentCssPath, 'utf-8');
  fs.writeFileSync(currentCssPath, currentCss + css);
  
  console.log('Successfully extracted and injected Google Stitch theme tokens into index.css');
  fs.unlinkSync('tailwind-temp.js');
} else {
  console.log('Tailwind config not found in the HTML file');
}
