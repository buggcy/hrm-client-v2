import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import DataTableType from '@/libs/validations/data-table-type';

const priority_options = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
];

const status_options = [
  { label: 'Enabled', value: 'true' },
  { label: 'Disabled', value: 'false' },
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchTerm: string;
  onSearch: (term: string) => void;
  searchLoading: boolean;
  setFilterValue: (value: string[]) => void;
  filterValue: string[];
}

export function HrAnnouncementToolbar<TData extends DataTableType>({
  table,
  searchTerm,
  onSearch,
  searchLoading,
  setFilterValue,
  filterValue,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const selectedRowIds: string[] = table
  //   .getSelectedRowModel()
  //   .rows.map(row => row.original.hrId);

  const handleFilterChange = (
    type: 'priority' | 'isEnabled',
    value: string[],
  ) => {
    const otherFilters =
      type === 'priority'
        ? filterValue.filter(v => ['true', 'false'].includes(v))
        : filterValue.filter(v => ['Low', 'Medium', 'High'].includes(v));
    setFilterValue([...otherFilters, ...value]);
  };

  const getPriorityFilterValue = () =>
    filterValue.filter(v => ['Low', 'Medium', 'High'].includes(v));
  const getStatusFilterValue = () =>
    filterValue.filter(v => ['true', 'false'].includes(v));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter ..."
          value={searchTerm}
          onChange={event => onSearch(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
          loading={searchLoading}
        />

        <DataTableFacetedFilter
          onFilterChange={value => handleFilterChange('priority', value)}
          title="Priority"
          options={priority_options}
          filterValue={getPriorityFilterValue()}
        />

        <DataTableFacetedFilter
          onFilterChange={value => handleFilterChange('isEnabled', value)}
          title="Status"
          options={status_options}
          filterValue={getStatusFilterValue()}
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
