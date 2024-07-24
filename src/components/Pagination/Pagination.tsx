import { useMemo } from 'react';

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

function Pagination({
  total,
  currentPage,
  perPage,
  onPageChange,
}: {
  total: number;
  currentPage: number;
  perPage: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const pages = useMemo(() => {
    // TODO: rewrite this logic
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage === 1) {
      return [1, 2, 3];
    } else if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [currentPage - 1, currentPage, currentPage + 1];
    }
  }, [currentPage, totalPages]);

  if (total <= perPage) {
    return null;
  }

  return (
    <PaginationComponent>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </PaginationItem>
        {pages.map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={currentPage === page}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  );
}

export { Pagination };
