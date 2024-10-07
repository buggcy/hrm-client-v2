type TypographyProps = {
  children: React.ReactNode;
  className?: string;
};

const Typography = ({ children, className }: TypographyProps) => {
  return <p className={`text-base ${className}`}>{children}</p>;
};

export default Typography;
