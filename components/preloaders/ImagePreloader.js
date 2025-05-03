// ImagePreloader.js
// Specialized component for preloading banking images

import React, { useState, useEffect } from 'react';

/**
 * Banking App Image Preloader
 * 
 * This utility aggressively preloads all images needed for the initial app experience,
 * including card backgrounds, merchant icons, and UI elements.
 * 
 * @param {Function} onComplete - Callback when all images are loaded
 * @param {Function} onProgress - Callback with loading progress (0-100)
 * @param {Object} options - Configuration options
 */
const ImagePreloader = ({ onComplete, onProgress, options = {} }) => {
  // Configuration with defaults
  const config = {
    timeout: options.timeout || 15000, // 15 second timeout default
    retries: options.retries || 2,     // Retry failed images twice
    parallel: options.parallel || 6,   // Load 6 images in parallel
    ...options
  };
  
  // Track loading state
  const [loadStatus, setLoadStatus] = useState({
    loaded: 0,
    failed: 0,
    total: 0,
    inProgress: 0,
    complete: false
  });
  
  // List all images to preload by category
  const imagesToPreload = {
    essentialUI: [
      // App UI elements - Priority 1
      '/images/icons/logo.png',
      '/images/ui/loading-spinner.svg',
      '/images/ui/header-bg.png'
    ],
    
    avatars: [
      // User avatars - Priority 2
      '/images/avatar/jess-coleman.png',
      '/images/avatar/robert-thompson.png',
    ],
    
    cards: [
      // Credit card images - Priority 3
      '/images/cards/visa-signature-bg.png',
      '/images/cards/visa-platinum-bg.png',
      '/images/cards/visa-logo.svg',
      '/images/cards/chip.png'
    ],
    
    merchantIcons: [
      // Transaction merchant icons - Priority 4
      '/images/icons/merchants/coffee.svg',
      '/images/icons/merchants/shopping.svg',
      '/images/icons/merchants/food.svg',
      '/images/icons/merchants/entertainment.svg',
      '/images/icons/merchants/transport.svg',
      '/images/icons/merchants/utilities.svg',
      '/images/icons/merchants/health.svg',
      '/images/icons/merchants/payroll.svg',
      '/images/icons/merchants/home.svg'
    ],
    
    otherContent: [
      // Marketing and secondary images - Priority 5
      '/images/refer/refer-friend.png',
      '/images/marketing/promo-banner.jpg',
      '/images/ui/card-pattern.svg'
    ]
  };
  
  // Flatten and prioritize images
  const allImages = [
    ...imagesToPreload.essentialUI,
    ...imagesToPreload.avatars,
    ...imagesToPreload.cards,
    ...imagesToPreload.merchantIcons,
    ...imagesToPreload.otherContent
  ];
  
  // Preload images in a controlled manner
  useEffect(() => {
    if (allImages.length === 0) {
      onComplete && onComplete();
      return;
    }
    
    let active = true; // For cleanup
    let queue = [...allImages];
    let loading = 0;
    let loadedCount = 0;
    let failedCount = 0;
    let retryMap = {};
    
    // Set initial state
    setLoadStatus({
      loaded: 0,
      failed: 0,
      total: queue.length,
      inProgress: 0,
      complete: false
    });
    
    // Process the next image in queue
    const processNext = () => {
      if (!active) return;
      
      // If queue is empty and nothing is loading, we're done
      if (queue.length === 0 && loading === 0) {
        setLoadStatus(prev => ({
          ...prev,
          inProgress: 0,
          complete: true
        }));
        onComplete && onComplete();
        return;
      }
      
      // Only load up to config.parallel images at once
      while (queue.length > 0 && loading < config.parallel) {
        const src = queue.shift();
        loading++;
        
        const img = new Image();
        const startTime = Date.now();
        
        // Handle successful load
        img.onload = () => {
          if (!active) return;
          
          loadedCount++;
          loading--;
          
          setLoadStatus(prev => {
            const newStatus = {
              ...prev,
              loaded: prev.loaded + 1,
              inProgress: prev.inProgress - 1
            };
            
            // Calculate and report progress
            const progress = Math.round(((newStatus.loaded + newStatus.failed) / newStatus.total) * 100);
            onProgress && onProgress(progress);
            
            return newStatus;
          });
          
          // Process next image
          processNext();
        };
        
        // Handle failed load
        img.onerror = () => {
          if (!active) return;
          
          // Implement retry logic
          const retryCount = retryMap[src] || 0;
          
          if (retryCount < config.retries) {
            // Put back in queue for retry
            retryMap[src] = retryCount + 1;
            queue.push(src);
          } else {
            // Mark as failed after retries
            failedCount++;
            
            setLoadStatus(prev => {
              const newStatus = {
                ...prev,
                failed: prev.failed + 1,
                inProgress: prev.inProgress - 1
              };
              
              // Calculate and report progress even for failures
              const progress = Math.round(((newStatus.loaded + newStatus.failed) / newStatus.total) * 100);
              onProgress && onProgress(progress);
              
              return newStatus;
            });
          }
          
          loading--;
          processNext();
        };
        
        // Track in-progress loads
        setLoadStatus(prev => ({
          ...prev,
          inProgress: prev.inProgress + 1
        }));
        
        // Start loading image
        img.src = src;
        
        // Set timeout for individual image load
        setTimeout(() => {
          if (img.complete) return;
          // Force error event if image takes too long
          img.dispatchEvent(new Event('error'));
        }, config.timeout);
      }
    };
    
    // Start processing queue
    processNext();
    
    // Cleanup function
    return () => {
      active = false;
    };
  }, [allImages, config, onComplete, onProgress]);
  
  // Component doesn't render anything visible
  return null;
};

export default ImagePreloader;
