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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
  
  return ghPagesConfigPath;
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
function buildForGitHubPages(configPath, indexPath) {
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
    
    // Build the application using the temporary GitHub Pages config
    console.log('Running Vite build with GitHub Pages configuration...');
    
    // Note: This is a simplified approach and might need adjustments
    // Ideally we'd use the Vite API directly but for simplicity we're using command line
    execSync(`cd ${clientDir} && npx vite build --config vite.config.gh-pages.js --outDir ../docs`, { 
      stdio: 'inherit'
    });
    
    console.log('Build for GitHub Pages completed');
  } catch (error) {
    console.error('Error building for GitHub Pages:', error);
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
function cleanup(configPath, indexPath) {
  console.log('Cleaning up temporary files...');
  
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
  
  if (fs.existsSync(indexPath)) {
    fs.unlinkSync(indexPath);
  }
  
  console.log('Cleanup completed');
}

// Main execution
try {
  const ghPagesConfigPath = createGitHubPagesConfig();
  const ghPagesIndexPath = createStaticIndexHtml();
  
  buildForGitHubPages(ghPagesConfigPath, ghPagesIndexPath);
  postProcessGitHubPagesBuild();
  cleanup(ghPagesConfigPath, ghPagesIndexPath);
  
  console.log('GitHub Pages deployment preparation complete!');
  console.log(`Files are ready in the "${targetDir}" directory.`);
  console.log('Next steps:');
  console.log('1. Commit and push these files to your GitHub repository');
  console.log('2. Enable GitHub Pages in your repository settings');
  console.log('   (Settings > Pages > Source > select "docs" folder from main branch)');
} catch (error) {
  console.error('Error in GitHub Pages deployment process:', error);
  process.exit(1);
}