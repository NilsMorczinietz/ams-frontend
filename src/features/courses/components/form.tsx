import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@shared/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/components/ui/form';
import {
  useCourseControllerCreateCourse,
  useCourseControllerUpdateCourse,
  getCourseControllerGetAllCoursesQueryKey,
} from '@api/courses/courses';
import type {
  CreateCourseDto,
  GetCourseDto,
  UpdateCourseDto,
} from '@api/model';
import { useQueryClient } from '@tanstack/react-query';

const courseFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Bezeichnung ist erforderlich')
    .min(3, 'Bezeichnung muss mindestens 3 Zeichen lang sein')
    .max(100, 'Bezeichnung darf maximal 100 Zeichen lang sein'),
  abbreviation: z
    .string()
    .min(1, 'Kürzel ist erforderlich')
    .min(2, 'Kürzel muss mindestens 2 Zeichen lang sein')
    .max(10, 'Kürzel darf maximal 10 Zeichen lang sein'),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: GetCourseDto | null;
}

export function CourseForm({ open, onOpenChange, course }: CourseFormProps) {
  const queryClient = useQueryClient();

  const { mutate: createCourse, isPending: isCreating } =
    useCourseControllerCreateCourse({}, queryClient);
  const { mutate: updateCourse, isPending: isUpdating } =
    useCourseControllerUpdateCourse({}, queryClient);

  const isPending = isCreating || isUpdating;
  const isEditMode = !!course;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: '',
      abbreviation: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    } else if (course) {
      // Edit mode
      form.reset({
        name: course.name,
        abbreviation: course.abbreviation,
      });
    } else {
      // Create mode
      form.reset({
        name: '',
        abbreviation: '',
      });
    }
  }, [open, course, form]);

  const onSubmit = (data: CourseFormValues) => {
    if (isEditMode && course) {
      updateCourse(
        { id: course.id, data: data as UpdateCourseDto },
        {
          onSuccess: () => {
            void queryClient.refetchQueries({
              queryKey: getCourseControllerGetAllCoursesQueryKey(),
            });
            toast.success('Lehrgang erfolgreich aktualisiert');
            onOpenChange(false);
            form.reset();
          },
          onError: () => {
            toast.error('Fehler beim Aktualisieren des Lehrgangs');
          },
        }
      );
    } else {
      createCourse(
        { data: data as CreateCourseDto },
        {
          onSuccess: () => {
            void queryClient.refetchQueries({
              queryKey: getCourseControllerGetAllCoursesQueryKey(),
            });
            toast.success('Lehrgang erfolgreich erstellt');
            onOpenChange(false);
            form.reset();
          },
          onError: () => {
            toast.error('Fehler beim Erstellen des Lehrgangs');
          },
        }
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? 'Lehrgang bearbeiten' : 'Neuer Lehrgang'}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? 'Bearbeiten Sie die Lehrgangsdaten. Ändern Sie die gewünschten Felder.'
              : 'Erstellen Sie einen neuen Lehrgang. Füllen Sie alle Pflichtfelder aus.'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
            className="space-y-6 py-4"
          >
            <div className="space-y-4 px-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bezeichnung</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Truppmann Modul 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="abbreviation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kürzel</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. TM-M1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="px-4 flex flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEditMode
                    ? 'Wird gespeichert...'
                    : 'Wird erstellt...'
                  : isEditMode
                    ? 'Speichern'
                    : 'Erstellen'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
