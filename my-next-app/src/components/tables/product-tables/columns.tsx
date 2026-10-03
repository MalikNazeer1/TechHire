// components/tables/product-tables/columns.ts

import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/constants/data'; // Ensure this aligns with the product schema
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: 'Name',
    header: 'Name'
  },
  {
    accessorKey: 'Company',
    header: 'Company'
  },
  {
    accessorKey: 'DivName',
    header: 'Division'
  },
  {
    accessorKey: 'ItemCode',
    header: 'Item Code'
  },
  {
    accessorKey: 'Packing',
    header: 'Packing'
  },
  {
    accessorKey: 'Tp',
    header: 'TP'
  },
  {
    accessorKey: 'Mrp',
    header: 'MRP'
  },
  {
    accessorKey: 'Generic',
    header: 'Generic'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
