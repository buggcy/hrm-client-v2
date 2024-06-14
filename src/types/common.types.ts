declare global {
  interface Window {
    toggleDevtools: () => void;
  }
}

export interface ParentReactNode extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}
