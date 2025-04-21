# Deploying to GitHub Pages

This document explains how to deploy your Hive Blockchain Witnesses showcase application to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your local machine
- Node.js installed on your local machine

## Option 1: Manual Deployment

1. Build the application for GitHub Pages:
   ```bash
   # Make the deployment script executable
   chmod +x github-pages-deploy.js

   # Run the deployment script
   node github-pages-deploy.js
   ```

2. This will generate a `docs` folder in your project root.

3. Push this folder to your GitHub repository:
   ```bash
   git add docs
   git commit -m "Add GitHub Pages build"
   git push
   ```

4. On GitHub, go to your repository settings:
   - Navigate to "Settings" > "Pages"
   - Under "Source", select "Deploy from a branch"
   - Select the "main" branch and "/docs" folder
   - Click Save

5. Your site will be published to `https://yourusername.github.io/your-repo-name/`

## Option 2: Automated Deployment with GitHub Actions

This repository includes a GitHub Actions workflow to automatically deploy to GitHub Pages.

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push
   ```

2. On GitHub, go to your repository settings:
   - Navigate to "Settings" > "Pages"
   - Under "Source", select "GitHub Actions"

3. The workflow will automatically build and deploy your site to the `gh-pages` branch.

4. Your site will be published to `https://yourusername.github.io/your-repo-name/`

## Troubleshooting

### Asset paths not working

If images, CSS, or JavaScript are not loading, check that all paths in your code are relative paths. In the HTML, use:

```html
<script src="./assets/script.js"></script>
```

Instead of:

```html
<script src="/assets/script.js"></script>
```

### API calls failing

This app is set up to directly call the Hive Blockchain APIs from the frontend, which should work on GitHub Pages without modifications.

### Custom domain

If you want to use a custom domain:

1. Uncomment and modify the CNAME line in the `github-pages-deploy.js` file.
2. Run the deployment script again.
3. In GitHub repository settings, add your custom domain under the Pages section.