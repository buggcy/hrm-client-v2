import * as React from 'react';

import { CheckIcon, PlusCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/utils';

export type FilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

interface DataTableFacetedFilterProps {
  title?: string;
  options: FilterOption[];
  onFilterChange?: (filterValue: string[]) => void;
  filterValue: string[];
}

export function DataTableFacetedFilter({
  title,
  options,
  onFilterChange,
  filterValue,
}: DataTableFacetedFilterProps) {
  const handleSelectionChange = React.useCallback(
    (value: string) => {
      const updatedValues = filterValue.includes(value)
        ? filterValue.filter(v => v !== value)
        : [...filterValue, value];

      onFilterChange?.(updatedValues);
    },
    [onFilterChange, filterValue],
  );

  const clearFilters = React.useCallback(() => {
    onFilterChange?.([]);
  }, [onFilterChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 size-4" />
          {title}
          {filterValue.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {filterValue.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {filterValue.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {filterValue.length} selected
                  </Badge>
                ) : (
                  options
                    .filter(option => filterValue.includes(option.value))
                    .map(option => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = filterValue.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelectionChange(option.value)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-transparent',
                      )}
                    >
                      {isSelected && <CheckIcon className="size-4" />}
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 size-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {filterValue.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <button
                    className="flex w-full items-center justify-center px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => {
                      console.log('Clear filters button clicked');
                      clearFilters();
                    }}
                  >
                    Clear filters
                  </button>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
