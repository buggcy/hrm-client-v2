import { useState } from 'react';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { LoadingButton } from '@/components/LoadingButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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

import { EduEpxDialog } from './EduExpDialg';
import Dropzone from './uploadFile';
import { EducationExperienceType, MainFormData } from './VerifyCodeForm';

export function ExperienceTable({
  onBack,
  mainIsPending,
}: {
  onBack: () => void;
  mainIsPending: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] =
    useState<EducationExperienceType | null>(null);
  const [deletingItem, setDeletingItem] =
    useState<EducationExperienceType | null>(null);
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<MainFormData>();

  const educationExperiences = watch(
    'educationalDocument.educationExperiences',
  );

  const userId = watch('userId');

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditingItem(null);
    setDialogOpen(false);
  };

  const handleEditClick = (rowData: EducationExperienceType) => {
    setEditingItem(rowData);
    setDialogOpen(true);
  };

  const handleExperienceSubmit = (data: EducationExperienceType) => {
    if (editingItem) {
      // Update existing item
      const updatedExperiences = educationExperiences.map(
        (exp: EducationExperienceType) => (exp === editingItem ? data : exp),
      );
      setValue('educationalDocument.educationExperiences', updatedExperiences);
    } else {
      // Add new item
      setValue('educationalDocument.educationExperiences', [
        ...educationExperiences,
        data,
      ]);
    }
    handleDialogClose();
  };

  const handleDeleteClick = (itemToDelete: EducationExperienceType) => {
    setDeletingItem(itemToDelete);
  };

  const confirmDelete = () => {
    if (deletingItem) {
      const updatedExperiences = educationExperiences.filter(
        (exp: EducationExperienceType) => exp !== deletingItem,
      );
      setValue('educationalDocument.educationExperiences', updatedExperiences);
      setDeletingItem(null);
    }
  };

  return (
    <Card className="mt-4 border-none shadow-none">
      <div className="mb-4 flex flex-col justify-between md:flex-row">
        <CardHeader className="mb-4 flex items-center justify-between p-0">
          <CardTitle className="flex-1 text-right">
            Education & Experience
          </CardTitle>
        </CardHeader>
        <Button type="button" onClick={handleDialogOpen}>
          Add More
        </Button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Institute/Company</TableHead>
              <TableHead>Position/Degree</TableHead>
              <TableHead>Reference No</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {educationExperiences.map(
              (item: EducationExperienceType, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </TableCell>
                  <TableCell>{item.Start_Date.toDateString()}</TableCell>
                  <TableCell>{item.End_Date.toDateString()}</TableCell>
                  <TableCell>{item.Institute}</TableCell>
                  <TableCell>{item.Position}</TableCell>
                  <TableCell>{item.referenceNumber}</TableCell>
                  <TableCell> {item.documentType}</TableCell>
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
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DialogTrigger
                            asChild
                            onClick={() => handleEditClick(item)}
                          >
                            <DropdownMenuItem>
                              <Pencil className="mr-2 size-4" />
                              Edit Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(item)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Total Records</TableCell>
              <TableCell className="text-right">
                {educationExperiences.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {educationExperiences?.length === 0 &&
        errors?.educationalDocument?.educationExperiences && (
          <span className="text-xs text-red-500">
            {errors?.educationalDocument?.educationExperiences?.message}
          </span>
        )}

      <CardTitle className="mb-2 mt-4 flex">Additional Documents</CardTitle>
      <Dropzone />
      {errors?.educationalDocument?.Additional_Documents && (
        <span className="text-xs text-red-500">
          {errors?.educationalDocument?.Additional_Documents?.message}
        </span>
      )}
      <div className="flex justify-between pt-8">
        <Button type="button" variant={'outline'} onClick={onBack}>
          Back
        </Button>
        <LoadingButton loading={mainIsPending} type="submit">
          Submit
        </LoadingButton>
      </div>

      <EduEpxDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
        handleExperienceSubmit={handleExperienceSubmit}
        editingItem={editingItem}
        userId={userId}
      />
      <AlertDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected education or experience entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingItem(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
