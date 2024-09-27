'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { Mail, Phone, UserCog } from 'lucide-react';

import { LoadingButton } from '@/components/LoadingButton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { cn } from '@/utils';

import { RejectDialog } from './RejectDialog';

import { IPersona } from '@/types';

export const ApprovalCard = ({
  persona,
  selected,
  isSelectable,
  handleSelect,
  isLoading,
}: {
  persona: IPersona;
  selected?: boolean;
  isSelectable?: boolean;
  handleSelect?: () => void;
  onClick: (id: IPersona['persona_id']) => void;
  isLoading?: boolean;
}) => {
  const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleRejectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setRejectDialogOpen(false);
  };

  const personaInitials = useMemo(() => {
    return persona.persona_name
      ?.split(' ')
      .slice(0, 2)
      .map(word => word[0])
      .join('');
  }, [persona.persona_name]);

  return (
    <Card
      className={cn(
        'group flex h-full flex-col justify-between rounded-md p-4 outline-primary hover:shadow',
        {
          'ring ring-primary': selected,
          'cursor-pointer': isSelectable,
        },
      )}
      onClick={handleSelect}
    >
      <CardContent className="flex flex-col gap-2 p-0">
        <div className="flex items-center justify-between">
          <Avatar className="size-14">
            <AvatarFallback>{personaInitials}</AvatarFallback>
          </Avatar>
          <div className="flex space-x-2">
            <Badge variant="label" className="w-fit text-sm">
              Sep 10th, 24
            </Badge>
            <TooltipProvider>
              <div className="flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-[24px] rounded-full"
                    >
                      <Mail className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="mb-2 rounded-md border bg-white p-2 text-black">
                    <p>ahmadmehmood21@mail.com</p>
                  </TooltipContent>
                </Tooltip>

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
                    <p>Employee</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-[24px] rounded-full"
                    >
                      <Phone className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="mb-2 rounded-md border bg-white p-2 text-black">
                    <p>+923132132139</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <h3 className="truncate text-lg font-semibold">
              {persona.persona_name}
            </h3>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            ahmadmehmood12@gmail.com
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex content-start items-start gap-6 p-0">
        <LoadingButton
          className="p-2 text-sm"
          variant="outline"
          loading={isLoading!}
          disabled={isLoading}
          onClick={handleRejectClick}
        >
          Reject Request
        </LoadingButton>
        <Button className="p-2 text-sm" variant="primary-inverted" asChild>
          <Link
            href={`/conversations/create?personaId=${persona.persona_id}`}
            onClick={e => e.stopPropagation()}
            prefetch={false}
          >
            Accept Request
          </Link>
        </Button>
      </CardFooter>
      <RejectDialog isOpen={isRejectDialogOpen} onClose={closeRejectDialog} />
    </Card>
  );
};
