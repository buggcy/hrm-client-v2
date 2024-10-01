import React from 'react';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
interface PerkModalProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
}
export function PerkModal({ open, onCloseChange }: PerkModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for Perks</DialogTitle>
        </DialogHeader>
        <form className="grid gap-8 py-4">
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="Designation" className="mb-2 text-left">
                Perks
              </Label>

              <Select>
                <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                  <SelectValue placeholder="Select Perks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="text-sm">
                    <SelectItem value="No Perks Available" disabled>
                      Select Perks
                    </SelectItem>

                    <SelectItem value={'Bike'} className="capitalize">
                      {'Bike'}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
                <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Apply</Button>
            <Button
              type="submit"
              variant={'ghostSecondary'}
              onClick={() => onCloseChange}
            >
              Close
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
