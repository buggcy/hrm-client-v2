export type MenuItem = {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: MenuItem[];
};
