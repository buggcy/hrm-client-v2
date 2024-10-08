import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { BadgePlus, ChevronDown, ChevronUp } from 'lucide-react';

import { policyColumn } from '@/components/data-table/columns/policy-column';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useFetchAllPolicies } from '@/hooks/usepolicyQuery';
import { PolicyType } from '@/libs/validations/hr-policy';

interface PolicyTableProps {
  category: string;
  handleDialogOpen: () => void;
  title: string;
  setTitle: (title: string) => void;
  data: { message: string; categories: string[] } | undefined;
  isLoading: boolean;
  error: Error | null;
  handleCategoryChange: (selectedCategory: string, newTitle: string) => void;
}

const PolicyTable: React.FC<PolicyTableProps> = ({
  category,
  handleDialogOpen,
  title,
  data,
  isLoading,
  handleCategoryChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);

  const {
    data: policyList,
    isLoading: isPoliciesLoading,
    isFetching,
    error,
    refetch,
  } = useFetchAllPolicies({ page, limit, category: category });

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        await refetch();
      } catch (error) {
        console.error('Error refetching policies:', error);
      }
    };

    void fetchPolicies();
  }, [category, refetch]);

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
      <div className="mb-4 flex items-center justify-end gap-2">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" onClick={toggleDropdown}>
              {title}
              {dropdownOpen ? (
                <ChevronUp className="ml-2 size-4" />
              ) : (
                <ChevronDown className="ml-2 size-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              onClick={() => handleCategoryChange('', 'All Policy Category')}
            >
              All Categories
            </DropdownMenuItem>
            {isLoading ? (
              <DropdownMenuItem disabled>
                Loading categories...
              </DropdownMenuItem>
            ) : error ? (
              <DropdownMenuItem disabled>
                Error loading categories
              </DropdownMenuItem>
            ) : data ? (
              data.categories.map((cat: string) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => handleCategoryChange(cat, cat)}
                >
                  {cat}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                No categories available
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleDialogOpen}>
          <BadgePlus className="mr-2 size-4" /> Add Policy
        </Button>
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
          toolbar="hrPolicy"
        />
      </div>
    </>
  );
};

export default PolicyTable;
