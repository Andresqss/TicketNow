'use client';

import { useCallback } from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  const handlePageChange = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  }, [onPageChange, totalPages]);

  return (
    <div className="flex justify-center mt-6">
      <div className="flex space-x-2">
        {/* Inicio */}
        <button
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50"
        >
          Inicio
        </button>

        {/* Anterior */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50"
        >
          &laquo;
        </button>

        {/* Números */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={`px-2 py-1 rounded ${
              currentPage === index
                ? "bg-blue-500 text-white dark:bg-white dark:text-gray-900"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}

        {/* Siguiente */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50"
        >
          &raquo;
        </button>

        {/* Fin */}
        <button
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded disabled:opacity-50"
        >
          Fin
        </button>
      </div>
    </div>
  );
}
