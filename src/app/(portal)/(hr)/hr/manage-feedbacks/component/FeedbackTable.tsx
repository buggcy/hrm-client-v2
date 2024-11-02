'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { hrFeedbackColumns } from '@/components/data-table/columns/hr-feedback.columns';
import { FeedbackDataTable } from '@/components/data-table/data-table-hr-feedback';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import {
  useFeedbackCategoryQuery,
  useFeedbackQuery,
} from '@/hooks/hr/useFeedback.hook';
import { FeedbackArrayType } from '@/libs/validations/hr-feedback';
import { searchFeedback } from '@/services/hr/hr-feedback.service';
import { FeedbackStoreType } from '@/stores/hr/hr-feedback';

import { AddEditFeedbackModal } from './Modal/AddEditFeedbackModal';
import QuestionAnswerTypeTable from './QuestionAnswerTable';

import { MessageErrorResponse } from '@/types';

const FeedbackTable: FunctionComponent = () => {
  const [category, setCategory] = useState<string>('All');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: feedbackCategory, refetch: CategoryRefetch } =
    useFeedbackCategoryQuery();
  const { feedbackStore } = useStores() as { feedbackStore: FeedbackStoreType };
  const { setRefetchFeedbackList, refetchFeedbackList } = feedbackStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [status, setStatus] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);
  const [modal, setModal] = useState(false);
  const [modelType, setModelType] = useState('add');

  const handleClose = () => {
    setModal(false);
  };

  const handleAdd = () => {
    setModelType('add');
    setModal(true);
  };

  const {
    data: getFeedbacks,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useFeedbackQuery({
    page,
    limit,
    status,
  });

  const {
    mutate,
    isPending,
    data: searchData,
  } = useMutation({
    mutationFn: searchFeedback,
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<MessageErrorResponse>;
      toast({
        title: 'Error',
        description:
          axiosError?.response?.data?.message ||
          'Error on fetching search data!',
        variant: 'error',
      });
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      mutate({ query: debouncedSearchTerm, page, limit });
    } else {
      void (async () => {
        await refetch();
        await CategoryRefetch();
      })();
    }
  }, [
    debouncedSearchTerm,
    refetch,
    mutate,
    page,
    limit,
    CategoryRefetch,
    status,
  ]);

  useEffect(() => {}, [getFeedbacks]);
  useEffect(() => {
    if (refetchFeedbackList) {
      void (async () => {
        await refetch();
        await CategoryRefetch();
      })();

      setRefetchFeedbackList(false);
    }
  }, [
    CategoryRefetch,
    refetch,
    refetchFeedbackList,
    setRefetchFeedbackList,
    status,
  ]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handlePaginationChange = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    params.set('limit', newLimit.toString());
    router.push(`?${params.toString()}`);
  };

  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  const tableData: FeedbackArrayType = debouncedSearchTerm
    ? searchData?.data || []
    : getFeedbacks?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchData?.pagination?.totalPages || 0
    : getFeedbacks?.pagination?.totalPages || 0;

  return (
    <>
      <Header subheading="Seamlessly Track, Analyze, and Enhance Feedback for Continuous Improvement!">
        <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row">
          <Select value={category} onValueChange={setCategory}>
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 md:max-w-[64%]">
              <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue>{category}</SelectValue>
              </SelectTrigger>
            </div>
            <SelectContent>
              <SelectGroup className="text-sm">
                <SelectItem value="All">All</SelectItem>

                {feedbackCategory?.feedbackCategories.map((type, index) => (
                  <SelectItem key={index} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Header>

      {category === 'All' ? (
        <>
          <div className="mb-4 mt-6 flex justify-end">
            <Button variant="default" size={'sm'} onClick={handleAdd}>
              Add Feedback
            </Button>
          </div>
          <div className="mt-6">
            {isLoading || isFetching ? (
              <DataTableLoading columnCount={6} rowCount={limit} />
            ) : (
              <FeedbackDataTable
                searchLoading={isPending}
                data={tableData || []}
                columns={hrFeedbackColumns}
                pagination={{
                  pageCount: tablePageCount || 1,
                  page: page,
                  limit: limit,
                  onPaginationChange: handlePaginationChange,
                }}
                onSearch={handleSearchChange}
                searchTerm={searchTerm}
                toolbarType={'getFeedbacks'}
                setFilterValue={setStatus}
                filterValue={status}
              />
            )}
          </div>
        </>
      ) : (
        <div className="mt-6">
          <QuestionAnswerTypeTable
            category={category}
            setRefetchFeedbackList={setRefetchFeedbackList}
            refetchFeedbackList={refetchFeedbackList}
          />
        </div>
      )}
      <AddEditFeedbackModal
        open={modal}
        onCloseChange={handleClose}
        type={modelType}
        setRefetchFeedbackList={setRefetchFeedbackList}
      />
    </>
  );
};

export default FeedbackTable;
