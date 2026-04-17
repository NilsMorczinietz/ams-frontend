import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  createColumns,
  DataTable,
  RankForm,
} from '@/features/ranks/components';
import { Button } from '@shared/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import type { GetRankDto } from '@/shared/api/model';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage } from '@shared/api/api-error';
import {
  useRankControllerGetAllRanks,
  useRankControllerDeleteRankById,
  getRankControllerGetAllRanksQueryKey,
} from '@/shared/api/ranks/ranks';

export default function RanksPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRank, setSelectedRank] = useState<GetRankDto | null>(null);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useRankControllerGetAllRanks();
  const { mutate: deleteRank } = useRankControllerDeleteRankById(
    {},
    queryClient
  );

  const handleEdit = (rank: GetRankDto) => {
    setSelectedRank(rank);
    setIsFormOpen(true);
  };

  const handleDelete = (rank: GetRankDto) => {
    deleteRank(
      { id: rank.id },
      {
        onSuccess: () => {
          toast.success('Dienstgrad erfolgreich gelöscht');
          void queryClient.invalidateQueries({
            queryKey: getRankControllerGetAllRanksQueryKey(),
          });
        },
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Fehler beim Loeschen des Dienstgrades')
          );
        },
      }
    );
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setSelectedRank(null);
    }
  };

  const columns = createColumns(handleEdit, handleDelete);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dienstgrade</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Dienstgrade und deren Informationen.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">Lädt...</div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <h3 className="font-semibold text-destructive">
                Fehler beim Laden
              </h3>
              <p className="text-sm text-destructive/90">
                {error instanceof Error
                  ? error.message
                  : 'Die Dienstgrade konnten nicht geladen werden.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isError && data?.data && (
        <>
          {data.data.length === 0 ? (
            <div className="rounded-lg border bg-card p-6">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Noch keine Dienstgrade vorhanden.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRank(null);
                    setIsFormOpen(true);
                  }}
                >
                  <IconPlus /> Ersten Dienstgrad anlegen
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-4 flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRank(null);
                    setIsFormOpen(true);
                  }}
                >
                  <IconPlus /> Dienstgrad anlegen
                </Button>
              </div>
              <DataTable columns={columns} data={data.data} />
            </div>
          )}
        </>
      )}

      <RankForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        rank={selectedRank}
      />
    </div>
  );
}
