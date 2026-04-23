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
import type { GetRankDto } from '@api/model';
import { useQueryClient } from '@tanstack/react-query';
import {
  getRankControllerGetAllRanksQueryKey,
  useRankControllerCreateRank,
  useRankControllerUpdateRank,
} from '@/shared/api/ranks/ranks';
import { getApiErrorMessage } from '@shared/api/api-error';
import { Checkbox } from '@shared/components/ui/checkbox';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldContent,
} from '@shared/components/ui/field';

const rankFormSchema = z.object({
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
  isDefault: z.boolean().optional(),
});

type RankFormValues = z.infer<typeof rankFormSchema>;

interface RankFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rank?: GetRankDto | null;
}

export function RankForm({ open, onOpenChange, rank }: RankFormProps) {
  const queryClient = useQueryClient();

  const { mutate: createRank, isPending: isCreating } =
    useRankControllerCreateRank({}, queryClient);
  const { mutate: updateRank, isPending: isUpdating } =
    useRankControllerUpdateRank({}, queryClient);

  const isPending = isCreating || isUpdating;
  const isEditMode = !!rank;

  const form = useForm<RankFormValues>({
    resolver: zodResolver(rankFormSchema),
    defaultValues: {
      name: '',
      abbreviation: '',
      isDefault: false,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    } else if (rank) {
      // Edit mode
      form.reset({
        name: rank.name,
        abbreviation: rank.abbreviation,
        isDefault: rank.isDefault,
      });
    } else {
      // Create mode
      form.reset({
        name: '',
        abbreviation: '',
        isDefault: false,
      });
    }
  }, [open, rank, form]);

  const onSubmit = (data: RankFormValues) => {
    if (isEditMode && rank) {
      updateRank(
        { id: rank.id, data },
        {
          onSuccess: () => {
            void queryClient.refetchQueries({
              queryKey: getRankControllerGetAllRanksQueryKey(),
            });
            toast.success('Dienstgrad erfolgreich aktualisiert');
            onOpenChange(false);
            form.reset();
          },
          onError: (error) => {
            toast.error(
              getApiErrorMessage(
                error,
                'Fehler beim Aktualisieren des Dienstgrades'
              )
            );
          },
        }
      );
    } else {
      createRank(
        { data },
        {
          onSuccess: () => {
            void queryClient.refetchQueries({
              queryKey: getRankControllerGetAllRanksQueryKey(),
            });
            toast.success('Dienstgrad erfolgreich erstellt');
            onOpenChange(false);
            form.reset();
          },
          onError: (error) => {
            toast.error(
              getApiErrorMessage(
                error,
                'Fehler beim Erstellen des Dienstgrades'
              )
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
            {isEditMode ? 'Dienstgrad bearbeiten' : 'Neuer Dienstgrad'}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? 'Bearbeiten Sie die Dienstgrad-Daten. Ändern Sie die gewünschten Felder.'
              : 'Erstellen Sie einen neuen Dienstgrad. Füllen Sie alle Pflichtfelder aus.'}
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
                      <Input placeholder="z.B. Brandoberinspektor" {...field} />
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
                      <Input placeholder="z.B. BOI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FieldGroup className="m-flex">
                        <Field orientation="horizontal">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <FieldContent>
                            <FieldLabel htmlFor="terms-checkbox-desc">
                              Default Dienstgrad
                            </FieldLabel>
                            <FieldDescription>
                              Es kann nur einen Default Dienstgrad geben. Wenn
                              Sie diesen Dienstgrad als Default markieren,
                              werden neue Nutzer automatisch diesem Dienstgrad
                              zugeordnet.
                            </FieldDescription>
                          </FieldContent>
                        </Field>
                      </FieldGroup>
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
