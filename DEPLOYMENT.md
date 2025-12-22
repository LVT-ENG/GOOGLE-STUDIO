# Deployment Guide

This application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

## Automatic Deployment

The deployment process is handled by GitHub Actions:

1. Push your changes to the `main` branch
2. GitHub Actions workflow will automatically:
   - Install dependencies
   - Build the application
   - Deploy to GitHub Pages

The deployed site will be available at: `https://lvt-eng.github.io/GOOGLE-STUDIO/`

## Manual Deployment

If you need to trigger a manual deployment:

1. Go to the repository's Actions tab
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the branch (usually `main`)
5. Click "Run workflow"

## Local Development

To run the application locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

### GitHub Pages Setup

To enable GitHub Pages for this repository:

1. Go to repository Settings
2. Navigate to Pages section
3. Under "Build and deployment":
   - Source: GitHub Actions
4. Save the settings

### Environment Variables

If your application requires environment variables (like API keys):

1. Go to repository Settings
2. Navigate to Secrets and variables > Actions
3. Add your secrets (e.g., `GEMINI_API_KEY`)

## Build Output

The build process creates a `dist` folder containing:
- Optimized JavaScript bundles
- CSS files
- HTML files
- Static assets

This folder is automatically deployed to GitHub Pages.

## Troubleshooting

### Build Fails

If the build fails:
1. Check the Actions tab for error logs
2. Ensure all dependencies are properly listed in `package.json`
3. Verify the build passes locally with `npm run build`

### 404 Errors

If you encounter 404 errors after deployment:
1. Verify the `base` path in `vite.config.ts` matches your repository name
2. Check that GitHub Pages is enabled in repository settings
3. Ensure the workflow completed successfully

### Deployment Not Triggered

If deployment doesn't start automatically:
1. Check that the workflow file exists at `.github/workflows/deploy.yml`
2. Verify you pushed to the `main` branch
3. Check that GitHub Actions is enabled for the repository
