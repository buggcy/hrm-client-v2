import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { CirclePlus } from 'lucide-react';

import { designationColumn } from '@/components/data-table/columns/designation.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';

import { useFetchAllDesignations } from '@/hooks/hr/useDesignation.hook';
import { Designation } from '@/libs/validations/hr-designation.validation';
interface DesignationTableProps {
  handleDialogOpen: () => void;
}

const DesignationTable: React.FC<DesignationTableProps> = ({
  handleDialogOpen,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const status = searchParams.get('status') || 'designation';
  const initialSearchTerm = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [filterValue, setFilterValue] = useState<string[]>([]); // Added state

  const {
    data: designationList,
    isLoading: isDesignationsLoading,
    isFetching,
    error,
    refetch,
  } = useFetchAllDesignations({
    page,
    limit,
    status,
  });

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        await refetch();
      } catch (error) {
        console.error('Error refetching designations:', error);
      }
    };

    void fetchDesignations();
  }, [refetch]);

  const filteredData = useMemo(() => {
    if (!designationList?.data) return [];
    return designationList.data.filter((designation: Designation) =>
      Object.values(designation).some(
        value =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [designationList?.data, searchTerm]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', '1');
    newSearchParams.set('search', term);
  };

  if (isDesignationsLoading)
    return <DataTableLoading columnCount={5} rowCount={limit} />;

  if (error) {
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  const tablePageCount: number = Math.ceil(
    (designationList?.pagination?.totalCount || 0) / limit,
  );

  return (
    <>
      <div className="flex flex-col gap-12">
        <Header subheading="Manage company designations.">
          <Button
            className="flex items-center justify-center gap-1.5"
            variant="default"
            onClick={handleDialogOpen}
          >
            <CirclePlus size={20} />
            <span>Add Designation</span>
          </Button>
        </Header>
      </div>
      <div>
        <DataTable
          data={filteredData}
          columns={designationColumn}
          pagination={{
            pageCount: tablePageCount,
            page,
            limit,
            onPaginationChange: (newPage: number, newLimit: number) => {
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set('page', newPage.toString());
              newSearchParams.set('limit', newLimit.toString());
              router.push(
                `/hr/manage-configuration/designation?${newSearchParams.toString()}`,
              );
            },
          }}
          searchTerm={searchTerm}
          onSearch={handleSearchChange}
          searchLoading={isFetching}
          toolbarType="hrDesignation"
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />
      </div>
    </>
  );
};

export default DesignationTable;
