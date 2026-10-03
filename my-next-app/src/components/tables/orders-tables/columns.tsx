'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Order } from '@/constants/data'; // Corrected import
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'Id',
    header: 'Order ID'
  },
  {
    accessorKey: 'CreatedAt',
    header: 'Created At'
  },
  {
    accessorKey: 'Area',
    header: 'Area'
  },
  {
    accessorKey: 'Customer',
    header: 'Customer'
  },
  {
    accessorKey: 'CurrentCompany',
    header: 'Current Company'
  },
  {
    accessorKey: 'IsGenerated',
    header: 'Is Generated',
    cell: ({ getValue }) => getValue() ? 'Yes' : 'No'
  },
  {
    accessorKey: 'IsReturned',
    header: 'Is Returned',
    cell: ({ getValue }) => getValue() ? 'Yes' : 'No'
  },
  {
    accessorKey: 'IsSupplied',
    header: 'Is Supplied',
    cell: ({ getValue }) => getValue() ? 'Yes' : 'No'
  },
  {
    accessorKey: 'TotalItems',
    header: 'Total Items',
    cell: ({ getValue }) => JSON.stringify(getValue())
  },
  {
    accessorKey: 'PaymentTerms',
    header: 'Payment Terms'
  },
  {
    accessorKey: 'Remarks',
    header: 'Remarks'
  },
  {
    accessorKey: 'UserId',
    header: 'User ID'
  },
  {
    accessorKey: 'Email',
    header: 'Email'
  },
  {
    accessorKey: 'Phone',
    header: 'Phone'
  },
  {
    accessorKey: 'UserName',
    header: 'User Name'
  },
  {
    accessorKey: 'Address',
    header: 'Address'
  },
  {
    accessorKey: 'OrderTime',
    header: 'Order Time'
  },
  {
    accessorKey: 'GenerationRemarks',
    header: 'Generation Remarks'
  },
  {
    accessorKey: 'ReturnRemarks',
    header: 'Return Remarks'
  },
  {
    accessorKey: 'IsCompleted',
    header: 'Is Completed',
    cell: ({ getValue }) => getValue() ? 'Yes' : 'No'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
