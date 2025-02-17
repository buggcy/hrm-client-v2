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
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import {
  useFeedbackQuery,
  useFeedbackStatisticsQuery,
} from '@/hooks/hr/useFeedback.hook';
import { FeedbackArrayType } from '@/libs/validations/hr-feedback';
import { searchFeedback } from '@/services/hr/hr-feedback.service';
import { FeedbackStoreType } from '@/stores/hr/hr-feedback';

import { FeedbackDistributionChart } from './Chart/FeedbackDistributionChart';
import { TopFeedbackAnswer } from './Chart/TopAnswerChart';
import { AddEditFeedbackModal } from './Modal/AddEditFeedbackModal';

import { MessageErrorResponse } from '@/types';

const FeedbackTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { feedbackStore } = useStores() as { feedbackStore: FeedbackStoreType };
  const { setRefetchFeedbackList, refetchFeedbackList } = feedbackStore;
  const { data: feedbackStatistics, refetch: ChartRefetch } =
    useFeedbackStatisticsQuery();
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
          axiosError?.response?.data?.error ||
          'An unexpected error occurred. Please try again later or contact support if the issue persists.',
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
        await ChartRefetch();
      })();
    }
  }, [debouncedSearchTerm, refetch, mutate, page, limit, status, ChartRefetch]);

  useEffect(() => {}, [getFeedbacks]);
  useEffect(() => {}, [feedbackStatistics]);
  useEffect(() => {
    if (refetchFeedbackList) {
      void (async () => {
        await refetch();
        await ChartRefetch();
      })();
      setRefetchFeedbackList(false);
    }
  }, [
    ChartRefetch,
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
        <Button variant="default" size={'sm'} onClick={handleAdd}>
          Add Feedback
        </Button>
      </Header>

      <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TopFeedbackAnswer chartData={feedbackStatistics?.topAnswers} />
        <FeedbackDistributionChart
          totalEnabled={feedbackStatistics?.distributionChart?.totalEnabled}
          totalDisabled={feedbackStatistics?.distributionChart?.totalDisabled}
        />
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
