import { ParentReactNode } from '@/types';

export interface LayoutBaseProps extends ParentReactNode {
  className?: string;
}

export interface LayoutHeaderProps {
  children?: React.ReactNode;
  title: string;
  className?: string;
}
