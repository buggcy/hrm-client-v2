import * as React from 'react';

export interface RadioInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioInput: React.FC<RadioInputProps> = ({
  label,
  onChange,
  id,
  value,
  checked,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  };

  return (
    <div className="flex items-center">
      <input
        id={id}
        type="radio"
        value={value}
        checked={checked}
        onChange={handleChange} //
        className="size-4"
        {...props}
      />
      <label htmlFor={id} className="ml-2 text-sm">
        {label}
      </label>
    </div>
  );
};

export { RadioInput };
