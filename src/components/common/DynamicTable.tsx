import type { FC, ReactNode } from "react";

interface Props<T> {
  data: T[];
  columns: {
    title: string;
    dataIndex: keyof T | null;
    render?: (record: T) => ReactNode;
  }[];
}

export const DynamicTable: FC<Props<any>> = <T,>({
  data,
  columns,
}: Props<T>) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.dataIndex as string}
              className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {data.map((item) => (
          <tr key={JSON.stringify(item)}>
            {columns.map((column) => (
              <td
                key={column.dataIndex as string}
                className="px-6 py-4"
              >
                <div className="text-sm text-gray-900 flex gap-1">
                  {column.render
                    ? column.render(item)
                    : (item[column.dataIndex as keyof T] as ReactNode)}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
