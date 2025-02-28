import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { HrEmployeeAllPerks } from '@/types/hr-perks-list.types';

const createAssignPerkSchema = (
  salaryIncrement: boolean,
  salaryDecrement: boolean,
) => {
  return z.object({
    increment: salaryIncrement
      ? z
          .number({
            invalid_type_error: 'Increment must be a number',
          })
          .gt(0, 'Increment amount must be greater than zero')
      : z.number().optional(),
    decrement: salaryDecrement
      ? z
          .number({
            invalid_type_error: 'Decrement must be a number',
          })
          .gt(0, 'Decrement amount must be greater than zero')
      : z.number().optional(),
  });
};

export type AssignPerkFormData = z.infer<
  ReturnType<typeof createAssignPerkSchema>
>;

interface PerkFormProps {
  perk: HrEmployeeAllPerks;
  handlePerkDataIncrementChange: (id: string, value: number) => void;
  handlePerkDataDecrementChange: (id: string, value: number) => void;
}

export const PerkForm = ({
  perk,
  handlePerkDataIncrementChange,
  handlePerkDataDecrementChange,
}: PerkFormProps) => {
  const assignPerkSchema = createAssignPerkSchema(
    perk.salaryIncrement,
    perk.salaryDecrement,
  );

  const {
    control,
    formState: { errors, touchedFields },
    trigger,
  } = useForm<AssignPerkFormData>({
    resolver: zodResolver(assignPerkSchema),
    mode: 'onChange',
    defaultValues: {
      increment: perk.assignedIncrementAmount || 0,
      decrement: perk.assignedDecrementAmount || 0,
    },
  });

  useEffect(() => {
    void trigger();
  }, [
    perk.assignedIncrementAmount,
    perk.assignedDecrementAmount,
    trigger,
    touchedFields,
  ]);

  return (
    <form className="grid gap-8 py-4">
      <div className="grid grid-cols-1 gap-8">
        {perk.salaryIncrement && (
          <div className="flex flex-col">
            <Label htmlFor="increment" className="mb-2 text-left">
              Increment
            </Label>
            <Controller
              name="increment"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="increment"
                  placeholder="Increment"
                  type="text"
                  onChange={e => {
                    const value = e.target.value;
                    field.onChange(value === '' ? '' : Number(value));
                    handlePerkDataIncrementChange(
                      perk._id,
                      value === '' ? 0 : Number(value),
                    );
                  }}
                />
              )}
            />

            {errors.increment && touchedFields.increment && (
              <span className="text-sm text-red-500">
                {errors.increment.message}
              </span>
            )}
          </div>
        )}
        {perk.salaryDecrement && (
          <div className="flex flex-col">
            <Label htmlFor="decrement" className="mb-2 text-left">
              Decrement
            </Label>
            <Controller
              name="decrement"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="decrement"
                  placeholder="Decrement"
                  type="text"
                  onChange={e => {
                    const value = e.target.value;
                    field.onChange(value === '' ? '' : Number(value));
                    handlePerkDataDecrementChange(
                      perk._id,
                      value === '' ? 0 : Number(value),
                    );
                  }}
                />
              )}
            />
            {errors.decrement && (
              <span className="text-sm text-red-500">
                {errors.decrement.message}
              </span>
            )}
          </div>
        )}
      </div>
    </form>
  );
};
