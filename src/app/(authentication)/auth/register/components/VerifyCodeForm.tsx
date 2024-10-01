import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { subYears } from 'date-fns';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

import {
  bloodgroupStatus,
  gender,
  maritalStatus,
} from '@/libs/validations/employee';
import { registerEmployee, verifyRegisterCode } from '@/services';

import { Details } from './Details';
import { ExperienceTable } from './Experience';
import { KYC } from './KYC';

import {
  VerifyAdditionalDocumentsType,
  VerifyEducationExperienceType,
  VerifyEmployeeType,
  VerifyKYCType,
} from '@/types/auth.types';

const verifyCodeSchema = z.object({
  code: z.string().min(6, 'Code must be at least 6 characters'),
});

type verifyCodeFormType = z.infer<typeof verifyCodeSchema>;

const imageFileSchema = z
  .instanceof(File)
  .refine(
    file =>
      ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(
        file.type,
      ),
    { message: 'File must be a JPG, JPEG, PNG image or a PDF document.' },
  )
  .refine(file => file.size / 1024 <= 200, {
    message: 'File size must be less than 200KB.',
  });

const imageSchema = z.union([z.string().url(), imageFileSchema]);

const cutoffDate = subYears(new Date(), 18);

const minAgeDate = new Date();
minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  landMark: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  province: z.string().min(1, 'Province is required'),
  city: z.string().min(1, 'City is required'),
  zip: z.string().min(1, 'Postal code is required'),
  full: z.string().optional(),
});

export const educationExperienceSchema = z
  .object({
    _id: z.string().optional(),
    Institute: z.string().min(1, 'Required'),
    Start_Date: z.date({ invalid_type_error: 'Invalid Start Date format' }),
    End_Date: z.date({ invalid_type_error: 'Invalid End Date format' }),
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
  .refine(data => data.Start_Date <= data.End_Date, {
    message: 'End date cannot be before Start date',
    path: ['End_Date'],
  });

export type EducationExperienceType = z.infer<typeof educationExperienceSchema>;
const mainFormSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  additionalInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    emailAddress: z.string().email('Invalid email address'),
    contactNo: z
      .string()
      .regex(/^(03|\+923)/, 'Contact number must start with "03" or "+923"')
      .regex(
        /(?<=^(03|\+923))\d{9}$/,
        'Contact number must have exactly 9 digits after "03" or "+923"',
      ),
    Emergency_Phone: z
      .string()
      .regex(/^(03|\+923)/, 'Phone number must start with "03" or "+923"')
      .regex(
        /(?<=^(03|\+923))\d{9}$/,
        'Phone number must have exactly 9 digits after "03" or "+923"',
      ),
    DOB: z
      .date()
      .max(new Date(), 'Invalid date of birth')
      .max(minAgeDate, 'You must be at least 18 years old'),
    Marital_Status: z.enum(maritalStatus),
    Blood_Group: z.enum(bloodgroupStatus),
    Gender: z.enum(gender),
    Nationality: z.string().min(1, 'Nationality is required'),
    Family_Name: z.string().min(1, 'Family member name is required'),
    Family_Relation: z.string().min(1, 'Relation is required'),
    Family_PhoneNo: z
      .string()
      .regex(/^(03|\+923)/, 'Phone number must start with "03" or "+923"')
      .regex(
        /(?<=^(03|\+923))\d{9}$/,
        'Phone number must have exactly 9 digits after "03" or "+923"',
      ),
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
  }),
});

const defaultMainFormValues = {
  userId: '',
  additionalInfo: {
    firstName: '',
    lastName: '',
    emailAddress: '',
    contactNo: '',
    Emergency_Phone: '',
    DOB: cutoffDate,
    Marital_Status: maritalStatus[0],
    Blood_Group: bloodgroupStatus[0],
    Gender: gender[0],
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
    cnicFrontPicture: null,
    cnicBackPicture: null,
    bankBranchName: '',
    cnicNumber: '',
    bankAccountHolderName: '',
    iban: '',
    bankAccountNumber: '',
  },
  educationalDocument: {
    educationExperiences: [],
    Additional_Documents: [],
    deletedAdditionalDocuments: [],
  },
};

