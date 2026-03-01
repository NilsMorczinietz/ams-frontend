import type { GetRankDto } from '@/shared/api/model';
import { Button } from '@/shared/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@shared/components/ui/alert-dialog';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash } from 'lucide-react';

export const createColumns = (
  onEdit: (rank: GetRankDto) => void,
  onDelete: (rank: GetRankDto) => void
): ColumnDef<GetRankDto>[] => [
  {
    accessorKey: 'name',
    header: 'Bezeichnung',
  },
  {
    accessorKey: 'abbreviation',
    header: 'Kürzel',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const rank = row.original;

      return (
        <div className="flex gap-1 items-center">
          <Button
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => onEdit(rank)}
          >
            <span className="sr-only">Dienstgrad bearbeiten</span>
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="h-7 w-7 p-0">
                <span className="sr-only">Dienstgrad löschen</span>
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Möchten Sie diesen Dienstgrad wirklich löschen?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Diese Aktion kann nicht rückgängig gemacht werden. Der
                  Dienstgrad "{rank.name}" wird permanent aus der Datenbank
                  gelöscht.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(rank)}>
                  Löschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
