'use client';

import React from 'react';
import { useTheme } from 'next-themes';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { usePersistentState } from '@/hooks';
import { cn } from '@/utils';

import { Code, Languages } from './Code';

// TODO: Mote it to separate tabs list variant
const tabsTriggerClassName =
  'inline-flex items-center  justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  relative h-9 rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none  data-[state=active]:border-b-black data-[state=active]:focus:border-b-primary data-[state=active]:hover:border-b-primary focus:!text-primary hover:!text-primary data-[state=active]:text-foreground data-[state=active]:border-foreground data-[state=active]:shadow-none';

export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': '<api-key>',
};

type getSnippet = (data: {
  url: string;
  method: string;
  body: Record<string, unknown> | string;
  headers?: Record<string, string> | string;
}) => string;

const getCurlSnippet: getSnippet = ({
  url,
  method,
  body,
  headers = DEFAULT_HEADERS,
}) => {
  const headerString =
    typeof headers === 'string'
      ? headers
      : typeof headers === 'object'
        ? Object.entries(headers)
            .map(([key, value]) => `-H "${key}: ${value}"`)
            .join(' \\\n  ')
        : '';

  const bodyString =
    typeof body === 'string'
      ? body
      : typeof body === 'object' && Object.keys(body).length > 0
        ? `-d '${JSON.stringify(body, null, 4)}'`
        : '';

  return `curl --request ${method.toUpperCase()} \\
  --url ${url} \\
  ${headerString} \\
  ${bodyString}`;
};

const getJsSnippet: getSnippet = ({
  url,
  method,
  body,
  headers = DEFAULT_HEADERS,
}) => `fetch('${url}', {
  method: '${method.toUpperCase()}',
  headers: {
    ${Object.entries(headers)
      .map(([key, value]) => `"${key}": "${value}",`)
      .join('\n    ')}
  },
  body: {
    ${Object.entries(body)
      .map(([key, value]) => `"${key}": "${value as string}",`)
      .join('\n    ')}
  },
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
`;

const getPythonSnippet: getSnippet = ({
  url,
  method,
  body,
  headers = DEFAULT_HEADERS,
}) => `import requests

headers = ${headers ? JSON.stringify(headers, null, 4) : '{}'}
data = ${body && Object.keys(body).length > 0 ? JSON.stringify(body, null, 4) : '{}'}

response = requests.${method.toLowerCase()}(
  '${url}', 
  headers=headers, 
  json=data
)

print(response.json())`;

const createCodeSnippet = ({
  language,
  ...data
}: {
  url: string;
  method: HttpMethods;
  body: Record<string, unknown>;
  headers?: Record<string, string>;
  language: Languages;
}) => {
  switch (language) {
    case Languages.CURL:
      return getCurlSnippet(data);
    case Languages.JAVASCRIPT:
      return getJsSnippet(data);
    case Languages.PYTHON:
      return getPythonSnippet(data);
    default:
      // NOTE: should never happen
      return 'In progress...';
  }
};
const PERSIST_STATE_KEY = 'ApiCodePreviewLanguage';
export const ApiCode = ({
  url,
  method,
  body,
  className,
}: {
  url: string;
  method: HttpMethods;
  body: Record<string, unknown>;
  className?: string;
}) => {
  const { resolvedTheme } = useTheme();
  const [language, setLanguage] = usePersistentState<Languages>(
    PERSIST_STATE_KEY,
    Languages.CURL,
  );
  const code = createCodeSnippet({ url, method, body, language });

  return (
    <div className={cn('h-full overflow-hidden', className)}>
      <Tabs
        value={language}
        onValueChange={value => {
          setLanguage(value as Languages);
        }}
        className="flex h-full flex-1 flex-col"
      >
        <header className="flex justify-between">
          {/* FIX OUTLINE ON FOCUS*/}
          <TabsList className="no-scrollbar mb-4 inline-flex h-9 w-full justify-start space-x-4 overflow-x-scroll rounded-none border-b bg-transparent p-0 text-muted-foreground">
            <TabsTrigger
              className={tabsTriggerClassName}
              value={Languages.CURL}
            >
              cURL
            </TabsTrigger>
            <TabsTrigger
              className={tabsTriggerClassName}
              value={Languages.JAVASCRIPT}
            >
              JavaScript
            </TabsTrigger>
            <TabsTrigger
              className={tabsTriggerClassName}
              value={Languages.PYTHON}
            >
              Python
            </TabsTrigger>
          </TabsList>
          <CopyToClipboardButton textToCopy={code} />
        </header>
        <Code
          className="h-full overflow-hidden"
          value={code}
          language={language}
          theme={resolvedTheme}
        />
      </Tabs>
    </div>
  );
};