type MainFormData = z.infer<typeof mainFormSchema>;

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
    onError: err => {
      toast({
        title: 'Error',
        description: err?.response?.data?.error || 'Error on verifying code!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message || 'Code verification successfull!',
        variant: 'success',
      });
      setActiveTab('personal-details');

      const {
        employee,
        educationExperiences,
        additionalDocuments,
        kyc,
      }: {
        employee: VerifyEmployeeType;
        educationExperiences: VerifyEducationExperienceType;
        additionalDocuments: VerifyAdditionalDocumentsType;
        kyc: VerifyKYCType;
      } = response;

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
            : subYears(new Date(), 18),
          Marital_Status: employee?.Marital_Status || maritalStatus[0],
          Blood_Group: employee?.Blood_Group || bloodgroupStatus[0],
          Gender: employee?.Gender || gender[0],
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
          cnicFrontPicture: kyc?.cnic?.frontPicture || null,
          cnicBackPicture: kyc?.cnic?.backPicture || null,
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
              Document: exp?.Document || null,
              Position: exp.Position || '',
              referenceNumber: exp.referenceNumber || '',
              user_id: exp.user_id || '',
            })) || [],
          Additional_Documents: additionalDocuments?.Document || [],
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

  console.log(methods.getValues());

  const { mutate: mainMutate, isPending: mainIsPending } = useMutation({
    mutationFn: registerEmployee,
    onError: err => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.error || 'Error on register employee!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description:
          response?.message ||
          'Your request has been forwarded to HR for approval!',
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
        _id: entry._id || undefined,
        Institute: entry.Institute,
        Start_Date: entry.Start_Date.toISOString(),
        End_Date: entry.End_Date.toISOString(),
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

    educationalDocument.Additional_Documents.forEach((file, index) => {
      if (typeof file !== 'string') {
        formData.append(`Additional_Documents_${index}`, file);
      }
    });

    formData.append(
      'deletedAdditionalDocuments',
      JSON.stringify(educationalDocument.deletedAdditionalDocuments),
    );

    mainMutate(formData);
  };

  const handleNextTab = async (
    currentTab: keyof MainFormData,
    nextTab: string,
  ) => {
    const isValid = await methods.trigger(currentTab);
    if (isValid) {
      setActiveTab(nextTab);
    }
  };

  const handleBackTab = (prevTab: string) => {
    setActiveTab(prevTab);
  };

  return (
    <Card className="min-w-[700px]">
      <CardHeader>
        <Tabs
          defaultValue="verify-code"
          value={activeTab}
          className="flex w-full flex-col items-center"
        >
          <TabsList className="flex w-[500px] justify-between">
            <TabsTrigger value="verify-code">Verify Code</TabsTrigger>
            <TabsTrigger value="personal-details">Personal Details</TabsTrigger>
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="educational-document">
              Educational Document
            </TabsTrigger>
          </TabsList>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmitMainForm)}>
              <TabsContent value="personal-details">
                <div className="mx-auto grid w-full items-center gap-4">
                  <Details
                    onNext={() => handleNextTab('additionalInfo', 'kyc')}
                  />
                </div>
              </TabsContent>

              <TabsContent value="kyc">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <KYC
                      onNext={() =>
                        handleNextTab('kyc', 'educational-document')
                      }
                      onBack={() => handleBackTab('personal-details')}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="educational-document">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <ExperienceTable
                      onBack={() => handleBackTab('kyc')}
                      mainIsPending={mainIsPending}
                    />
                  </div>
                </div>
              </TabsContent>
            </form>
          </FormProvider>
        </Tabs>
      </CardHeader>

      <CardFooter className="flex flex-col justify-between">
        {activeTab === 'verify-code' && (
          <>
            <form
              onSubmit={codeHandleSubmit(onSubmit)}
              className="mx-auto mb-8 grid w-9/12 items-center gap-4"
            >
              <CardTitle className="pt-8 text-center">Verify Code</CardTitle>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="code">Enter your code</Label>
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
                className="mx-auto w-9/12"
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
