// src/components/ui/table.tsx
import React from 'react';

export interface TableColumn<T> {
  header: React.ReactNode;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
}

/**
 * A simple, responsive table component.
 * Uses Tailwind CSS for styling and supports custom column renderers.
 */
export function Table<T>({ data, columns, className }: TableProps<T>) {
  return (
    <div className={"overflow-x-auto " + (className || "")}>
      <table className="min-w-full text-sm border-collapse">
        <thead className="bg-gray-800 text-gray-100">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={"px-4 py-2 text-left " + (col.className || "")}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {data.map((row, ri) => (
            <tr key={ri} className="hover:bg-gray-800 transition-colors">
              {columns.map((col, ci) => (
                <td key={ci} className={"px-4 py-2 " + (col.className || "")}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
