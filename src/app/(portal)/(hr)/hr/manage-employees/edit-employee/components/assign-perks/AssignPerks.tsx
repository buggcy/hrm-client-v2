'use client';

import React, { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

import { useHrEmpoyeeAllPerksQuery } from '@/hooks/hrPerksList/useHrPerksList.hook';
import { perksHandler } from '@/services/hr/perks-list.service';

import { PerkForm } from '../../../../manage-perks/award-perks/components/PerkForm';

import { MessageErrorResponse } from '@/types';
import { HrEmployeeAllPerksApiResponse } from '@/types/hr-perks-list.types';

interface AssignPerksProps {
  empId?: string;
}

const AssignPerks = ({ empId = '' }: AssignPerksProps) => {
  const [perkData, setPerkData] = useState<HrEmployeeAllPerksApiResponse>();
  const { data: employeePerks } = useHrEmpoyeeAllPerksQuery({ id: empId });
  useEffect(() => {
    if (employeePerks) {
      setPerkData(employeePerks);
    }
  }, [employeePerks]);

  const { mutate: assignPerks, isPending: isAssigning } = useMutation({
    mutationFn: perksHandler,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on adding perk!',
        variant: 'error',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Perk assigned successfully!',
        variant: 'success',
      });
    },
  });

  const handlePerkDataIncrementChange = (id: string, value: number) => {
    setPerkData(prevState => {
      if (!prevState || !prevState.data) return prevState;
      return {
        ...prevState,
        data: prevState.data.map(perk => {
          if (perk._id === id) {
            return {
              ...perk,
              assignedIncrementAmount: value,
            };
          }
          return perk;
        }),
      };
    });
  };

  const handlePerkDataDecrementChange = (id: string, value: number) => {
    setPerkData(prevState => {
      if (!prevState || !prevState.data) return prevState;
      return {
        ...prevState,
        data: prevState.data.map(perk => {
          if (perk._id === id) {
            return {
              ...perk,
              assignedDecrementAmount: value,
            };
          }
          return perk;
        }),
      };
    });
  };

  const handleCheckboxChange = (id: string) => {
    setPerkData(prevState => {
      if (!prevState || !prevState.data) return prevState;
      return {
        ...prevState,
        data: prevState.data.map(perk => {
          if (perk._id === id) {
            return {
              ...perk,
              isAvailable: !perk.isAvailable,
            };
          }
          return perk;
        }),
      };
    });
  };

  const onSubmit = () => {
    assignPerks({
      id: empId,
      data: perkData?.data,
    });
  };
  return (
    <div className="flex flex-col gap-4 md:flex-row lg:overflow-y-auto">
      <div className="grid h-fit w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 md:max-w-[65%]">
        {perkData?.data.map(perk => (
          <div
            key={perk._id}
            className="flex items-center gap-4 rounded-lg border border-[hsl(var(--border))] bg-background p-4"
          >
            <Checkbox
              id={perk._id}
              checked={perk.isAvailable}
              onCheckedChange={() => {
                handleCheckboxChange(perk._id);
              }}
            />
            <Label
              htmlFor={perk._id}
              className="pb-0 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {perk.name}
            </Label>
          </div>
        ))}
      </div>
      {perkData && (
        <div className="grid h-fit w-full grid-cols-1 overflow-y-auto rounded-lg border bg-background md:max-w-[35%] lg:max-h-[80vh]">
          <Accordion type="multiple" className="w-full">
            {perkData?.data.map(perk => {
              if (perk.isAvailable)
                return (
                  <AccordionItem value={perk._id} key={perk._id}>
                    <AccordionTrigger className="p-4">
                      {perk.name}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                      <PerkForm
                        perk={perk}
                        handlePerkDataIncrementChange={
                          handlePerkDataIncrementChange
                        }
                        handlePerkDataDecrementChange={
                          handlePerkDataDecrementChange
                        }
                      />
                    </AccordionContent>
                  </AccordionItem>
                );
            })}
          </Accordion>
          <Button onClick={onSubmit} disabled={isAssigning} className="m-4">
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssignPerks;
