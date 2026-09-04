import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 430;
  const isTablet = width >= 430 && width < 834;
  const isDesktop = width >= 834;
  const isLandscape = width > height;
  return { width, height, isMobile, isTablet, isDesktop, isLandscape };
}
