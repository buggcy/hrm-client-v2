'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

import {
  useHrEmpoyeeAllPerksQuery,
  useHrPerkRequestsQuery,
  useHrPerksEmpoyeeQuery,
} from '@/hooks/hrPerksList/useHrPerksList.hook';
import { perksHandler } from '@/services/hr/perks-list.service';

import { PerkForm } from './components/PerkForm';

import { MessageErrorResponse } from '@/types';
import {
  HrEmployeeAllPerksApiResponse,
  HrPerksGetEmployees,
} from '@/types/hr-perks-list.types';

interface AwardPerksProps {}

const AwardPerksPage: FunctionComponent<AwardPerksProps> = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedEmployeeData, setSelectedEmployeeData] =
    useState<HrPerksGetEmployees>();
  const handleEmployeeChange = (value: string) => {
    setSelectedEmployee(value);
    setSelectedEmployeeData(data?.data.find(employee => employee.id === value));
  };
  const [perkData, setPerkData] = useState<HrEmployeeAllPerksApiResponse>();
  const { data } = useHrPerksEmpoyeeQuery();

  const { data: employeePerks } = useHrEmpoyeeAllPerksQuery(
    { id: selectedEmployee },
    {
      enabled: !!selectedEmployee,
    },
  );

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

  useEffect(() => {
    if (employeePerks) {
      setPerkData(employeePerks);
    }
  }, [employeePerks]);

  useEffect(() => {
    console.log(perkData);
  }, [perkData]);

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
    console.log(perkData);
    assignPerks({
      id: selectedEmployee,
      data: perkData?.data,
    });
  };

  const { data: perkRequests } = useHrPerkRequestsQuery({});

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Award Perks">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8 px-2">
        <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row">
          <Select onValueChange={handleEmployeeChange}>
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 md:max-w-[64%]">
              <SelectTrigger className="h-[50px] w-full p-4">
                {selectedEmployee ? (
                  <div className="flex items-center gap-1 sm:gap-4">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={selectedEmployeeData?.avatar || ''}
                        alt={`${selectedEmployeeData?.avatar}`}
                      />
                      <AvatarFallback className="uppercase">
                        {selectedEmployeeData?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <SelectValue>
                        <p className="text-sm">{selectedEmployeeData?.name}</p>
                      </SelectValue>
                      <p className="text-xs text-muted-foreground">
                        {selectedEmployeeData?.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <SelectValue placeholder="Select Employee" />
                )}
              </SelectTrigger>
              <div className="hidden h-0 w-full opacity-0 sm:block"></div>
              <div className="hidden h-0 w-full opacity-0 sm:block"></div>
            </div>
            <SelectContent className="w-fit">
              <SelectGroup>
                <SelectLabel>Select Employee</SelectLabel>
                {data?.data.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    <div className="flex items-center gap-1 sm:gap-4">
                      <Avatar className="size-8">
                        <AvatarImage
                          src={employee.avatar || ''}
                          alt={`${employee.avatar}`}
                        />
                        <AvatarFallback className="uppercase">
                          {employee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col justify-start">
                        <p className="text-sm">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" asChild className="h-[50px]">
            <Link
              href="/hr/manage-perks/perk-requests"
              className="flex items-center"
            >
              View Approval Requests
              <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                {perkRequests?.data.length || 0}
              </span>
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="grid h-fit w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 md:max-w-[65%]">
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
            <div className="grid h-fit max-h-[75vh] w-full grid-cols-1 overflow-y-auto rounded-lg border bg-background md:max-w-[35%]">
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
              {selectedEmployee && (
                <Button
                  onClick={onSubmit}
                  disabled={isAssigning}
                  className="m-4"
                >
                  Submit
                </Button>
              )}
            </div>
          )}
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default AwardPerksPage;
