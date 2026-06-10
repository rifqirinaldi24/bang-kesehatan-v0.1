const fs = require('fs');

const config = {
    "colors": {
        "secondary-fixed": "#dbe1ff",
        "on-tertiary-fixed-variant": "#005236",
        "surface-dim": "#d2d9f4",
        "on-surface-variant": "#3d4949",
        "on-primary-container": "#003333",
        "tertiary": "#006c49",
        "secondary-fixed-dim": "#b4c5ff",
        "on-tertiary-container": "#003422",
        "border-muted": "#E2E8F0",
        "surface-container-high": "#e2e7ff",
        "surface-bright": "#faf8ff",
        "on-error": "#ffffff",
        "inverse-surface": "#283044",
        "outline": "#6d7a79",
        "on-secondary-fixed": "#00174b",
        "primary-fixed-dim": "#5ed9d7",
        "surface-tint": "#006a69",
        "surface-variant": "#dae2fd",
        "on-primary": "#ffffff",
        "scrim": "rgba(15, 23, 42, 0.05)",
        "on-primary-fixed-variant": "#00504f",
        "inverse-primary": "#5ed9d7",
        "tertiary-fixed-dim": "#4edea3",
        "secondary-container": "#316bf3",
        "on-secondary-fixed-variant": "#003ea8",
        "error": "#ba1a1a",
        "on-background": "#131b2e",
        "surface-container-low": "#f2f3ff",
        "primary-fixed": "#7df5f4",
        "surface-container-highest": "#dae2fd",
        "error-container": "#ffdad6",
        "tertiary-fixed": "#6ffbbe",
        "on-secondary-container": "#fefcff",
        "tertiary-container": "#00a975",
        "on-surface": "#131b2e",
        "on-secondary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "surface": "#F8FAFC",
        "secondary": "#0051d5",
        "inverse-on-surface": "#eef0ff",
        "on-error-container": "#93000a",
        "on-tertiary": "#ffffff",
        "primary": "#006a69",
        "surface-container": "#eaedff",
        "primary-container": "#0ea5a4",
        "outline-variant": "#bcc9c8",
        "on-tertiary-fixed": "#002113",
        "background": "#FFFFFF",
        "on-primary-fixed": "#002020"
    },
    "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
    },
    "spacing": {
        "unit": "8px",
        "container-max": "1280px",
        "margin-desktop": "40px",
        "margin-mobile": "20px",
        "gutter": "24px"
    },
    "fontFamily": {
        "headline-md": ["Hanken Grotesk"],
        "headline-lg-mobile": ["Hanken Grotesk"],
        "headline-lg": ["Hanken Grotesk"],
        "body-xl": ["Inter"],
        "body-lg": ["Inter"],
        "headline-xl": ["Hanken Grotesk"],
        "body-md": ["Inter"],
        "label-sm": ["Inter"],
        "label-md": ["Inter"]
    },
    "fontSize": {
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "headline-lg-mobile": ["28px", { "lineHeight": "34px", "fontWeight": "700" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700" }],
        "body-xl": ["20px", { "lineHeight": "32px", "fontWeight": "400" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "headline-xl": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "500" }],
        "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "600" }]
    }
};

let css = '\n\n/* =========================================================\n   Google Stitch CMS Theme Tokens\n   ========================================================= */\n@theme {\n';

// Colors
for (const [key, value] of Object.entries(config.colors)) {
css += `  --color-${key}: ${value};\n`;
}

// Font Families
for (const [key, value] of Object.entries(config.fontFamily)) {
css += `  --font-${key}: "${value[0]}", sans-serif;\n`;
}

// Font Sizes 
for (const [key, value] of Object.entries(config.fontSize)) {
css += `  --text-${key}: ${value[0]};\n`;
css += `  --text-${key}--line-height: ${value[1].lineHeight};\n`;
if (value[1].fontWeight) css += `  --text-${key}--font-weight: ${value[1].fontWeight};\n`;
if (value[1].letterSpacing) css += `  --text-${key}--letter-spacing: ${value[1].letterSpacing};\n`;
}

// Spacing
for (const [key, value] of Object.entries(config.spacing)) {
css += `  --spacing-${key}: ${value};\n`;
}

// Border Radius
for (const [key, value] of Object.entries(config.borderRadius)) {
css += `  --radius-${key === 'DEFAULT' ? 'DEFAULT' : key}: ${value};\n`;
}

css += '}\n';

const currentCssPath = 'e:/Rifqi File/Dokumen/Bang Kesehatan/Ngoding/src/index.css';
const currentCss = fs.readFileSync(currentCssPath, 'utf-8');
fs.writeFileSync(currentCssPath, currentCss + css);

console.log('Successfully injected Google Stitch theme tokens into index.css');
