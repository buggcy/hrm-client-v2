'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { hrQuestionAnswerColumns } from '@/components/data-table/columns/hr-question-answer.columns';
import { QuestionAnswerDataTable } from '@/components/data-table/data-table-hr-question-answer';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import Header from '@/components/Header/Header';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import {
  useFeedbackRecordQuery,
  useQuestionAnswerQuery,
} from '@/hooks/hr/useFeedback.hook';
import { QuestionAnswerArrayType } from '@/libs/validations/hr-feedback';
import { searchQuestionAnswer } from '@/services/hr/hr-feedback.service';
import { FeedbackStoreType } from '@/stores/hr/hr-feedback';

import FeedbackStatistics from './FeedbackCards';

import { MessageErrorResponse } from '@/types';

interface TableProps {}
const QuestionAnswerTypeTable: FunctionComponent<TableProps> = () => {
  const searchParams = useSearchParams();
  const categoryFromParams =
    typeof window !== 'undefined' ? searchParams.get('category') : undefined;

  const { data: feedbackRecord, refetch: RecordRefetch } =
    useFeedbackRecordQuery(categoryFromParams ?? '');
  const { feedbackStore } = useStores() as { feedbackStore: FeedbackStoreType };
  const { setRefetchFeedbackList, refetchFeedbackList } = feedbackStore;
  const router = useRouter();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: getQuestionAnswer,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuestionAnswerQuery(categoryFromParams ?? '', {
    page,
    limit,
  });

  const {
    mutate,
    isPending,
    data: searchData,
  } = useMutation({
    mutationFn: searchQuestionAnswer,
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
      mutate({
        query: debouncedSearchTerm,
        page,
        limit,
        category: categoryFromParams ?? '',
      });
    } else {
      void (async () => {
        await refetch();
        await RecordRefetch();
      })();
    }
  }, [
    debouncedSearchTerm,
    refetch,
    mutate,
    page,
    limit,
    categoryFromParams,
    RecordRefetch,
  ]);
  useEffect(() => {}, [getQuestionAnswer]);

  useEffect(() => {
    if (refetchFeedbackList) {
      void (async () => {
        await refetch();
        await RecordRefetch();
      })();

      setRefetchFeedbackList(false);
    }
  }, [refetchFeedbackList, setRefetchFeedbackList, refetch, RecordRefetch]);

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

  const tableData: QuestionAnswerArrayType = debouncedSearchTerm
    ? searchData?.data || []
    : getQuestionAnswer?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchData?.pagination?.totalPages || 0
    : getQuestionAnswer?.pagination?.totalPages || 0;

  return (
    <>
      <Header subheading="Analyze Feedback, Track Progress, and Fuel Positive Change with Every Response!"></Header>
      <FeedbackStatistics
        totalUsers={feedbackRecord?.data?.totalUsers}
        averagePercentage={feedbackRecord?.data?.averagePercentage}
        goodPercentage={feedbackRecord?.data?.goodPercentage}
        excellentPercentage={feedbackRecord?.data?.excellentPercentage}
        belowAveragePercentage={feedbackRecord?.data?.belowAveragePercentage}
        veryGoodPercentage={feedbackRecord?.data?.veryGoodPercentage}
      />
      <div className="mt-3">
        {isLoading || isFetching ? (
          <DataTableLoading columnCount={4} rowCount={limit} />
        ) : (
          <QuestionAnswerDataTable
            searchLoading={isPending}
            data={tableData || []}
            columns={hrQuestionAnswerColumns}
            pagination={{
              pageCount: tablePageCount || 1,
              page: page,
              limit: limit,
              onPaginationChange: handlePaginationChange,
            }}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
            toolbarType={'getQuestionAnswer'}
          />
        )}
      </div>
    </>
  );
};

export default QuestionAnswerTypeTable;
