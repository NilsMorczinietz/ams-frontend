import type { GetLocationDto } from '@/shared/api/model';
import { Button } from '@/shared/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<GetLocationDto>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Bezeichnung
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'address.street',
    header: 'Straße',
  },
  {
    accessorKey: 'address.houseNumber',
    header: 'Hausnummer',
  },
  {
    accessorKey: 'address.zipCode',
    header: 'PLZ',
  },
  {
    accessorKey: 'address.city',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Stadt
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'address.country',
    header: 'Land',
  },
];
