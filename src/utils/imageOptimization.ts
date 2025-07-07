/**
 * Image Optimization Utilities
 * 
 * Functions for optimizing and managing images in the application
 */

import { StaticImageData } from 'next/image';

// Types of optimized image formats supported
type ImageFormat = 'webp' | 'avif' | 'jpg' | 'png';

// Image quality settings for different purposes
const QUALITY_SETTINGS = {
  thumbnail: 65,
  preview: 75,
  standard: 80,
  high: 90
};

/**
 * Get optimal image size based on screen type
 */
export function getOptimalImageSize(
  screenType: 'mobile' | 'tablet' | 'desktop' | 'retina' = 'desktop'
): { width: number; height: number } {
  switch (screenType) {
    case 'mobile':
      return { width: 640, height: 640 };
    case 'tablet':
      return { width: 768, height: 768 };
    case 'desktop':
      return { width: 1280, height: 1280 };
    case 'retina':
      return { width: 1920, height: 1920 };
    default:
      return { width: 1280, height: 1280 };
  }
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(formats: ImageFormat[] = ['webp', 'jpg']): ImageFormat {
  if (typeof window === 'undefined') {
    return formats[0] || 'jpg';
  }
  
  // Check for WebP support
  if (formats.includes('webp') && hasWebPSupport()) {
    return 'webp';
  }
  
  // Check for AVIF support
  if (formats.includes('avif') && hasAvifSupport()) {
    return 'avif';
  }
  
  // Default to jpg or first format in array
  return formats.includes('jpg') ? 'jpg' : formats[0];
}

/**
 * Check if browser supports WebP format
 */
function hasWebPSupport(): boolean {
  try {
    return (
      document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
    );
  } catch (e) {
    return false;
  }
}

/**
 * Check if browser supports AVIF format
 * Note: This is a basic detection and might not work in all browsers
 */
function hasAvifSupport(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const img = new Image();
  img.src = 'data:image/avif;base64,AAAAFGZ0eXBhdmlmAAAAAG1pZjEAAACgbWV0YQAAAAAAAAAOcGl0bSAAAAAAAAABAAAADnBpeGkAAAAAAAAAAQAAAx9kYXRhAAAACFwAAAAMQUFWRCAAAAGAQk9OAm0AAAAAABNjb2xybmNseAABAAASAAEAEgAALGFwcGwAAAAAAAAAAABhdjFDAAAAAAAAAEJPTgAAAAAAAAAsAAAAAAEAAAEsAAEAAQABAAAAABNjbHJwAAAAAAAAABYAAAABAAAAFgAAAAFjcHJ0AAAAAAAAAAABAAAAY3RzZAAAAAAAAAABAAAAAQAAAGF2MUMBAAAAAAAAQk9OAAAAAAAAABYAAAAAAgABAAAAAAAFUAAAZgA8X3JhdwAAX3NldHRzAAAAAAAiAAAAAFJhdyBSZWNvcmQgc3R1YiB3aXRoIG5vIGRhdGEAAAAAX2NsbGkAAAAAAAAAAGNvbHIAAAABAAAAY3BybAAAAAEAAABwaXhpAAAADG1pbmYAAAAAAAAADm1pbmYAAAAAAAAAEHN0dHMAAAAAAAAAAAFzdGJsAAAAAAAAAAABYXYxQ3N0dHMAAAAAAAAAAgAAAAEAAAABAHN0c2QAAAAAAAAAAQAAAJgAAABkAHN0c3oAAAAAAAAAAAAAAGQAAAAYAAAAFAAAABQAAAAUAAAAFAAAABQAAAAUAAAAFAAAABQAAAAUAAAAFAAAABQAAAAUAAAAFAAAABQAAAAUAAAAFAAAABQAAAAUAAAAFAAAABQAAAAUAAAAFAAAABQAAAAUAAAAFAAAABQAAAAUAAAAFAAAABQAAAAUAAAAFAAAABQAAAAUAAAAFAAAABQAAAAUAHN0Y28AAAAAAAAAAQAAACsAAAABYXYxQ2F2Y0MBAAAAAAAAVgIAAAAAAAAAFjYxYTEwMjYwMGUwZjEwYjgwMDAwMDBAAAAAQGNvbHJuY2x4ABYAAQABAAEAAAAAEnZpZGUAAAAAAAAAAAAAAABzdHRzAAAAAAAAAAA=';
  return img.complete;
}

/**
 * Get image quality setting based on purpose
 */
export function getImageQuality(purpose: 'thumbnail' | 'preview' | 'standard' | 'high' = 'standard'): number {
  return QUALITY_SETTINGS[purpose];
}

/**
 * Generate responsive image srcset
 */
export function generateImageSrcSet(
  basePath: string,
  imageName: string,
  format: ImageFormat = 'webp',
  sizes: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  return sizes
    .map(size => {
      // Format: /images/example-640.webp 640w
      return `${basePath}/${imageName}-${size}.${format} ${size}w`;
    })
    .join(', ');
}

/**
 * Get responsive sizes attribute for images
 */
export function getResponsiveSizes(
  mobileSize: string = '100vw',
  tabletSize: string = '50vw',
  desktopSize: string = '33vw'
): string {
  return `(max-width: 640px) ${mobileSize}, (max-width: 1024px) ${tabletSize}, ${desktopSize}`;
}

/**
 * Generate blur data URL for image placeholders
 */
export function getBlurDataURL(color: string = 'F3F4F6'): string {
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#${color}"/>
    </svg>
  `).toString('base64')}`;
}

/**
 * Optimize image loading strategy
 * Returns props for Next.js Image component
 */
export function getOptimizedImageProps(
  src: string | StaticImageData,
  alt: string,
  priority: boolean = false,
  width: number = 0,
  height: number = 0
): {
  src: string | StaticImageData;
  alt: string;
  loading: 'eager' | 'lazy';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  width: number;
  height: number;
} {
  return {
    src,
    alt,
    loading: priority ? 'eager' : 'lazy',
    placeholder: 'blur',
    blurDataURL: getBlurDataURL(),
    width: width || 0,
    height: height || 0
  };
}