#!/usr/bin/env node

// GitHub Pages deployment script
// This script creates a static-only version of the application for GitHub Pages

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get directory name in ESM context
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define paths
const sourceDir = path.join(__dirname, 'dist', 'public');
const targetDir = path.join(__dirname, 'docs');
const clientDir = path.join(__dirname, 'client');

console.log('Starting GitHub Pages deployment process...');

// Step 1: Create a GitHub Pages specific build script
function createGitHubPagesConfig() {
  console.log('Creating GitHub Pages specific build configuration...');
  
  // Create a temporary vite.config.gh-pages.js in the client directory
  const ghPagesConfigPath = path.join(clientDir, 'vite.config.gh-pages.js');
  
  const ghPagesConfig = `
// GitHub Pages specific Vite configuration
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwind from "@tailwindcss/vite";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwind(),
    themePlugin(),
  ],
  base: './', // Use relative paths
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "..", "shared"),
      "@assets": path.resolve(__dirname, "..", "attached_assets"),
    },
  },
});
  `;
  
  fs.writeFileSync(ghPagesConfigPath, ghPagesConfig);
  console.log('Created GitHub Pages Vite configuration');

  // Create a temporary tailwind.config.js for GitHub Pages
  const tailwindConfigPath = path.join(clientDir, 'tailwind.config.gh-pages.js');
  const tailwindConfig = `
// GitHub Pages Tailwind Configuration
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.gh-pages.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
  `;

  fs.writeFileSync(tailwindConfigPath, tailwindConfig);
  console.log('Created GitHub Pages Tailwind configuration');
  
  return { viteConfigPath: ghPagesConfigPath, tailwindConfigPath };
}

// Step 2: Create a static-only version index.html for GitHub Pages
function createStaticIndexHtml() {
  console.log('Creating static index.html without backend dependencies...');
  
  // Ensure we have a GitHub Pages specific index.html
  const ghPagesIndexPath = path.join(clientDir, 'index.gh-pages.html');
  
  // Read the existing index.html
  const originalIndexPath = path.join(clientDir, 'index.html');
  const originalIndex = fs.readFileSync(originalIndexPath, 'utf-8');
  
  // Create GitHub Pages version (with relative paths and no Replit banner)
  const ghPagesIndex = originalIndex
    .replace('<script type="text/javascript" src="https://replit.com/public/js/replit-dev-banner.js"></script>', '')
    .replace('src="/src/main.tsx"', 'src="./src/main.tsx"');
  
  fs.writeFileSync(ghPagesIndexPath, ghPagesIndex);
  console.log('Created GitHub Pages index.html');
  
  return ghPagesIndexPath;
}

