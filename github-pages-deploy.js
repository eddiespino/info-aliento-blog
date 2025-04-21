// GitHub Pages deployment script
// This script copies the built files to the docs folder for GitHub Pages deployment

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM context
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define paths
const sourceDir = path.join(__dirname, 'dist', 'public');
const targetDir = path.join(__dirname, 'docs');

// Create docs directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('Created docs directory');
}

// Function to copy directory recursively
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Get all files and folders in the source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDir(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

// Check if dist/public exists
if (!fs.existsSync(sourceDir)) {
  console.error('Error: Build directory not found. Please run npm run build first.');
  process.exit(1);
}

// Copy all files from dist/public to docs
try {
  // Clear docs directory first
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
    fs.mkdirSync(targetDir);
    console.log('Cleared docs directory');
  }

  // Copy files
  copyDir(sourceDir, targetDir);
  
  // Create CNAME file if needed for custom domain
  // fs.writeFileSync(path.join(targetDir, 'CNAME'), 'your-custom-domain.com');
  
  // Create a .nojekyll file to disable Jekyll processing
  fs.writeFileSync(path.join(targetDir, '.nojekyll'), '');
  
  console.log('Successfully copied build files to docs directory for GitHub Pages');
} catch (error) {
  console.error('Error during file copying:', error);
  process.exit(1);
}