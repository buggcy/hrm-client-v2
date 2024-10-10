import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { BadgePlus } from 'lucide-react';

import { policyColumn } from '@/components/data-table/columns/policy-column';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';

import { useFetchAllPolicies } from '@/hooks/usepolicyQuery';
import { PolicyType } from '@/libs/validations/hr-policy';

interface PolicyTableProps {
  category: string;
  handleDialogOpen: () => void;
}

const PolicyTable: React.FC<PolicyTableProps> = ({
  category,
  handleDialogOpen,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [categories, setCategories] = useState<string[]>([]);

  const {
    data: policyList,
    isLoading: isPoliciesLoading,
    isFetching,
    error,
    refetch,
  } = useFetchAllPolicies({
    page,
    limit,
    category: categories.length > 0 ? categories[0] : category,
  });

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        await refetch();
      } catch (error) {
        console.error('Error refetching policies:', error);
      }
    };

    void fetchPolicies();
  }, [category, categories, refetch]);

  const filteredData = useMemo(() => {
    if (!policyList?.data) return [];
    return policyList.data.filter((policy: PolicyType) =>
      Object.values(policy).some(
        value =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [policyList?.data, searchTerm]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', '1');
    newSearchParams.set('search', term);
    router.push(`/hr/manage-policies?${newSearchParams.toString()}`);
  };

  if (isPoliciesLoading)
    return <DataTableLoading columnCount={5} rowCount={limit} />;

  if (error) {
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  const tablePageCount: number = Math.ceil(
    (policyList?.pagination?.totalCount || 0) / limit,
  );

  return (
    <>
      <div className="flex flex-col gap-12">
        <Header subheading="Guiding our team with clarity and respect.">
          <Button variant="default" onClick={handleDialogOpen}>
            <BadgePlus className="mr-2 size-4" /> Add Policy
          </Button>
        </Header>
      </div>
      <div>
        <DataTable
          data={filteredData}
          columns={policyColumn}
          pagination={{
            pageCount: tablePageCount,
            page,
            limit,
            onPaginationChange: (newPage: number, newLimit: number) => {
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set('page', newPage.toString());
              newSearchParams.set('limit', newLimit.toString());
              router.push(`/hr/manage-policies?${newSearchParams.toString()}`);
            },
          }}
          searchTerm={searchTerm}
          onSearch={handleSearchChange}
          searchLoading={isFetching}
          toolbarType="hrPolicy"
          filterValue={categories}
          setFilterValue={setCategories}
        />
      </div>
    </>
  );
};

export default PolicyTable;
