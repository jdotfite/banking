# Banking App Performance Guide

This guide explains the optimizations made to improve the performance of the banking app, particularly focusing on development compilation speed and Fast Refresh functionality.

## Recent Optimizations

### 1. CSS Structure Improvements

- **Separated CSS into Base and Dynamic Styles**: 
  - Created `app/base-styles.css` for static styles that rarely change
  - Simplified `app/globals.css` to only include Tailwind directives and import the base styles
  - This prevents full page reloads when making small CSS changes

### 2. Component Structure Improvements

- **Created Provider Components**:
  - `ThemeContextProvider`: Isolates theme context changes
  - `IOSFullScreenProvider`: Separates iOS-specific functionality
  - These changes prevent cascading re-renders when these components change

### 3. Next.js Configuration Optimizations

- **Enhanced webpack Configuration**:
  - Added CSS chunking for better performance
  - Configured SWC compiler optimizations
  - Added package import optimization for `lucide-react`
  - Enabled CSS optimization

### 4. Development Workflow Improvements

- **Created Optimization Scripts**:
  - `scripts/optimize-dev.ps1` (Windows)
  - `scripts/optimize-dev.sh` (Mac/Linux)
  - These scripts clear caches and restart the development server with optimized settings

## How to Use the Optimization Scripts

### Windows

```powershell
# Run from the project root
.\scripts\optimize-dev.ps1
```

### Mac/Linux

```bash
# Make the script executable (one-time)
chmod +x scripts/optimize-dev.sh

# Run from the project root
./scripts/optimize-dev.sh
```

## Best Practices for Maintaining Performance

1. **Keep CSS Modular**:
   - Put rarely changing styles in `base-styles.css`
   - Use Tailwind classes for component-specific styling
   - Avoid large CSS changes to global files

2. **Component Structure**:
   - Use provider pattern for context that doesn't change often
   - Keep components focused and avoid deep nesting
   - Use memoization for expensive calculations

3. **Regular Maintenance**:
   - Periodically run the optimization scripts to clear caches
   - Monitor for new Fast Refresh warnings
   - Update Next.js and dependencies regularly

4. **Code Splitting**:
   - Use dynamic imports for large components not needed on initial load
   - Consider lazy loading for routes that aren't frequently accessed

## Troubleshooting

If you encounter Fast Refresh warnings or slow compilation:

1. Check which files are causing the warnings
2. Consider if those files can be further modularized
3. Run the optimization script to clear caches
4. Ensure you're not importing large libraries unnecessarily
