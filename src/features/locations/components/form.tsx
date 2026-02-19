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
  useLocationControllerCreateLocation,
  useLocationControllerUpdateLocation,
  getLocationControllerGetAllLocationsQueryKey,
} from '@api/locations/locations';
import type {
  CreateLocationDto,
  GetLocationDto,
  UpdateLocationDto,
} from '@api/model';
import { useQueryClient } from '@tanstack/react-query';

const locationFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Bezeichnung ist erforderlich')
    .min(3, 'Bezeichnung muss mindestens 3 Zeichen lang sein')
    .max(100, 'Bezeichnung darf maximal 100 Zeichen lang sein'),
  address: z.object({
    street: z
      .string()
      .min(1, 'Straße ist erforderlich')
      .max(100, 'Straße darf maximal 100 Zeichen lang sein'),
    houseNumber: z
      .number({ error: 'Bitte geben Sie eine gültige Nummer ein' })
      .int('Hausnummer muss eine ganze Zahl sein')
      .min(1, 'Hausnummer muss mindestens 1 sein')
      .max(9999, 'Hausnummer darf maximal 9999 sein'),
    zipCode: z
      .number({ error: 'Bitte geben Sie eine gültige PLZ ein' })
      .int('PLZ muss eine ganze Zahl sein')
      .min(10000, 'PLZ muss 5-stellig sein')
      .max(99999, 'PLZ muss 5-stellig sein'),
    city: z
      .string()
      .min(1, 'Stadt ist erforderlich')
      .max(100, 'Stadt darf maximal 100 Zeichen lang sein'),
    country: z
      .string()
      .min(1, 'Land ist erforderlich')
      .max(100, 'Land darf maximal 100 Zeichen lang sein'),
  }),
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: GetLocationDto | null;
}

export function LocationForm({
  open,
  onOpenChange,
  location,
}: LocationFormProps) {
  const queryClient = useQueryClient();

  const { mutate: createLocation, isPending: isCreating } =
    useLocationControllerCreateLocation({}, queryClient);
  const { mutate: updateLocation, isPending: isUpdating } =
    useLocationControllerUpdateLocation({}, queryClient);

  const isPending = isCreating || isUpdating;
  const isEditMode = !!location;

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: '',
      address: {
        street: '',
        houseNumber: 0,
        zipCode: 0,
        city: '',
        country: 'Deutschland',
      },
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    } else if (location) {
      // Edit mode
      form.reset({
        name: location.name,
        address: {
          street: location.address.street,
          houseNumber: location.address.houseNumber,
          zipCode: location.address.zipCode,
          city: location.address.city,
          country: location.address.country,
        },
      });
    } else {
      // Create mode
      form.reset({
        name: '',
        address: {
          street: '',
          houseNumber: 0,
          zipCode: 0,
          city: '',
          country: 'Deutschland',
        },
      });
    }
  }, [open, location, form]);

  const onSubmit = (data: LocationFormValues) => {
    if (isEditMode && location) {
      updateLocation(
        { id: location.id, data: data as UpdateLocationDto },
        {
          onSuccess: () => {
            void queryClient.refetchQueries({
              queryKey: getLocationControllerGetAllLocationsQueryKey(),
            });
            toast.success('Standort erfolgreich aktualisiert');
            onOpenChange(false);
            form.reset();
          },
          onError: () => {
            toast.error('Fehler beim Aktualisieren des Standorts');
          },
        }
      );
    } else {
      createLocation(
        { data: data as CreateLocationDto },
        {
          onSuccess: () => {
            void queryClient.refetchQueries({
              queryKey: getLocationControllerGetAllLocationsQueryKey(),
            });
            toast.success('Standort erfolgreich erstellt');
            onOpenChange(false);
            form.reset();
          },
          onError: () => {
            toast.error('Fehler beim Erstellen des Standorts');
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
            {isEditMode ? 'Standort bearbeiten' : 'Neuer Standort'}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? 'Bearbeiten Sie die Standortdaten. Ändern Sie die gewünschten Felder.'
              : 'Erstellen Sie einen neuen Standort. Füllen Sie alle Pflichtfelder aus.'}
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
                      <Input placeholder="z.B. Feuerwache Monheim" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Adresse</h3>

                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Straße</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Hauptstraße" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.houseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hausnummer</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="z.B. 123"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address.zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PLZ</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="z.B. 40789"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stadt</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. Monheim" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Land</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Deutschland" {...field} />
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
