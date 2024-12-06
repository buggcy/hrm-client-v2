'use client';

import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { perk_type_options } from '@/components/filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import DataTableType from '@/libs/validations/data-table-type';

import { DataTableFacetedFilter } from '../data-table-faceted-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchTerm: string;
  onSearch: (term: string) => void;
  searchLoading: boolean;
  setFilterValue: (value: string[]) => void;
  filterValue: string[];
}

export function HrPerkListToolbar<TData extends DataTableType>({
  table,
  searchTerm,
  onSearch,
  searchLoading,
  setFilterValue,
  filterValue,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter ..."
          value={searchTerm}
          onChange={event => onSearch(event.target.value)}
          inputClassName="h-8 w-[150px] lg:w-[250px]"
          loading={searchLoading}
        />

        <DataTableFacetedFilter
          onFilterChange={setFilterValue}
          title="Perk Type"
          options={perk_type_options}
          filterValue={filterValue}
        />

        {(isFiltered || searchTerm || filterValue.length > 0) && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              onSearch('');
              setFilterValue([]);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
