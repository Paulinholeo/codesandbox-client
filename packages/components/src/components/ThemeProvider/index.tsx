import deepmerge from 'deepmerge';
/**
 * There are 3 layers to our component styles.
 *
 * design language - spacing, fontsizes, radii, etc.
 * vscode theme - color tokens
 * polyfill - color tokens missing from vscode
 */
import React from 'react';
import {
  ThemeProvider as BaseThemeProvider,
  createGlobalStyle,
} from 'styled-components';

import designLanguage from '../../design-language';
import VSCodeThemes from '../../themes';
import polyfillTheme from '../../utils/polyfill-theme';

export const getThemes = () => {
  const results = VSCodeThemes.map(theme => ({
    name: theme.name,
    ...theme.content,
  }));

  return results.filter(a => a);
};

const guessType = theme => {
  if (theme.type) return theme.type;

  if (theme.name && theme.name.toLowerCase().includes('light')) return 'light';

  return 'dark';
};

export const makeTheme = (vsCodeTheme = {}, name?: string) => {
  // Our interface does not map 1-1 with vscode.
  // To add styles that remain themeable, we add
  // some polyfills to the theme tokens.
  const polyfilledVSCodeColors = polyfillTheme(vsCodeTheme);

  // merge the design language and vscode theme
  const theme = deepmerge(designLanguage, {
    colors: polyfilledVSCodeColors,
  });

  const type = guessType(vsCodeTheme);

  if (name) {
    return {
      name,
      type,
      ...theme,
    };
  }
  return theme;
};

export const ThemeProvider = ({ theme, children }) => {
  const usableTheme = makeTheme(theme);

  // the resizer lives outside the sidebar
  // to apply the right color to the resizer
  // we create a global style to be applied to it
  const ExternalStyles = createGlobalStyle`
    .Resizer {
      background-color: ${usableTheme.colors.sideBar.border} !important;
    }

    .editor-comments-highlight {
      background-color: ${usableTheme.colors.button.background};
      opacity: 0.2
    }

  `;

  return (
    <>
      <ExternalStyles />
      <BaseThemeProvider theme={usableTheme}>{children}</BaseThemeProvider>
    </>
  );
};
