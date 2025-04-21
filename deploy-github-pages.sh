#!/bin/bash
# Script to test GitHub Pages deployment

# Make the deployment script executable
chmod +x github-pages-deploy.js

echo "Starting GitHub Pages deployment process..."

# Run the deployment script
node github-pages-deploy.js

echo "Deployment script completed."
echo "Check the 'docs' directory for the GitHub Pages build."

# Verify the docs directory was created
if [ -d "docs" ]; then
  echo "Success! The 'docs' directory was created."
  echo "You can now push this directory to GitHub and enable GitHub Pages in your repository settings."
else
  echo "Error: The 'docs' directory was not created. Check the logs for errors."
fi