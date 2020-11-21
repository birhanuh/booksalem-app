import { DefaultTheme } from '@react-navigation/native';

export const reactNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'steelblue',
    background: '#F0F7FE',
  },
};

export const reactNativeElementTheme = {
  colors: {
    primary: 'steelblue',
    secondary: 'skyblue',
    white: '#ffffff',
    black: '#242424',
    grey0: '#393e42',
    greyOutline: '#bbb',
    searchBg: 'powderblue',
    success: '#49BD78',
    error: '#EC3C3E',
    warning: '#F7AA33',
    divider: 'powderblue',
  }
};

export const colorsLocal = {
  tertiary: 'powderblue',
  info: 'steelblue',
  infoBg: '#d1e0ed',
  successBg: '#f9c4c5',
  errorBg: '#f9c4c5',
  warningBg: '#fce5c1'
};
