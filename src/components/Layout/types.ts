import { ParentReactNode } from '@/types';

export interface LayoutBaseProps extends ParentReactNode {
  className?: string;
  wrapperClassName?: string;
}

export interface LayoutHeaderProps {
  children?: React.ReactNode;
  title: string;
  className?: string;
  leftElement?: React.ReactNode;
}
