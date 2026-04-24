import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage } from '@shared/api/api-error';
import {
  getSurveyControllerGetAllSurveysQueryKey,
  useSurveyControllerDeleteSurveyById,
  useSurveyControllerGetAllSurveys,
} from '@/shared/api/surveys/surveys';
import type { GetSurveyDto } from '@/shared/api/model/getSurveyDto';
import {
  createColumns,
  DataTable,
  SurveyForm,
} from '@/features/surveys/components';

export default function SurveysPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<GetSurveyDto | null>(
    null
  );
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } =
    useSurveyControllerGetAllSurveys();
  const { mutate: deleteSurvey } = useSurveyControllerDeleteSurveyById(
    {},
    queryClient
  );

  const handleEdit = (survey: GetSurveyDto) => {
    setSelectedSurvey(survey);
    setIsFormOpen(true);
  };

  const handleDelete = (survey: GetSurveyDto) => {
    deleteSurvey(
      { id: survey.id },
      {
        onSuccess: () => {
          toast.success('Umfrage erfolgreich gelöscht');
          void queryClient.invalidateQueries({
            queryKey: getSurveyControllerGetAllSurveysQueryKey(),
          });
        },
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Fehler beim Löschen der Umfrage')
          );
        },
      }
    );
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setSelectedSurvey(null);
    }
  };

  const columns = createColumns(handleEdit, handleDelete);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Umfragen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Umfragen und deren Informationen.
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
                  : 'Die Umfragen konnten nicht geladen werden.'}
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
                  Noch keine Umfragen vorhanden.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedSurvey(null);
                    setIsFormOpen(true);
                  }}
                >
                  <IconPlus /> Erste Umfrage anlegen
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
                    setSelectedSurvey(null);
                    setIsFormOpen(true);
                  }}
                >
                  <IconPlus /> Umfrage anlegen
                </Button>
              </div>
              <DataTable columns={columns} data={data.data} />
            </div>
          )}
        </>
      )}

      <SurveyForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        survey={selectedSurvey}
      />
    </div>
  );
}
