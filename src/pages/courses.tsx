import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  useCourseControllerGetAllCourses,
  useCourseControllerDeleteCourseById,
  getCourseControllerGetAllCoursesQueryKey,
} from '@api/courses/courses';
import {
  createColumns,
  DataTable,
  CourseForm,
} from '@/features/courses/components';
import { Button } from '@shared/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import type { GetCourseDto } from '@/shared/api/model';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function CoursesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<GetCourseDto | null>(
    null
  );
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } =
    useCourseControllerGetAllCourses();
  const { mutate: deleteCourse } = useCourseControllerDeleteCourseById(
    {},
    queryClient
  );

  const handleEdit = (course: GetCourseDto) => {
    setSelectedCourse(course);
    setIsFormOpen(true);
  };

  const handleDelete = (course: GetCourseDto) => {
    deleteCourse(
      { id: course.id },
      {
        onSuccess: () => {
          toast.success('Kurs erfolgreich gelöscht');
          void queryClient.invalidateQueries({
            queryKey: getCourseControllerGetAllCoursesQueryKey(),
          });
        },
        onError: (error) => {
          toast.error(
            `Fehler beim Löschen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
          );
        },
      }
    );
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setSelectedCourse(null);
    }
  };

  const columns = createColumns(handleEdit, handleDelete);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lehrgänge</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Lehrgänge und deren Informationen.
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
                  Noch keine Kurse vorhanden.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCourse(null);
                    setIsFormOpen(true);
                  }}
                >
                  <IconPlus /> Ersten Lehrgang anlegen
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
                    setSelectedCourse(null);
                    setIsFormOpen(true);
                  }}
                >
                  <IconPlus /> Lehrgang anlegen
                </Button>
              </div>
              <DataTable columns={columns} data={data.data} />
            </div>
          )}
        </>
      )}

      <CourseForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        course={selectedCourse}
      />
    </div>
  );
}
