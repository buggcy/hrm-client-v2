import React from 'react';

import {
  PrismLight as _SyntaxHighlighter,
  SyntaxHighlighterProps as _SyntaxHighlighterProps,
} from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import darkTheme from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
import lightTheme from 'react-syntax-highlighter/dist/esm/styles/prism/one-light';

import curl from './prism/curl';

_SyntaxHighlighter.registerLanguage('curl', curl);
_SyntaxHighlighter.registerLanguage('python', python);
_SyntaxHighlighter.registerLanguage('javascript', javascript);

export const Languages = {
  CURL: 'curl',
  JAVASCRIPT: 'javascript',
  PYTHON: 'python',
} as const;

export type Languages = (typeof Languages)[keyof typeof Languages];

export interface SyntaxHighlighterProps
  extends Omit<_SyntaxHighlighterProps, 'children'> {
  language: Languages;
  value: string;
  className?: string;
  children?: never;
  theme?: string;
}

export const Code: React.FC<SyntaxHighlighterProps> = ({
  className,
  value,
  theme,
  ...props
}) => (
  <div className={className}>
    <_SyntaxHighlighter
      customStyle={{
        marginTop: 0,
        height: '100%',
        overflow: 'scroll',
        position: 'relative',
        scrollbarWidth: 'none',
      }}
      // showLineNumbers
      {...props}
      style={theme === 'dark' ? darkTheme : lightTheme}
    >
      {value}
    </_SyntaxHighlighter>
  </div>
);
