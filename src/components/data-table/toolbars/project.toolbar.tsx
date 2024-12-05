'use client';

import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import {
  project_active_options,
  project_status_options,
} from '@/components/filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ProjectListType } from '@/libs/validations/project-department';

import { DataTableFacetedFilter } from '../data-table-faceted-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchLoading: boolean;
  searchTerm: string;
  onSearch: (term: string) => void;
  setFilterValue: (value: string[]) => void;
  filterValue: string[];
  setActiveFilterValue: (value: string[]) => void;
  activeFilterValue: string[];
}

export function ProjectToolbar<TData extends ProjectListType>({
  table,
  searchTerm,
  onSearch,
  searchLoading,
  setFilterValue,
  filterValue,
  activeFilterValue,
  setActiveFilterValue,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter ..."
          inputClassName="h-8 w-[150px] lg:w-[250px]"
          value={searchTerm}
          onChange={event => onSearch(event.target.value)}
          loading={searchLoading}
        />
        <DataTableFacetedFilter
          onFilterChange={setFilterValue}
          title="Status"
          options={project_status_options}
          filterValue={filterValue}
        />
        <DataTableFacetedFilter
          onFilterChange={setActiveFilterValue}
          title="Active"
          options={project_active_options}
          filterValue={activeFilterValue}
        />
        {(isFiltered ||
          searchTerm ||
          filterValue.length > 0 ||
          activeFilterValue.length > 0) && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              onSearch('');
              setFilterValue([]);
              setActiveFilterValue([]);
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
