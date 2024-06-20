// TODO @vekaev: add styling to it (https://github.com/PrismJS/prism/issues/1160)
export default function curl(Prism) {
  Prism.languages.curl = Prism.languages.extend('javascript', {
    curl: /\bcurl\b/,
    url: /https?:\/\/[a-zA-Z0-9\-._~:/?#@!$&'()*+,;=%]+/,
    parameter: {
      pattern: /[A-Za-z0-9[\]-_]+ *(?==)/,
    },
    value: [
      {
        pattern: /(=)([A-Za-z0-9-_.]*)/,
        lookbehind: true,
      },
      {
        pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      },
      {
        pattern: /(-u )([A-Za-z0-9-_.{}]*)/,
        lookbehind: true,
      },
    ],
    option: / *-[a-zA-Z]*\b/,
  });

  Prism.languages.insertBefore('curl', 'operator', {
    'api-key': {
      pattern: /-u ([a-zA-Z0-9_]+)/g,
      inside: {
        'request-flag': /(^-u)/g,
      },
    },
    'request-param': {
      pattern: /-d ([a-zA-Z0-9]+)/g,
      inside: {
        'request-flag': /(^-d)/g,
      },
    },
    'request-value': {
      pattern: /=(.*?)[\n\\]/g,
      inside: {
        operator: /(^=)|(\\$)/g,
      },
    },
  });
  Prism.languages.insertBefore('curl', 'number', {
    'request-url': {
      pattern: /^curl (.*?)[\n\\]/g,
      inside: {
        operator: /(\\$)/g,
        keyword: /(^curl)/g,
      },
    },
  });
}

curl.displayName = 'curl';
