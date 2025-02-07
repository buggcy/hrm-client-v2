'use client';

import { useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { Eye, Mail, Phone, UserCog } from 'lucide-react';

import CopyToClipboard from '@/components/CopyToClipboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useStores } from '@/providers/Store.Provider';

import { ComplaintListType } from '@/libs/validations/complaint';
import { AuthStoreType } from '@/stores/auth';
import { ComplaintStoreType } from '@/stores/employee/complaint';
import { cn } from '@/utils';

import ResolvedComplaintDialog from '../../component/ResolvedComplaintModal';

import { IPersona } from '@/types';

export const ComplaintCard = ({
  person,
  selected,
  isSelectable,
  handleSelect,
}: {
  person: ComplaintListType;
  selected?: boolean;
  isSelectable?: boolean;
  handleSelect?: () => void;
  onClick: (id: IPersona['persona_id']) => void;
  isLoading?: boolean;
}) => {
  const [modal, setModal] = useState<boolean>(false);
  const [selectedComplaint, setSelectedComplaint] =
    useState<ComplaintListType | null>(null);
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const userId: string | undefined = user?.id;
  const { complaintStore } = useStores() as {
    complaintStore: ComplaintStoreType;
  };
  const { setRefetchComplaintList } = complaintStore;
  const handleClose = () => {
    setModal(false);
  };
  const handleResolved = (data: ComplaintListType) => {
    setSelectedComplaint(data);
    setModal(true);
  };
  return (
    <>
      <Card
        className={cn(
          'group flex flex-col justify-between rounded-md p-4 outline-primary hover:shadow',
          {
            'ring ring-primary': selected,
            'cursor-pointer': isSelectable,
          },
        )}
        onClick={handleSelect}
      >
        <CardContent className="flex flex-col gap-2 p-0">
          <div className="flex items-center justify-between">
            <Avatar className="size-12">
              <AvatarImage
                src={person?.employee?.Avatar || ''}
                alt="User Avatar"
              />
              <AvatarFallback className="uppercase">
                {person?.employee?.firstName?.charAt(0)}
                {person?.employee?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex space-x-2">
              <Badge variant="label" className="w-fit truncate text-sm">
                {person?.createdAt
                  ? new Date(person?.createdAt).toDateString()
                  : 'N/A'}
              </Badge>
              <CopyToClipboard
                text={person?.employee?.companyEmail}
                icon={<Mail size={12} />}
                type="Email address"
              />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-[24px] rounded-full"
                    >
                      <UserCog className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="mb-2 rounded-md border bg-white p-2 text-black">
                    <p>{person?.employee?.Designation}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <CopyToClipboard
                text={person?.employee?.contactNo}
                icon={<Phone size={12} />}
                type="Contact number"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="flex justify-between">
                <h3 className="truncate text-lg font-semibold">
                  {person?.employee?.firstName} {person?.employee?.lastName}
                </h3>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {person?.employee?.companyEmail}
              </p>
            </div>
          </div>

          <div className="mt-2 flex justify-between">
            <p className="text-sm font-semibold">{'Complaint Title'}</p>
            <span className="truncate text-sm font-medium text-muted-foreground">
              {person?.title}
            </span>
          </div>

          <div className="flex justify-between">
            <p className="text-sm font-semibold">{'Proof Document'}</p>
            {person?.document ? (
              <span className="truncate text-sm font-medium text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Eye
                          className="ml-2 inline cursor-pointer text-primary/80 hover:text-primary"
                          onClick={() =>
                            person?.document &&
                            window.open(String(person?.document), '_blank')
                          }
                          size={18}
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="mb-2 rounded-md border bg-white p-2 text-black">
                      Click to Preview Document
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            ) : (
              <>
                <span className="truncate text-sm font-medium text-muted-foreground">
                  {' '}
                  {'Not Provided'}
                </span>
              </>
            )}
          </div>

          <div className="mt-2 flex justify-between">
            <p className="text-sm font-semibold">{'Complaint Description'}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="w-32 truncate text-right text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-300">
                    {person?.complaint || '-'}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="mb-2 rounded-md border bg-white p-2 text-black">
                  {person?.complaint || 'No Description Provided!'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
        <CardFooter className="mt-4 flex content-start items-start gap-6 p-0">
          <Button
            className="p-2 text-sm"
            variant="primary-inverted"
            onClick={() => handleResolved(person)}
          >
            Resolved
          </Button>
        </CardFooter>
      </Card>
      <ResolvedComplaintDialog
        open={modal}
        onCloseChange={handleClose}
        hrId={userId}
        setRefetchComplaintList={setRefetchComplaintList}
        selectedRow={selectedComplaint}
      />
    </>
  );
};
