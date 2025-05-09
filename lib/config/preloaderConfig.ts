// lib/config/preloaderConfig.ts
export const preloaderConfig = {
  // General preloader settings
  enabled: true,  // Set to false to disable preloading in all environments
  devModeEnabled: false, // Whether to enable preloading in development mode
  
  // Banking data preloader settings
  bankingData: {
    simulateApiDelay: 1500, // Milliseconds to simulate API loading time
    preProcessData: true,   // Whether to pre-process data for faster rendering
    persistData: true,      // Whether to persist data in localStorage
    clearCacheOnReload: false, // Whether to clear cache on full page reload
    weight: 0.5             // Weight (0-1) for progress calculation
  },
  
  // Image preloader settings
  images: {
    timeout: 10000,    // Milliseconds to wait before timing out image preloading
    retries: 2,        // Number of retries for failed image loads
    parallel: 8,       // Number of images to load in parallel
    weight: 0.5,       // Weight (0-1) for progress calculation
    priorityImages: [  // These images will be loaded first
      '/icons/icon-transparent.svg',
      '/images/cards/visa-logo.svg',
      '/images/ui/loading-spinner.svg',
      '/images/ui/header-bg.svg',
      '/images/merchants/default.svg'
    ]
  },
  
  // Loading screen appearance
  loadingScreen: {
    logo: '/icons/icon-transparent.svg',
    minDisplayTime: 1000, // Minimum time to show loading screen in milliseconds
    transitionDuration: 500 // Transition duration in milliseconds
  }
};

export default preloaderConfig;
