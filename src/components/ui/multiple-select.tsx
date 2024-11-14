import React, { useState } from 'react';

import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { ScrollArea } from './scroll-area';

interface MultiSelectProps {
  options: { value: string; label: string }[];
  label?: string;
  selectedValues: string[];
  type?: string;
  onChange: (selectedValues: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleSelect = (value: string) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter(item => item !== value)
      : [...selectedValues, value];

    onChange(updatedValues);
  };

  const selectedLabels = options
    .filter(option => selectedValues.includes(option.value))
    .map(option => option.label);

  const displayLabel =
    selectedLabels.length > 0 ? selectedLabels.join(', ') : `Choose ${type}`;

  return (
    <div className="relative">
      <div
        onClick={toggleDropdown}
        className={`flex ${type === 'Departments' ? 'h-[40px]' : 'h-[50px]'} w-full items-center justify-between truncate rounded-md border px-3 py-2 text-left text-sm`}
      >
        {displayLabel}
        <span className="opacity-50">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-96 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
          <ScrollArea className="h-60">
            <div className="p-1">
              {options.map(option => (
                <div
                  key={option.value}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent"
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="absolute left-2 flex items-center justify-center">
                    {selectedValues.includes(option.value) && (
                      <Check size={16} />
                    )}
                  </span>
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
