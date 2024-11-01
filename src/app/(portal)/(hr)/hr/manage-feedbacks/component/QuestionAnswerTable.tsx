'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { hrQuestionAnswerColumns } from '@/components/data-table/columns/hr-question-answer.columns';
import { QuestionAnswerDataTable } from '@/components/data-table/data-table-hr-question-answer';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';

import { useQuestionAnswerQuery } from '@/hooks/hr/useFeedback.hook';
import { QuestionAnswerArrayType } from '@/libs/validations/hr-feedback';
import { searchQuestionAnswer } from '@/services/hr/hr-feedback.service';

import { MessageErrorResponse } from '@/types';

interface TableProps {
  category: string;
  refetchFeedbackList: boolean;
  setRefetchFeedbackList: (refetch: boolean) => void;
}
const QuestionAnswerTypeTable: FunctionComponent<TableProps> = ({
  category,
  refetchFeedbackList,
  setRefetchFeedbackList,
}) => {
  const searchParams = useSearchParams();
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
  } = useQuestionAnswerQuery(category, {
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
        category,
      });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, refetch, mutate, page, limit, category]);
  useEffect(() => {}, [getQuestionAnswer]);

  useEffect(() => {
    if (refetchFeedbackList) {
      void (async () => {
        await refetch();
      })();

      setRefetchFeedbackList(false);
    }
  }, [refetchFeedbackList, setRefetchFeedbackList, refetch]);

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
    </>
  );
};

export default QuestionAnswerTypeTable;
