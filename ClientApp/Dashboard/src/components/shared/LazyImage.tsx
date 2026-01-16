import React, { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../../hooks/usePerformance';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Lazy Image Component
 * Loads images only when they enter the viewport
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E',
  threshold = 0.01,
  rootMargin = '50px',
  onLoad,
  onError,
  className = '',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const { hasIntersected } = useIntersectionObserver(imgRef as React.RefObject<HTMLElement>, {
    threshold,
    rootMargin
  });

  useEffect(() => {
    if (hasIntersected && !isLoaded && !hasError) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };

      img.onerror = () => {
        setHasError(true);
        onError?.();
      };

      img.src = src;
    }
  }, [hasIntersected, src, isLoaded, hasError, onLoad, onError]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-50'
      } ${className}`}
      loading="lazy"
      {...props}
    />
  );
};

/**
 * Lazy Background Image Component
 * Loads background images only when they enter the viewport
 */
interface LazyBackgroundProps {
  src: string;
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const LazyBackground: React.FC<LazyBackgroundProps> = ({
  src,
  placeholder,
  children,
  className = '',
  style = {}
}) => {
  const [backgroundImage, setBackgroundImage] = useState(
    placeholder ? `url(${placeholder})` : 'none'
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const { hasIntersected } = useIntersectionObserver(divRef as React.RefObject<HTMLElement>, {
    threshold: 0.01,
    rootMargin: '50px'
  });

  useEffect(() => {
    if (hasIntersected && !isLoaded) {
      const img = new Image();
      img.onload = () => {
        setBackgroundImage(`url(${src})`);
        setIsLoaded(true);
      };
      img.src = src;
    }
  }, [hasIntersected, src, isLoaded]);

  return (
    <div
      ref={divRef}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-50'
      } ${className}`}
      style={{
        ...style,
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {children}
    </div>
  );
};
