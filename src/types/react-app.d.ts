/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace React {
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  type ReactNode = ReactElement | string | number | boolean | null | undefined;

  interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }

  interface FormEvent<T = Element> extends SyntheticEvent<T> {
  }

  interface EventTarget {
    value?: string;
    checked?: boolean;
    files?: FileList | null;
    name?: string;
    type?: string;
  }

  interface FC<P = {}> {
    (props: P & { children?: ReactNode }): ReactElement | null;
    displayName?: string;
  }

  const StrictMode: FC<{ children?: ReactNode }>;
}

declare module 'react' {
  export * from 'react';
  export const StrictMode: React.FC<{ children?: React.ReactNode }>;
}

declare module 'react-dom/client' {
  export * from 'react-dom/client';
}

export {}; 