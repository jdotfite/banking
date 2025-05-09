'use client';

import { useEffect, useRef } from 'react';
import { bankingData } from '@/lib/data/fakeBankingData';

interface ResourceLoaderProps {
  onProgress: (progress: number) => void;
  onComplete: () => void;
  onError?: (error: Error) => void;
}

/**
 * ResourceLoader - Handles loading and caching of application resources
 * in a unified way (images, data, etc).
 */
const ResourceLoader: React.FC<ResourceLoaderProps> = ({
  onProgress,
  onComplete,
  onError
}) => {
  // Track loading state with refs to avoid re-renders
  const dataProgressRef = useRef(0);
  const imageProgressRef = useRef(0);
  const isCompleteRef = useRef(false);
  
  // Calculate combined progress (50% from data, 50% from images)
  const updateProgress = () => {
    const totalProgress = Math.round(
      (dataProgressRef.current * 0.5) + (imageProgressRef.current * 0.5)
    );
    onProgress(totalProgress);
    
    // Check if loading is complete
    if (dataProgressRef.current === 100 && imageProgressRef.current === 100 && !isCompleteRef.current) {
      isCompleteRef.current = true;
      
      // Set preloader complete header before calling onComplete
      if (typeof window !== 'undefined') {
        const headers = new Headers();
        headers.set('x-preloader-complete', 'true');
        window.dispatchEvent(new CustomEvent('preloader-complete', { detail: { headers } }));
      }
      
      onComplete();
    }
  };
  
  // Load banking data
  useEffect(() => {
    let isMounted = true;
    
    const loadBankingData = async () => {
      try {
        // Simulate API-like staged progress
        const totalSteps = 5;
        for (let step = 1; step <= totalSteps; step++) {
          if (!isMounted) return;
          
          // Simulate processing delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Update progress
          dataProgressRef.current = Math.round((step / totalSteps) * 100);
          updateProgress();
        }
        
        // Process and cache data
        try {
          // Process data
          const processedData = {...bankingData};
          
          // Cache data in localStorage
          localStorage.setItem('bankingData', JSON.stringify(processedData));
        } catch (err) {
          console.warn('Failed to cache banking data:', err);
          // Continue anyway - this is not critical
        }
        
        // Ensure 100% progress
        dataProgressRef.current = 100;
        updateProgress();
      } catch (err) {
        console.error('Error loading banking data:', err);
        const error = err instanceof Error ? err : new Error('Unknown error loading banking data');
        if (onError && isMounted) onError(error);
        
        // Even on error, mark as complete
        dataProgressRef.current = 100;
        updateProgress();
      }
    };
    
    loadBankingData();
    
    return () => {
      isMounted = false;
    };
  }, [onError]);
  
  // Load images
  useEffect(() => {
    let isMounted = true;
    
    const loadImages = async () => {
      // Define essential images to preload
      const imagesToPreload = [
        '/icons/icon-transparent.svg',
        '/images/cards/visa-logo.svg',
        '/images/ui/loading-spinner.svg',
        '/images/avatar/placeholder.svg',
        '/images/merchants/default.svg',
        '/images/ui/header-bg.svg'
      ];
      
      let loadedCount = 0;
      let failedCount = 0;
      const totalCount = imagesToPreload.length;
      
      const updateImageProgress = () => {
        const progress = Math.round(((loadedCount + failedCount) / totalCount) * 100);
        imageProgressRef.current = progress;
        updateProgress();
      };
      
      // Load images in parallel
      const loadPromises = imagesToPreload.map(src => {
        return new Promise<void>(resolve => {
          const img = new Image();
          
          img.onload = () => {
            if (!isMounted) return;
            loadedCount++;
            updateImageProgress();
            resolve();
          };
          
          img.onerror = () => {
            if (!isMounted) return;
            failedCount++;
            updateImageProgress();
            resolve(); // Resolve anyway to not block loading
          };
          
          // Set timeout to prevent hanging
          const timeout = setTimeout(() => {
            if (img.complete) return;
            failedCount++;
            updateImageProgress();
            resolve();
          }, 5000);
          
          img.onload = () => {
            clearTimeout(timeout);
            if (!isMounted) return;
            loadedCount++;
            updateImageProgress();
            resolve();
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            if (!isMounted) return;
            failedCount++;
            updateImageProgress();
            resolve();
          };
          
          img.src = src;
        });
      });
      
      // Wait for all images to load or fail
      await Promise.all(loadPromises);
      
      // Ensure 100% progress
      imageProgressRef.current = 100;
      updateProgress();
    };
    
    loadImages();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // This component renders nothing
  return null;
};

export default ResourceLoader;
