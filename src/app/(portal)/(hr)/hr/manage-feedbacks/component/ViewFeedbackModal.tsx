import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { QuestionAnswerType } from '@/libs/validations/hr-feedback';

interface ViewProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  answerData?: QuestionAnswerType | null;
}
const ViewFeedback = ({ open, onCloseChange, answerData }: ViewProps) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`View Answer`}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap">
            <div className="w-1/2 text-base">Employee&apos;s</div>
            <div className="mb-2 w-1/2">Feedback</div>
            <ScrollArea className="h-40 w-full overflow-visible">
              {answerData?.answers?.map((answerItem, index) => {
                const firstName = answerItem.user?.firstName || '';
                const lastName = answerItem.user?.lastName || '';
                const avatar = answerItem.user?.Avatar;
                const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

                return (
                  // eslint-disable-next-line react/jsx-key
                  <div
                    key={answerItem.user?._id || index}
                    className="m-2 flex w-full flex-wrap"
                  >
                    <div className="w-1/2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="size-6">
                          <AvatarImage
                            src={avatar || ''}
                            alt={`${firstName} ${lastName}`}
                          />
                          <AvatarFallback className="uppercase">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="max-w-[500px] truncate text-sm capitalize">
                          {`${firstName} ${lastName}`}
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {answerItem?.answer ? (
                          answerItem?.answer
                        ) : (
                          <span className="text-red-500">
                            User skipped this question
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
            {answerData?.answers?.length === 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No Feedback Available!
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewFeedback;
