import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useLocationControllerGetAllLocations } from '@api/locations/locations';
import {
  columns,
  DataTable,
  LocationForm,
} from '@/features/locations/components';
import { Button } from '@shared/components/ui/button';
import { IconPlus } from '@tabler/icons-react';

export default function LocationsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isLoading, isError, error } =
    useLocationControllerGetAllLocations();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Standorte</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Standorte und deren Informationen.
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
                  : 'Die Standorte konnten nicht geladen werden.'}
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
                  Noch keine Standorte vorhanden.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFormOpen(true)}
                >
                  <IconPlus /> Ersten Standort anlegen
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-4 flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFormOpen(true)}
                >
                  <IconPlus /> Standort anlegen
                </Button>
              </div>
              <DataTable columns={columns} data={data.data} />
            </div>
          )}
        </>
      )}

      <LocationForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
