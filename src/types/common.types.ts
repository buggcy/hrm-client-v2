declare global {
  interface Window {
    toggleDevtools: () => void;
  }
}
export interface ParentReactNode {
  children: React.ReactNode;
}
