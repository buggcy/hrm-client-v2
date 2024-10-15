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
      ? z.number().min(1, 'Increment is required')
      : z.number().optional(),
    decrement: salaryDecrement
      ? z.number().min(1, 'Decrement is required')
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
    formState: { errors },
  } = useForm<AssignPerkFormData>({
    resolver: zodResolver(assignPerkSchema),
    defaultValues: {
      increment: perk.assignedIncrementAmount,
      decrement: perk.assignedDecrementAmount,
    },
  });

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
                  type="number"
                  onChange={e => {
                    const value = Number(e.target.value);
                    field.onChange(value);
                    handlePerkDataIncrementChange(perk._id, value);
                  }}
                  min={1}
                />
              )}
            />
            {errors.increment && (
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
                  type="number"
                  onChange={e => {
                    const value = Number(e.target.value);
                    field.onChange(value);
                    handlePerkDataDecrementChange(perk._id, value);
                  }}
                  min={1}
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
