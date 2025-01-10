import React, { useState } from 'react';

import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  Tahometer_ID?: string;
}

interface MultiSelectEmployeeProps {
  label?: string;
  options: Employee[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  disabled?: boolean;
}

const MultiSelectEmployee: React.FC<MultiSelectEmployeeProps> = ({
  options,
  selectedValues,
  onChange,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (employeeId: string) => {
    if (selectedValues.includes(employeeId)) {
      onChange(selectedValues.filter(id => id !== employeeId));
    } else {
      onChange([...selectedValues, employeeId]);
    }
  };

  return (
    <div
      className={`relative ${disabled ? 'pointer-events-none opacity-50' : ''}`}
    >
      <div className="relative">
        <div
          className="flex h-[50px] w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm"
          onClick={() => setIsOpen(prev => !prev)}
        >
          {selectedValues.length > 0
            ? `Selected Employees`
            : 'Select Employees'}
          <span className="opacity-50">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
            <ScrollArea className="h-60">
              <div className="p-1">
                {options.map(employee => (
                  <div
                    key={employee.id}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent"
                    onClick={() => handleSelect(employee.id)}
                  >
                    <span className="absolute left-2 flex items-center justify-center">
                      {selectedValues.includes(employee.id) && (
                        <Check size={16} />
                      )}
                    </span>

                    <Avatar className="size-8">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback className="uppercase">
                        {employee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex flex-col">
                      <p>{employee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {employee.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectEmployee;
