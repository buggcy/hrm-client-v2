'use client';
import React, { useRef, useState } from 'react';

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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleSelect = (value: string): void => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter(item => item !== value)
      : [...selectedValues, value];
    onChange(updatedValues);
  };

  const selectedLabels = options
    .filter(option => selectedValues.includes(option.value))
    .map(option => option.label);

  const displayLabel =
    selectedLabels.length > 0
      ? selectedLabels
          .slice(0, type === 'Technology' || type === 'Projects' ? 7 : 1)
          .join(', ') +
        (selectedLabels.length >
        (type === 'Technology' || type === 'Projects' ? 7 : 1)
          ? ', ...'
          : '')
      : `Choose ${type}`;

  React.useEffect(() => {
    if (isOpen) {
      const handleOutsideClick = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          closeDropdown();
        }
      };
      document.body.addEventListener('click', handleOutsideClick);
      return () =>
        document.body.removeEventListener('click', handleOutsideClick);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <div
        onClick={toggleDropdown}
        className={`flex ${type === 'Technology' ? 'h-[49px]' : 'h-[40px]'} w-full items-center justify-between overflow-hidden truncate rounded-md border px-3 py-2 text-left text-sm`}
      >
        <span className="overflow-hidden truncate whitespace-nowrap">
          {displayLabel}
        </span>
        <span className="opacity-50">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 max-h-96 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
        >
          <ScrollArea className={`h-40`}>
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
