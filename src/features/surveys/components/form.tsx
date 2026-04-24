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
import { getApiErrorMessage } from '@shared/api/api-error';
import type { GetSurveyDto } from '@api/model';
import { useQueryClient } from '@tanstack/react-query';
import {
  getSurveyControllerGetAllSurveysQueryKey,
  useSurveyControllerCreateSurvey,
  useSurveyControllerUpdateSurvey,
} from '@/shared/api/surveys/surveys';

const surveyFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Bezeichnung ist erforderlich')
    .min(3, 'Bezeichnung muss mindestens 3 Zeichen lang sein')
    .max(100, 'Bezeichnung darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .max(200, 'Beschreibung darf maximal 200 Zeichen lang sein'),
  type: z.literal('COURSE_INVENTORY'),
  startDate: z.string().min(1, 'Startdatum ist erforderlich'),
  endDate: z.string().min(1, 'Enddatum ist erforderlich'),
});

type SurveyFormValues = z.infer<typeof surveyFormSchema>;

interface SurveyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  survey?: GetSurveyDto | null;
}

export function SurveyForm({ open, onOpenChange, survey }: SurveyFormProps) {
  const queryClient = useQueryClient();

  const { mutate: createSurvey, isPending: isCreating } =
    useSurveyControllerCreateSurvey({}, queryClient);
  const { mutate: updateSurvey, isPending: isUpdating } =
    useSurveyControllerUpdateSurvey({}, queryClient);

  const isPending = isCreating || isUpdating;
  const isEditMode = !!survey;

  const toDateInputValue = (value?: string) => {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString().slice(0, 10);
  };

  const toIsoString = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toISOString();
  };

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveyFormSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'COURSE_INVENTORY',
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    } else if (survey) {
      // Edit mode
      form.reset({
        name: survey.name,
        description: survey.description ?? '',
        type: 'COURSE_INVENTORY',
        startDate: toDateInputValue(survey.startDate),
        endDate: toDateInputValue(survey.endDate),
      });
    } else {
      // Create mode
      form.reset({
        name: '',
        description: '',
        type: 'COURSE_INVENTORY',
        startDate: '',
        endDate: '',
      });
    }
  }, [open, survey, form]);

  const onSubmit = (data: SurveyFormValues) => {
    const payload = {
      ...data,
      startDate: toIsoString(data.startDate),
      endDate: toIsoString(data.endDate),
    };

    if (isEditMode && survey) {
      updateSurvey(
        { id: survey.id, data: payload },
        {
          onSuccess: () => {
            void queryClient.refetchQueries({
              queryKey: getSurveyControllerGetAllSurveysQueryKey(),
            });
            toast.success('Umfrage erfolgreich aktualisiert');
            onOpenChange(false);
            form.reset();
          },
          onError: (error) => {
            toast.error(
              getApiErrorMessage(error, 'Fehler beim Aktualisieren der Umfrage')
            );
          },
        }
      );
    } else {
      createSurvey(
        { data: payload },
        {
          onSuccess: () => {
            void queryClient.refetchQueries({
              queryKey: getSurveyControllerGetAllSurveysQueryKey(),
            });
            toast.success('Umfrage erfolgreich erstellt');
            onOpenChange(false);
            form.reset();
          },
          onError: (error) => {
            toast.error(
              getApiErrorMessage(error, 'Fehler beim Erstellen der Umfrage')
            );
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
            {isEditMode ? 'Umfrage bearbeiten' : 'Neue Umfrage'}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? 'Bearbeiten Sie die Umfrage. Ändern Sie die gewünschten Felder.'
              : 'Erstellen Sie eine neue Umfrage. Füllen Sie alle Pflichtfelder aus.'}
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
                      <Input placeholder="z.B. Abfrage 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beschreibung</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Optional: kurze Beschreibung"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="COURSE_INVENTORY"
                        readOnly
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Startdatum</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enddatum</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
