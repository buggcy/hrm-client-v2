import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { subDays, subYears } from 'date-fns';
import {
  FieldErrors,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

import { registerEmployee, verifyRegisterCode } from '@/services';
import { formatedDate } from '@/utils';

import { Details } from './Details';
import { ExperienceTable } from './Experience';
import { KYC } from './KYC';

import { MessageErrorResponseWithError } from '@/types';
import {
  VerifyCodeResponseType,
  VerifyEducationExperienceType,
} from '@/types/auth.types';

const verifyCodeSchema = z.object({
  code: z.string().min(6, 'Code must be at least 6 characters'),
});

type verifyCodeFormType = z.infer<typeof verifyCodeSchema>;

const imageFileSchema = z
  .any()
  .refine(file => file instanceof File, { message: 'File is required.' })
  .refine(
    file =>
      file &&
      ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(
        file.type,
      ),
    { message: 'File must be a JPG, JPEG, PNG image or a PDF document.' },
  )
  .refine(file => file && file.size / 1024 <= 800, {
    message: 'File size must be less than 800KB.',
  });

const imageSchema = z.preprocess(
  value => {
    if (typeof value === 'string' && value.trim() === '') {
      return null;
    }
    return value;
  },
  z.union([imageFileSchema, z.string().url()]),
);

export type ImageUrlType = z.infer<typeof imageSchema>;

const cutoffDate = subYears(new Date(), 18);

const minAgeDate = new Date();
minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);

const addressSchema = z.object({
  street: z.string().min(1, 'Required'),
  landMark: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  province: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  zip: z.string().min(1, 'Required'),
  full: z.string().min(1, 'Required'),
});

export const educationExperienceSchema = z
  .object({
    _id: z.string().optional(),
    Institute: z.string().min(1, 'Required'),
    Start_Date: z.coerce.date({
      invalid_type_error: 'Invalid Start Date format',
    }),
    End_Date: z.coerce.date({ invalid_type_error: 'Invalid End Date format' }),
    type: z.enum(['education', 'experience'], {
      errorMap: () => ({
        message: 'Type must be either "Education" or "Experience"',
      }),
    }),
    documentType: z.string().min(1, 'Document type is required'),
    Document: imageSchema,
    Position: z.string().min(1, 'Required'),
    referenceNumber: z.string().optional(),
    user_id: z.string().min(1, 'User Id is required'),
  })
  .refine(
    data =>
      new Date(data.Start_Date).getTime() <= new Date(data.End_Date).getTime(),
    {
      message: 'End date cannot be before Start date',
      path: ['End_Date'],
    },
  )
  .refine(
    data => {
      if (data.type === 'experience' && data.referenceNumber) {
        return /^(03|\+923)/.test(data.referenceNumber);
      }
      return true;
    },
    {
      message: 'Reference number must start with "03" or "+923"',
      path: ['referenceNumber'],
    },
  )
  .refine(
    data => {
      if (data.type === 'experience' && data.referenceNumber) {
        if (data.referenceNumber.startsWith('03')) {
          return data.referenceNumber.length === 11;
        }
        if (data.referenceNumber.startsWith('+923')) {
          return data.referenceNumber.length === 13;
        }
      }
      return true;
    },
    {
      message: 'Invalid reference number format',
      path: ['referenceNumber'],
    },
  );

export type EducationExperienceType = z.infer<typeof educationExperienceSchema>;
const mainFormSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  additionalInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    emailAddress: z.string().email('Invalid email address'),
    contactNo: z
      .string()
      .regex(/^(03|\+923)/, 'Contact number must start with "03" or "+923"'),
    Emergency_Phone: z
      .string()
      .regex(/^(03|\+923)/, 'Phone number must start with "03" or "+923"'),
    DOB: z.date().max(minAgeDate, 'You must be at least 18 years old'),
    Marital_Status: z.string().optional(),
    Blood_Group: z.string().optional(),
    Gender: z.string().min(1, 'Gender is required'),
    Nationality: z.string().min(1, 'Nationality is required'),
    Family_Name: z.string().min(1, 'Family member name is required'),
    Family_Relation: z.string().min(1, 'Relation is required'),
    Family_PhoneNo: z
      .string()
      .regex(/^(03|\+923)/, 'Phone number must start with "03" or "+923"'),
    Family_Occupation: z.string().min(1, 'Occupation is required'),
    Address: addressSchema,
  }),
  kyc: z.object({
    cnicFrontPicture: imageSchema,
    cnicBackPicture: imageSchema,
    bankBranchName: z.string().min(1, 'Bank branch name is required'),
    cnicNumber: z
      .string()
      .regex(/^\d{5}-\d{7}-\d$/, 'CNIC must be in the format XXXXX-XXXXXXX-X'),
    bankAccountHolderName: z.string().min(1, 'Account holder name is required'),
    iban: z.string().min(1, 'IBAN is required'),
    bankAccountNumber: z.string().min(1, 'Account Number is required'),
  }),
  educationalDocument: z.object({
    educationExperiences: z
      .array(educationExperienceSchema)
      .min(1, 'You must add at least one education experience'),
    Additional_Documents: z.array(imageSchema),
    deletedAdditionalDocuments: z.array(imageSchema),
    additionalId: z.string(),
  }),
});

