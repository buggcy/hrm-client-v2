'use client';

import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useFetchAllCategories } from '@/hooks/usepolicyQuery';
import DataTableType from '@/libs/validations/data-table-type';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchTerm: string;
  onSearch: (term: string) => void;
  searchLoading: boolean;
  setFilterValue: (value: string[]) => void;
  filterValue: string[];
}

export function HrPolicyToolbar<TData extends DataTableType>({
  table,
  searchTerm,
  onSearch,
  searchLoading,
  setFilterValue,
  filterValue,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const selectedRowIds: string[] = table
    .getSelectedRowModel()
    .rows.map(row => row.original._id);

  const { data: categoriesData } = useFetchAllCategories();

  const hr_policies_categories = (categoriesData?.categories || []).map(
    category => {
      return {
        value: category,
        label: category,
      };
    },
  );

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
        {table.getColumn('category') && (
          <DataTableFacetedFilter
            title="Category"
            options={hr_policies_categories}
            filterValue={filterValue}
            onFilterChange={setFilterValue}
          />
        )}
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
