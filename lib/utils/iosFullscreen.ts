// Add this to a new file: lib/utils/iosFullscreen.ts

export const setupIOSFullscreen = () => {
    // Only run on iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (!isIOS) return;
    
    // Function to handle fullscreen
    const goFullScreen = () => {
      // For iOS, we need to scroll slightly to hide the address bar
      window.scrollTo(0, 1);
    };
    
    // Add scroll event listener to hide address bar when scrolling
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        document.body.classList.add('ios-scrolled');
      } else {
        document.body.classList.remove('ios-scrolled');
      }
    });
    
    // Try to hide address bar when page loads and after orientation changes
    window.addEventListener('load', goFullScreen);
    window.addEventListener('orientationchange', goFullScreen);
    window.addEventListener('resize', goFullScreen);
    
    // Try immediately and after a short delay
    goFullScreen();
    setTimeout(goFullScreen, 100);
    setTimeout(goFullScreen, 500); // iOS sometimes needs a longer delay
  };