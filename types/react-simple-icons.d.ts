declare module 'react-simple-icons' {
  import { FC, SVGProps } from 'react';
  
  interface SimpleIconProps extends SVGProps<SVGSVGElement> {
    title?: string;
    size?: number | string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
  }

  export const siAmazon: FC<SimpleIconProps>;
  export const siNetflix: FC<SimpleIconProps>;
  export const siSpotify: FC<SimpleIconProps>;
  export const siStarbucks: FC<SimpleIconProps>;
  export const siUber: FC<SimpleIconProps>;
  export const siPaypal: FC<SimpleIconProps>;
  // Add other brand icons as needed
}
