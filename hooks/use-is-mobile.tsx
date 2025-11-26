'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to determine if the current screen size is considered "mobile".
 * @returns {boolean} - True if the screen width is less than or equal to 768px, otherwise false.
 */
const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
