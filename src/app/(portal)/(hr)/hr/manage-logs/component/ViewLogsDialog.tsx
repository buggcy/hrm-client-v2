'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { LogsListType } from '@/libs/validations/logs';

interface LogsDialogProps {
  data: LogsListType;
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
}

export function ViewLogsDialog({
  data,
  open,
  onOpenChange,
  onCloseChange,
}: LogsDialogProps) {
  const { title, type, overallStatus, createdAt, message } = data;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div>
              <strong>Type:</strong> {type}
            </div>
            <div>
              <strong>Title:</strong> {title}
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <strong>Date:</strong>{' '}
              {new Date(createdAt).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div>
              <strong>Status:</strong>
              <Badge
                className="ml-2 px-2 py-1"
                variant={overallStatus === 'Success' ? 'success' : 'error'}
              >
                {overallStatus}
              </Badge>
            </div>
          </div>
        </div>
        <div className="mb-14">
          <span className="font-semibold">Messages:</span>
          {message.map((msg, index) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-4"
            >
              <span>
                {new Date(msg.timestamp)
                  .toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                  .replace('am', 'AM')
                  .replace('pm', 'PM')}
              </span>

              <Badge
                className="ml-2 px-2 py-1"
                variant={msg.status === 'Success' ? 'success' : 'error'}
              >
                {msg.status}
              </Badge>
              <span className="ml-4 flex-1">{msg.message}</span>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onCloseChange} size="sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