export type EducationalDocumentType = z.infer<
  typeof mainFormSchema
>['educationalDocument'];

const defaultMainFormValues = {
  userId: '',
  additionalInfo: {
    firstName: '',
    lastName: '',
    emailAddress: '',
    contactNo: '',
    Emergency_Phone: '',
    DOB: cutoffDate,
    Marital_Status: '',
    Blood_Group: '',
    Gender: '',
    Nationality: '',
    Family_Name: '',
    Family_Relation: '',
    Family_PhoneNo: '',
    Family_Occupation: '',
    Address: {
      street: '',
      landMark: '',
      country: 'Pakistan',
      province: 'Punjab',
      city: 'Gujranwala',
      zip: '',
      full: '',
    },
  },
  kyc: {
    cnicFrontPicture: '',
    cnicBackPicture: '',
    bankBranchName: '',
    cnicNumber: '',
    bankAccountHolderName: '',
    iban: '',
    bankAccountNumber: '',
  },
  educationalDocument: {
    additionalId: '',
    educationExperiences: [],
    Additional_Documents: [],
    deletedAdditionalDocuments: [],
  },
};

export type MainFormData = z.infer<typeof mainFormSchema>;
export type MainFormErrorsType = FieldErrors<MainFormData>;

export function VerifyCodeForm(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('verify-code');
  const router = useRouter();

  const {
    register: codeRegister,
    handleSubmit: codeHandleSubmit,
    formState: { errors: codeErrors },
  } = useForm<verifyCodeFormType>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: verifyRegisterCode,
    onError: (err: AxiosError<MessageErrorResponseWithError>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.error || 'Error on verifying code!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: 'Code verification successful!',
        variant: 'success',
      });
      setActiveTab('personal-details');

      const {
        employee,
        educationExperiences,
        additionalDocuments,
        kyc,
      }: VerifyCodeResponseType = response;

      methods.reset({
        userId: employee?._id || '',
        additionalInfo: {
          firstName: employee?.firstName || '',
          lastName: employee?.lastName || '',
          emailAddress: employee?.email || '',
          contactNo: employee?.contactNo || '',
          Emergency_Phone: employee?.Emergency_Phone || '',
          DOB: employee?.DOB
            ? new Date(employee.DOB)
            : subDays(subYears(new Date(), 18), 1),
          Marital_Status: employee?.Marital_Status || '',
          Blood_Group: employee?.Blood_Group || '',
          Gender: employee?.Gender || '',
          Nationality: employee?.Nationality || '',
          Family_Name: employee?.Family_Name || '',
          Family_Relation: employee?.Family_Relation || '',
          Family_PhoneNo: employee?.Family_PhoneNo || '',
          Family_Occupation: employee?.Family_Occupation || '',
          Address: employee?.Address || {
            street: '',
            landMark: '',
            country: 'Pakistan',
            province: 'Punjab',
            city: 'Gujranwala',
            zip: '',
            full: '',
          },
        },
        kyc: {
          cnicFrontPicture: kyc?.cnic?.frontPicture || '',
          cnicBackPicture: kyc?.cnic?.backPicture || '',
          bankBranchName: kyc?.bankDetails?.branchName || '',
          cnicNumber: kyc?.cnic?.number || '',
          bankAccountHolderName: kyc?.bankDetails?.accountHolderName || '',
          iban: kyc?.bankDetails?.iban || '',
          bankAccountNumber: kyc?.bankDetails?.accountNumber || '',
        },
        educationalDocument: {
          educationExperiences:
            educationExperiences?.map((exp: VerifyEducationExperienceType) => ({
              Institute: exp.Institute || '',
              Start_Date: exp.Start_Date
                ? new Date(exp.Start_Date)
                : new Date(),
              End_Date: exp.End_Date ? new Date(exp.End_Date) : new Date(),
              type: exp.type || 'education',
              documentType: exp.documentType || '',
              Document: exp?.Document || '',
              Position: exp.Position || '',
              referenceNumber: exp.referenceNumber || '',
              user_id: exp.user_id || '',
              _id: exp?._id,
            })) || [],
          Additional_Documents: additionalDocuments?.Document || [],
          additionalId: additionalDocuments?._id || '',
          deletedAdditionalDocuments: [],
        },
      });
    },
  });

  const onSubmit = (data: z.infer<typeof verifyCodeSchema>) => {
    mutate(data);
  };

  const methods = useForm<MainFormData>({
    resolver: zodResolver(mainFormSchema),
    defaultValues: defaultMainFormValues,
    mode: 'onChange',
  });

  const { mutate: mainMutate, isPending: mainIsPending } = useMutation({
    mutationFn: registerEmployee,
    onError: (err: AxiosError<MessageErrorResponseWithError>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.error || 'Error on register employee!',
        variant: 'error',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Your request has been forwarded to HR for approval!',
        variant: 'success',
      });
      methods.reset();
      router.push('/auth/sign-in');
    },
  });

  const onSubmitMainForm: SubmitHandler<MainFormData> = data => {
    const { userId, additionalInfo, kyc, educationalDocument } = data;

    const formData = new FormData();

    formData.append('email', additionalInfo.emailAddress);

    if (typeof kyc.cnicFrontPicture !== 'string')
      formData.append('cnicFrontPicture', kyc.cnicFrontPicture as Blob);

    if (typeof kyc.cnicBackPicture !== 'string')
      formData.append('cnicBackPicture', kyc.cnicBackPicture as Blob);

    formData.append('bankBranchName', kyc.bankBranchName);
    formData.append('cnicNumber', kyc.cnicNumber);
    formData.append('bankAccountHolderName', kyc.bankAccountHolderName);
    formData.append('bankAccountNumber', kyc.bankAccountNumber);
    formData.append('iban', kyc.iban);
    formData.append('userId', userId);
    formData.append('additionalInfo', JSON.stringify(additionalInfo));

    const educationExperiences = educationalDocument.educationExperiences.map(
      (entry, index) => ({
        _id: entry?._id,
        Institute: entry.Institute,
        Start_Date: formatedDate(entry?.Start_Date),
        End_Date: formatedDate(entry?.End_Date),
        type: entry.type,
        documentType: entry.documentType,
        Document: `Document${index}`,
        Position: entry.Position,
        referenceNumber: entry.referenceNumber || '',
        user_id: userId,
      }),
    );

    formData.append(
      'educationExperiences',
      JSON.stringify(educationExperiences),
    );

    educationalDocument.educationExperiences.forEach((entry, index) => {
      if (entry.Document && typeof entry.Document !== 'string') {
        formData.append(`Document${index}`, entry.Document as Blob);
      }
    });

    if (educationalDocument.additionalId) {
      formData.append(
        'additionalDocumentsId',
        educationalDocument.additionalId,
      );
    }

    educationalDocument.Additional_Documents.forEach(file => {
      if (typeof file !== 'string') {
        formData.append(`Additional_Documents`, file);
      }
    });

    if (educationalDocument?.deletedAdditionalDocuments?.length) {
      educationalDocument.deletedAdditionalDocuments.forEach(doc => {
        formData.append('deletedAdditionalDocuments[]', doc);
      });
    }
    mainMutate(formData);
  };

  const handleNextTab = async (
    currentTab: keyof MainFormData,
    nextTab: string,
  ) => {
    const isValid = await methods.trigger(currentTab);
    if (isValid) {
      methods.clearErrors();
      setActiveTab(nextTab);
    }
  };

  const handleBackTab = (prevTab: string) => {
    setActiveTab(prevTab);
  };

  return (
    <Card className="mx-auto max-w-lg p-4 sm:max-w-lg md:max-w-screen-sm lg:max-w-screen-lg">
      <Tabs
        defaultValue="verify-code"
        value={activeTab}
        className="flex w-full flex-col"
      >
        <TabsList className="mx-auto my-6 grid h-auto w-full grid-cols-1 gap-2 lg:h-10 lg:w-10/12 lg:grid-cols-4 xl:w-9/12">
          <TabsTrigger value="verify-code">Verify Code</TabsTrigger>
          <TabsTrigger value="personal-details">Personal Details</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
          <TabsTrigger className="px-3" value="educational-document">
            Educational Document
          </TabsTrigger>
        </TabsList>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmitMainForm)}>
            <TabsContent value="personal-details">
              <Details onNext={() => handleNextTab('additionalInfo', 'kyc')} />
            </TabsContent>

            <TabsContent value="kyc">
              <KYC
                onNext={() => handleNextTab('kyc', 'educational-document')}
                onBack={() => handleBackTab('personal-details')}
              />
            </TabsContent>

            <TabsContent value="educational-document" className="">
              <ExperienceTable
                onBack={() => handleBackTab('kyc')}
                mainIsPending={mainIsPending}
              />
            </TabsContent>
          </form>
        </FormProvider>
      </Tabs>

      <CardFooter className="flex flex-col justify-between">
        {activeTab === 'verify-code' && (
          <>
            <form
              onSubmit={codeHandleSubmit(onSubmit)}
              className="mx-auto mb-8 grid w-full items-center gap-4 lg:w-9/12"
            >
              <CardTitle className="py-8 text-center">Verify Code</CardTitle>
              <div className="mx-auto flex w-full flex-col gap-2 lg:w-9/12">
                <Label htmlFor="code">
                  Enter your code <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="Enter your code"
                  {...codeRegister('code')}
                />
                {codeErrors.code && (
                  <span className="text-red-600">
                    {codeErrors.code.message}
                  </span>
                )}
              </div>
              <Button
                className="mx-auto w-full lg:w-9/12"
                type="submit"
                disabled={isPending}
              >
                {isPending ? 'Verifying...' : 'Verify Code'}
              </Button>
            </form>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
