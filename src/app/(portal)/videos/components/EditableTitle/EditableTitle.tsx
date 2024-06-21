'use client';

import React from 'react';

// import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';

// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
import { Button } from '@/components/ui/button';

// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { toast } from '@/components/ui/use-toast';
import { IVideo } from '@/types';

// const FormSchema = z.object({
//   title: z.string().min(1, {
//     message: 'Title cannot be empty.',
//   }),
// });

interface EditableTitleProps {
  video_name?: IVideo['video_name'];
  status?: IVideo['status'];
}

const EditableTitle: React.FC<EditableTitleProps> = ({
  video_name,
  // status,
}) => {
  // const [title, setTitle] = useState<string>(video_name || '');
  // const [isEditing, setIsEditing] = useState<boolean>(false);
  // const [tempTitle, setTempTitle] = useState<string>(title);
  // const inputRef = useRef<HTMLInputElement>(null);
  // const wrapperRef = useRef<HTMLDivElement>(null);

  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  //   defaultValues: {
  //     title: video_name || '',
  //   },
  // });

  // const handleRevert = useCallback(() => {
  //   setTempTitle(title);
  //   setIsEditing(false);
  //   form.clearErrors('title');
  // }, [form, title]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     console.log('handleClickOutside 111');
  //     if (
  //       wrapperRef.current &&
  //       !wrapperRef.current.contains(event.target as Node)
  //     ) {
  //       console.log('handleClickOutside 222');

  //       handleRevert();
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [handleRevert]);

  // const handleEdit = () => {
  //   // if (status === VideoStatus.READY) {
  //   setIsEditing(true);
  //   setTempTitle(title);
  //   // }
  // };

  // const handleSave = () => {
  //   if (tempTitle.trim() === '') {
  //     form.setError('title', {
  //       type: 'manual',
  //       message: 'Title cannot be empty.',
  //     });
  //     handleRevert();
  //   } else {
  //     setTitle(tempTitle);
  //     setIsEditing(false);
  //     form.clearErrors('title');
  //     console.log('SAVED');
  //   }
  // };

  // const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Enter') {
  //     handleSave();
  //   } else if (event.key === 'Escape') {
  //     handleRevert();
  //   }
  // };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setTempTitle(event.target.value);
  //   if (event.target.value.trim() !== '') {
  //     form.clearErrors('title');
  //   }
  // };

  // const onSubmit = (data: z.infer<typeof FormSchema>) => {
  //   setTitle(data.title);
  //   setIsEditing(false);
  //   toast({
  //     title: 'Title updated',
  //     description: (
  //       <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //         <code className="text-white">{JSON.stringify(data, null, 2)}</code>
  //       </pre>
  //     ),
  //   });
  // };

  return (
    // <div ref={wrapperRef}>
    //   <Form {...form}>
    //     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //       <FormField
    //         control={form.control}
    //         name="title"
    //         render={({ field }) => (
    //           <FormItem>
    //             {isEditing ? (
    //               <div>
    //                 <FormControl>
    //                   <Input
    //                     ref={inputRef}
    //                     type="text"
    //                     value={tempTitle}
    //                     onChange={handleChange}
    //                     onKeyDown={handleKeyDown}
    //                     onBlur={handleSave}
    //                     autoFocus
    //                     {...field}
    //                   />
    //                 </FormControl>
    //                 <FormMessage />
    //               </div>
    //             ) : (
    //               <h1 onClick={handleEdit}>{title}</h1>
    //             )}
    //           </FormItem>
    //         )}
    //       />
    //     </form>
    //   </Form>
    // </div>
    <div className="flex w-full items-start">
      <p className="font-semibold text-foreground">{video_name}</p>
      <Button variant="ghost" size="icon" className="ml-2.5 size-6 p-0">
        <Pencil className="size-3.5" />
      </Button>
    </div>
  );
};

export { EditableTitle };
