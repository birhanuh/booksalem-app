import { DefaultTheme } from '@react-navigation/native';

export const reactNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'steelblue',
    background: 'powderblue',
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
    searchBg: '#303337',
    success: '#49BD78',
    error: '#EC3C3E',
    warning: '#F7AA33',
    divider: 'powderblue',
  }
};
