declare module "react-simple-maps" {
  import React from "react";

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: any;
    width?: number | string;
    height?: number | string;
    children?: React.ReactNode;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;

  export interface GeographiesProps {
    geography: any;
    children?: (props: any) => React.ReactNode;
  }

  export const Geographies: React.FC<GeographiesProps>;

  export interface GeographyProps {
    geography?: any;
    style?: any;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onClick?: React.MouseEventHandler;
    [key: string]: any;
  }

  export const Geography: React.FC<GeographyProps>;
}
