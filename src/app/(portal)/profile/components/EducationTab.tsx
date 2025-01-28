'use client';
import React from 'react';

import { EyeIcon, MoreHorizontal } from 'lucide-react';
import moment from 'moment';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { EducationExperiences } from '@/types/employee.types';
interface EducationTabProps {
  educationExperiences: EducationExperiences[];
  type: 'education' | 'experience';
}
const EducationTab: React.FC<EducationTabProps> = ({
  educationExperiences,
  type,
}) => {
  const filteredExperiences = educationExperiences?.filter(
    experience => experience.type === type,
  );
  return (
    <>
      {type === 'education' && (
        <div>
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <Table className="mb-2">
              <TableHeader>
                <TableRow>
                  <TableHead>Degree</TableHead>
                  <TableHead>Institute</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExperiences && filteredExperiences.length > 0 ? (
                  filteredExperiences.map((experience, index) => (
                    <TableRow key={index}>
                      <TableCell>{experience?.Position || '-'}</TableCell>
                      <TableCell>{experience?.Institute || '-'}</TableCell>
                      <TableCell>
                        {moment(
                          experience?.Start_Date as string | number | Date,
                        ).format('ddd MMM DD YYYY') || '-'}{' '}
                        -{' '}
                        {moment(
                          experience?.End_Date as string | number | Date,
                        ).format('ddd MMM DD YYYY') || '-'}
                      </TableCell>
                      <TableCell>{experience?.documentType || '-'}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="flex size-8 p-0 data-[state=open]:bg-muted"
                              >
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[200px]"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DialogTrigger
                                asChild
                                onClick={() =>
                                  window.open(
                                    String(experience?.Document),
                                    '_blank',
                                  )
                                }
                              >
                                <DropdownMenuItem>
                                  <EyeIcon className="mr-2 size-4" />
                                  View
                                </DropdownMenuItem>
                              </DialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500 dark:text-gray-300"
                    >
                      No Education Provided!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>Total Records</TableCell>
                  <TableCell className="text-right">
                    {filteredExperiences?.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
      {type === 'experience' && (
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <Table className="mb-2">
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExperiences && filteredExperiences.length > 0 ? (
                filteredExperiences.map((experience, index) => (
                  <TableRow key={index}>
                    <TableCell>{experience?.Position || '-'}</TableCell>
                    <TableCell>{experience?.Institute || '-'}</TableCell>
                    <TableCell>
                      {moment(
                        experience?.Start_Date as string | number | Date,
                      ).format('ddd MMM DD YYYY') || '-'}{' '}
                      -{' '}
                      {moment(
                        experience?.End_Date as string | number | Date,
                      ).format('ddd MMM DD YYYY') || '-'}
                    </TableCell>
                    <TableCell>{experience?.referenceNumber || '-'}</TableCell>
                    <TableCell>{experience?.documentType || '-'}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex size-8 p-0 data-[state=open]:bg-muted"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[200px]"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DialogTrigger
                              asChild
                              onClick={() =>
                                window.open(
                                  String(experience?.Document),
                                  '_blank',
                                )
                              }
                            >
                              <DropdownMenuItem>
                                <EyeIcon className="mr-2 size-4" />
                                View
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 dark:text-gray-300"
                  >
                    No Experience Provided!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>Total Records</TableCell>
                <TableCell className="text-right">
                  {filteredExperiences?.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </>
  );
};

export default EducationTab;