// Step 3: Run the build with GitHub Pages configuration
function buildForGitHubPages(configs, indexPath) {
  console.log('Building application for GitHub Pages...');
  
  try {
    // Create docs directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    } else {
      // Clear existing docs directory
      fs.rmSync(targetDir, { recursive: true, force: true });
      fs.mkdirSync(targetDir);
    }
    
    // Copy the modified index.html to index.html
    fs.copyFileSync(indexPath, path.join(clientDir, 'index.html'));
    console.log('Temporarily replaced index.html for build');
    
    // Create a postCSS config file to support tailwind
    const postcssConfigPath = path.join(clientDir, 'postcss.config.gh-pages.js');
    const postcssConfig = `
export default {
  plugins: {
    tailwindcss: {
      config: './tailwind.config.gh-pages.js',
    },
    autoprefixer: {},
  },
}
`;
    fs.writeFileSync(postcssConfigPath, postcssConfig);
    console.log('Created GitHub Pages PostCSS configuration');
    
    // Create a modified index.css that doesn't use border-border
    const cssPath = path.join(clientDir, 'src', 'index.css');
    const originalCss = fs.readFileSync(cssPath, 'utf-8');
    const backupCssPath = path.join(clientDir, 'src', 'index.css.bak');
    
    // Backup the original CSS
    fs.writeFileSync(backupCssPath, originalCss);
    
    // Fix the CSS by removing the problematic border-border line
    const fixedCss = originalCss.replace('@apply border-border;', '');
    fs.writeFileSync(cssPath, fixedCss);
    console.log('Fixed index.css for GitHub Pages build');
    
    // Build the application using the temporary GitHub Pages config
    console.log('Running Vite build with GitHub Pages configuration...');
    
    // Set environment variable to use our custom PostCSS config
    process.env.POSTCSS_CONFIG_PATH = postcssConfigPath;
    
    // Note: This is a simplified approach and might need adjustments
    try {
      execSync(`cd ${clientDir} && npx vite build --config vite.config.gh-pages.js --outDir ../docs`, { 
        stdio: 'inherit',
        env: {
          ...process.env,
          TAILWIND_CONFIG_PATH: path.join(clientDir, 'tailwind.config.gh-pages.js'),
          POSTCSS_CONFIG_PATH: postcssConfigPath
        }
      });
      console.log('Build for GitHub Pages completed successfully');
    } catch (buildError) {
      console.error('Build error occurred:', buildError);
      
      // Build failed, try a simplified approach without custom plugins
      console.log('Trying simplified build approach...');
      
      // Create a minimal Vite config
      const minimalConfigPath = path.join(clientDir, 'vite.minimal.config.js');
      const minimalConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "..", "shared"),
      "@assets": path.resolve(__dirname, "..", "attached_assets"),
    },
  },
});`;
      fs.writeFileSync(minimalConfigPath, minimalConfig);
      
      // Create simplified HTML
      const simplifiedHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>Aliento Witness - Hive Blockchain</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background-color: #f8f9fa;
        color: #333;
        margin: 0;
        padding: 0;
      }
      
      #root {
        width: 100%;
        margin: 0 auto;
      }
      
      .dark {
        background-color: #1e293b;
        color: #f1f5f9;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>`;
      fs.writeFileSync(path.join(clientDir, 'index.html'), simplifiedHtml);
      
      try {
        execSync(`cd ${clientDir} && npx vite build --config vite.minimal.config.js --outDir ../docs`, { 
          stdio: 'inherit'
        });
        console.log('Simplified build completed successfully');
      } catch (finalBuildError) {
        console.error('All build attempts failed:', finalBuildError);
        
        // Generate a minimal static page explaining how to deploy properly
        const staticHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aliento Witness - Hive Blockchain</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 { color: #1a67d2; }
    pre { background: #f4f4f4; padding: 10px; overflow-x: auto; }
    .note { background: #e9f5ff; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <h1>Aliento Witness - Hive Blockchain</h1>
  <p>This is a placeholder page for your Hive Witnesses application.</p>
  
  <div class="note">
    <h2>Deployment Instructions</h2>
    <p>The automatic build process encountered some issues. To deploy manually:</p>
    <ol>
      <li>Clone your repository to your local machine</li>
      <li>Run <code>npm run build</code> to create a production build</li>
      <li>Copy the contents of <code>dist/public</code> to a new <code>docs</code> folder</li>
      <li>Push the <code>docs</code> folder to GitHub</li>
      <li>Enable GitHub Pages in repository settings</li>
    </ol>
  </div>
  
  <h2>About This Application</h2>
  <p>This application allows you to view Hive blockchain witnesses and vote for them using Keychain.</p>
</body>
</html>`;
        
        // Ensure docs directory exists
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(targetDir, 'index.html'), staticHtml);
        fs.writeFileSync(path.join(targetDir, '.nojekyll'), '');
        console.log('Created static fallback page');
      }
    }
    
    // Restore original files
    if (fs.existsSync(backupCssPath)) {
      fs.copyFileSync(backupCssPath, cssPath);
      fs.unlinkSync(backupCssPath);
    }
    
    // Restore original index.html from the client directory
    fs.copyFileSync(path.join(clientDir, 'index.html.bak'), path.join(clientDir, 'index.html'));
    
    console.log('Build process completed');
  } catch (error) {
    console.error('Error in build process:', error);
    process.exit(1);
  }
}

// Step 4: Post-process the build for GitHub Pages
function postProcessGitHubPagesBuild() {
  console.log('Post-processing GitHub Pages build...');
  
  // Create .nojekyll file (tells GitHub not to process with Jekyll)
  fs.writeFileSync(path.join(targetDir, '.nojekyll'), '');
  
  // Create CNAME file if you have a custom domain
  // fs.writeFileSync(path.join(targetDir, 'CNAME'), 'your-domain.com');
  
  console.log('GitHub Pages build post-processing completed');
}

// Step 5: Cleanup temporary files
function cleanup(configs, indexPath) {
  console.log('Cleaning up temporary files...');
  
  // Clean up Vite config
  if (configs && configs.viteConfigPath && fs.existsSync(configs.viteConfigPath)) {
    fs.unlinkSync(configs.viteConfigPath);
  }
  
  // Clean up Tailwind config
  if (configs && configs.tailwindConfigPath && fs.existsSync(configs.tailwindConfigPath)) {
    fs.unlinkSync(configs.tailwindConfigPath);
  }
  
  // Clean up temporary index.html
  if (indexPath && fs.existsSync(indexPath)) {
    fs.unlinkSync(indexPath);
  }
  
  // Clean up other temporary files
  const temporaryFiles = [
    path.join(clientDir, 'postcss.config.gh-pages.js'),
    path.join(clientDir, 'vite.minimal.config.js'),
    path.join(clientDir, 'index.html.bak'),
    path.join(clientDir, 'src', 'index.css.bak')
  ];
  
  for (const tempFile of temporaryFiles) {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
  
  console.log('Cleanup completed');
}

// Main execution
try {
  // Backup original index.html
  const originalIndexPath = path.join(clientDir, 'index.html');
  const indexBackupPath = path.join(clientDir, 'index.html.bak');
  fs.copyFileSync(originalIndexPath, indexBackupPath);
  
  // Create GitHub Pages configuration files
  const configs = createGitHubPagesConfig();
  const ghPagesIndexPath = createStaticIndexHtml();
  
  // Build for GitHub Pages
  buildForGitHubPages(configs, ghPagesIndexPath);
  postProcessGitHubPagesBuild();
  
  // Clean up temporary files
  cleanup(configs, ghPagesIndexPath);
  
  // Success message
  console.log('\n========================================================');
  console.log('🎉 GitHub Pages deployment preparation complete! 🎉');
  console.log('========================================================\n');
  console.log(`Files are ready in the "${targetDir}" directory.`);
  console.log('\nNext steps:');
  console.log('1. Commit and push these files to your GitHub repository:');
  console.log('   git add docs/');
  console.log('   git commit -m "Add GitHub Pages build"');
  console.log('   git push origin main');
  console.log('\n2. Enable GitHub Pages in your repository settings:');
  console.log('   Settings > Pages > Source > select "main" branch and "/docs" folder');
  console.log('\nYour site will be published at: https://yourusername.github.io/your-repo-name/');
} catch (error) {
  console.error('Error in GitHub Pages deployment process:', error);
  process.exit(1);
}