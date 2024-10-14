import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { AnnouncementType } from '@/libs/validations/hr-announcement';

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
  setFilterValue: (
    type: 'priority' | 'isEnabled' | 'gender',
    value: string[],
  ) => void;
  filterValue: {
    priority?: string[];
    status?: string[];
  };
}

export function HrAnnouncementToolbar<TData extends AnnouncementType>({
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
    .rows.map(row => row.original.hrId);

  //   const { mutate, isPending } = useMutation({
  //     mutationFn: exportAnnouncementsCSVData,
  //     onError: (err: AxiosError<MessageErrorResponseWithError>) => {
  //       toast({
  //         title: 'Error',
  //         description:
  //           err?.response?.data?.error || 'Error on exporting announcements!',
  //         variant: 'error',
  //       });
  //     },
  //     onSuccess: (response: string) => {
  //       const file = new Blob([response]);
  //       downloadFile(file, 'Announcements.csv');
  //     },
  //   });

  //   const handleExport = () => {
  //     if (selectedRowIds.length > 0) {
  //       mutate(selectedRowIds);
  //     }
  //   };

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
          onFilterChange={value => setFilterValue('priority', value)}
          title="Priority"
          options={priority_options}
          filterValue={filterValue.priority ?? []}
        />

        <DataTableFacetedFilter
          onFilterChange={value => setFilterValue('isEnabled', value)}
          title="Status"
          options={status_options}
          filterValue={filterValue.status ?? []}
        />

        {(isFiltered ||
          searchTerm ||
          (filterValue.priority && filterValue.priority.length > 0) ||
          (filterValue.status && filterValue.status.length > 0)) && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              onSearch('');
              setFilterValue('priority', []);
              setFilterValue('isEnabled', []);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>
      {/* {selectedRowIds.length > 0 && (
        <LoadingButton
          variant="outline"
          size="sm"
          className="ml-auto mr-2 flex h-8"
          //onClick={handleExport}
          //disabled={isPending}
          //loading={isPending}
        >
          <FileDown className="mr-2 size-4" />
          Export
        </LoadingButton>
      )} */}
      <DataTableViewOptions table={table} />
    </div>
  );
}
