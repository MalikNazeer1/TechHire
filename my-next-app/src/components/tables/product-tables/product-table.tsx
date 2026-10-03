// 'use client';

// import {
//   ColumnDef,
//   PaginationState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   useReactTable
// } from '@tanstack/react-table';
// import React from 'react';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table';
// import {
//   DoubleArrowLeftIcon,
//   DoubleArrowRightIcon
// } from '@radix-ui/react-icons';
// import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   searchKey: string;
//   totalProducts: number;  // Add this line

//   pageNo: number;

//   pageSizeOptions?: number[];
//   pageCount: number;
//   searchParams?: {
//     [key: string]: string | string[] | undefined;
//   };
// }

// interface Product {
//   Id: number;
//   CompanyCode: string;
//   Company: string;
//   DivCode: string;
//   DivName: string;
//   ItemCode: string;
//   Name: string;
//   Packing: string;
//   Tp: string;
//   Mrp: number;
//   Generic: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export function ProductTable({
//   columns,
//   data,
//   pageNo,
//   totalProducts,  // Ensure this is used correctly
//   searchKey,

//   pageCount,
//   pageSizeOptions = [10, 20, 30, 40, 50]
// }: DataTableProps<Product, any>) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   // Search params
//   const page = searchParams?.get('page') ?? '1';
//   const pageAsNumber = Number(page);
//   const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
//   const per_page = searchParams?.get('limit') ?? '10';
//   const perPageAsNumber = Number(per_page);
//   const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

//   // Create query string
//   const createQueryString = React.useCallback(
//     (params: Record<string, string | number | null>) => {
//       const newSearchParams = new URLSearchParams(searchParams?.toString());

//       for (const [key, value] of Object.entries(params)) {
//         if (value === null) {
//           newSearchParams.delete(key);
//         } else {
//           newSearchParams.set(key, String(value));
//         }
//       }

//       return newSearchParams.toString();
//     },
//     [searchParams]
//   );

//   // Handle server-side pagination
//   const [pagination, setPagination] = React.useState<PaginationState>({
//     pageIndex: fallbackPage - 1,
//     pageSize: fallbackPerPage
//   });

//   React.useEffect(() => {
//     router.push(
//       `${pathname}?${createQueryString({
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize
//       })}`,
//       {
//         scroll: false
//       }
//     );

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pagination.pageIndex, pagination.pageSize]);

//   const table = useReactTable({
//     data,
//     columns,
//     pageCount: pageCount ?? -1,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       pagination
//     },
//     onPaginationChange: setPagination,
//     getPaginationRowModel: getPaginationRowModel(),
//     manualPagination: true,
//     manualFiltering: true
//   });

//   const searchValue = table.getColumn(searchKey)?.getFilterValue() as string;

//   React.useEffect(() => {
//     if (searchValue?.length > 0) {
//       router.push(
//         `${pathname}?${createQueryString({
//           page: null,
//           limit: null,
//           search: searchValue
//         })}`,
//         {
//           scroll: false
//         }
//       );
//     }
//     if (searchValue?.length === 0 || searchValue === undefined) {
//       router.push(
//         `${pathname}?${createQueryString({
//           page: null,
//           limit: null,
//           search: null
//         })}`,
//         {
//           scroll: false
//         }
//       );
//     }

//     setPagination((prev) => ({ ...prev, pageIndex: 0 }));

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchValue]);

//   return (
//     <>
//       <Input
//         placeholder={`Search ${searchKey}...`}
//         value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
//         onChange={(event) =>
//           table.getColumn(searchKey)?.setFilterValue(event.target.value)
//         }
//         className="w-full md:max-w-sm"
//       />
//       <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
//         <Table className="relative">
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.length > 0 ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length}>No data available</TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//         <ScrollBar />
//       </ScrollArea>
//       <div className="flex items-center justify-between p-4">
//         <div className="flex items-center space-x-2">
//           <Button
//             variant="outline"
//             disabled={!table.getCanPreviousPage()}
//             onClick={() => table.previousPage()}
//           >
//             <ChevronLeftIcon className="h-4 w-4" />
//             <span className="sr-only">Previous page</span>
//           </Button>
//           <Button
//             variant="outline"
//             disabled={!table.getCanNextPage()}
//             onClick={() => table.nextPage()}
//           >
//             <ChevronRightIcon className="h-4 w-4" />
//             <span className="sr-only">Next page</span>
//           </Button>
//           <Button
//             variant="outline"
//             disabled={!table.getCanPreviousPage()}
//             onClick={() => table.setPageIndex(0)}
//           >
//             <DoubleArrowLeftIcon className="h-4 w-4" />
//             <span className="sr-only">First page</span>
//           </Button>
//           <Button
//             variant="outline"
//             disabled={!table.getCanNextPage()}
//             onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//           >
//             <DoubleArrowRightIcon className="h-4 w-4" />
//             <span className="sr-only">Last page</span>
//           </Button>
//         </div>
//         <div>
//           Page {pagination.pageIndex + 1} of {table.getPageCount()}
//         </div>
//         <Select
//           defaultValue={pageSizeOptions[0].toString()}
//           onValueChange={(value) => setPagination({ ...pagination, pageSize: Number(value) })}
//         >
//           <SelectTrigger>
//             <SelectValue>{pagination.pageSize.toString()}</SelectValue>
//           </SelectTrigger>
//           <SelectContent>
//             {pageSizeOptions.map((size) => (
//               <SelectItem key={size} value={size.toString()}>
//                 {size}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//     </>
//   );
// }
