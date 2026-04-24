import type { GetSurveyDto } from '@/shared/api/model';
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
import { ArrowUpDown, Pencil, Trash } from 'lucide-react';

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('de-DE').format(date);
};

const parseDateMs = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  return date.getTime();
};

export const createColumns = (
  onEdit: (survey: GetSurveyDto) => void,
  onDelete: (survey: GetSurveyDto) => void
): ColumnDef<GetSurveyDto>[] => [
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
    accessorKey: 'description',
    header: 'Beschreibung',
  },
  {
    accessorKey: 'type',
    header: 'Typ',
  },
  {
    accessorKey: 'startDate',
    sortingFn: (rowA, rowB, columnId) => {
      const a = parseDateMs(rowA.getValue(columnId));
      const b = parseDateMs(rowB.getValue(columnId));
      return a - b;
    },
    cell: ({ row }) => formatDate(row.original.startDate),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Startdatum
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'endDate',
    sortingFn: (rowA, rowB, columnId) => {
      const a = parseDateMs(rowA.getValue(columnId));
      const b = parseDateMs(rowB.getValue(columnId));
      return a - b;
    },
    cell: ({ row }) => formatDate(row.original.endDate),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Enddatum
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const survey = row.original;

      return (
        <div className="flex gap-1 items-center">
          <Button
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => onEdit(survey)}
          >
            <span className="sr-only">Umfrage bearbeiten</span>
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="h-7 w-7 p-0">
                <span className="sr-only">Umfrage löschen</span>
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Möchten Sie diesen Umfrage wirklich löschen?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Diese Aktion kann nicht rückgängig gemacht werden. Die Umfrage
                  "{survey.name}" wird permanent aus der Datenbank gelöscht.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(survey)}>
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
