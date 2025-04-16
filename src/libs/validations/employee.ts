import { z } from 'zod';

export const gender = ['male', 'female'] as const;
export const approvalStatus = [
  'Approved',
  'Pending',
  'Rejected',
  'tba',
  'Resigned',
  'Fired',
] as const;
export const resignedStatus = ['Approved', 'Pending', 'Rejected'] as const;
export const maritalStatus = ['married', 'unmarried'] as const;
export const bloodgroupStatus = [
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-',
] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const addressSchema = z
  .object({
    city: z.string().optional(),
    street: z.string().optional(),
    province: z.string().optional(),
    landMark: z.string().optional(),
    country: z.string().optional(),
    zip: z.string().optional(),
    full: z.string().optional(),
    _id: z.string(),
  })
  .optional();

const positionSchema = z.object({
  position: z.string(),
  isCurrent: z.boolean(),
  _id: z.string(),
  timestamp: z.string(),
});
const depIdSchema = z.array(
  z.object({
    _id: z.string(),
    departmentName: z.string(),
  }),
);
const emp_Id_Schema = z.object({
  Designation: z.string().optional(),
  dep_ID: depIdSchema.optional(),
  Avatar: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  _id: z.string(),
});
const payrollIncrementSchema = z.object({
  title: z.string().optional(),
  amount: z.number().optional(),
  date: z.string().optional(),
  _id: z.string().optional(),
});

const employeeListSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  contactNo: z.string(),
  uniqueCode: z.string().optional(),
  roleId: z.number(),
  companyEmail: z.string().email(),
  Ed_Exp_ID: z.array(z.string()).optional(),
  dep_ID: z
    .union([z.array(depIdSchema), depIdSchema])
    .optional()
    .transform(val => (Array.isArray(val) ? val : val ? [val] : [])),
  isDeleted: z.boolean().optional(),
  UniqueCodeExpire: z.string().optional(),
  Blood_Group: z.string().optional(),
  DOB: z.string().optional(),
  Emergency_Phone: z.string().optional(),
  Family_Name: z.string().optional(),
  Family_Occupation: z.string().optional(),
  Family_PhoneNo: z.string().optional(),
  Family_Relation: z.string().optional(),
  Gender: z.string().optional(),
  Marital_Status: z.string().optional(),
  Nationality: z.string().optional(),
  isApproved: z.enum(approvalStatus),
  password: z.string().optional(),
  rejectedReason: z.string().optional(),
  Avatar: z.string().nullable().optional(),
  Current_Status: z.string().optional(),
  profileDescription: z.string().optional(),
  Tahometer_ID: z.string().optional(),
  basicSalary: z.number(),
  desiredSalary: z.number().optional(),
  activeStatus: z.boolean().optional(),
  updatedAt: z.string(),
  position: z.array(positionSchema).optional(),
  Joining_Date: z.string().nullable().optional(),
  otp: z.string().optional(),
  otpExpires: z.string().optional(),
  Address: addressSchema,
  Designation: z.string().optional(),
  createdAt: z.string().optional(),
  __v: z.number().optional(),
  type: z.literal('employee').optional(),
});

const employeePayrollSchema = z.object({
  _id: z.string(),
  Emp_ID: emp_Id_Schema.nullable(),
  User_ID: z.string().optional(),
  Employee_Name: z.string().optional(),
  Date: z.string().optional(),
  Basic_Salary: z.number().optional(),
  Tax_Amount: z.number().optional(),
  Absent_Deduction: z.number().optional(),
  Today_Days_Present: z.number().optional(),
  Total_Absent: z.number().optional(),
  Total_Leaves: z.number().optional(),
  Leaves: z
    .object({
      casual: z.number().optional(),
      sick: z.number().optional(),
      annual: z.number().optional(),
      unpaid: z.number().optional(),
    })
    .optional(),
  Late: z.number().optional(),
  Total_Minutes_Monthly: z.number().optional(),
  Total_Remaining_Minutes: z.number().optional(),
  Net_Salary: z.number().optional(),
  Total_SalaryDeducton: z.number().optional(),
  Total_Working_Minutes: z.number().optional(),
  Pay_Status: z.string().optional(),
  Paid_Amount: z.number().optional(),
  Working_Days: z.number().optional(),
  isDeleted: z.boolean().optional(),
  Increments: z.array(payrollIncrementSchema).optional(),
  __v: z.number().optional(),
  // type: z.literal('employeePayroll').optional(),
  type: z.string().optional(),
  perks: z
    .object({
      increments: z.array(
        z.object({
          name: z.string(),
          amount: z.number(),
        }),
      ),
      decrements: z.array(
        z.object({
          name: z.string(),
          amount: z.number(),
        }),
      ),
    })
    .optional(),
  totalPerkDecrement: z.number().optional(),
  totalPerkIncrement: z.number().optional(),
  overtimeMinute: z.number().optional(),
  totalOvertime: z.number().optional(),
  shortMinutes: z.number().optional(),
  shortMinutesDeduction: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const hrEventsSchema = z.object({
  _id: z.string(),
  hrId: z.string().optional(),
  Event_Name: z.string().optional(),
  Event_Start: z.string().optional(),
  Event_End: z.string().optional(),
  Event_Discription: z.string().optional(),
  isDeleted: z.boolean().optional(),
  isEnabled: z.boolean().optional(),
  Event_Type: z.string().optional(),
  __v: z.number().optional(),
});

const EmployeeChart = z.object({
  month: z.string(),
  added: z.number(),
  resigned: z.number(),
  fired: z.number(),
});

const cardDataSchema = z.object({
  Card2Data: z.object({
    pending: z.number(),
    tba: z.number(),
    rejected: z.number(),
    approved: z.number(),
    internees: z.number(),
  }),
  Card3Data: z.object({
    tba: z.object({
      expired: z.number(),
      pending: z.number(),
    }),
    Rejected: z.object({
      expired: z.number(),
      pending: z.number(),
    }),
  }),
  employeeChart: z.array(EmployeeChart),
});

const employeeDobDataSchema = z.array(
  z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    Avatar: z.string().optional(),
    DOB: z.string().optional(),
    Joining_Date: z.string().optional(),
    remainingDays: z.number(),
  }),
);

const employeeDobTableSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  DOB: z.string().optional(),
  Joining_Date: z.string().optional(),
  remainingDays: z.number(),
});

const employeeIdSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  companyEmail: z.string(),
  Avatar: z.string().optional(),
  Designation: z.string().optional(),
  contactNo: z.string().optional(),
});

const hrIdSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  Avatar: z.string().optional(),
  companyEmail: z.string().optional(),
});

const resignedSchema = z.object({
  _id: z.string(),
  employee: employeeIdSchema.optional(),
  hr: hrIdSchema.optional(),
  title: z.string(),
  reason: z.string(),
  description: z.string(),
  appliedDate: z.string().optional(),
  assignedDate: z.string().optional(),
  immedaiteDate: z.string().optional(),
  isApproved: z.enum(resignedStatus).optional(),
  type: z.string().optional(),
  isResigned: z.boolean().optional(),
  isFired: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  __v: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
const monthlyChartSchema = z.object({
  month: z.string(),
  Net_Salary: z.number(),
});
const employeeApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(employeeListSchema),
});

const employeeFiredResignedApiResponseSchema = z.object({
  pagination: paginationSchema,
  totalPendingCount: z.number(),
  data: z.array(employeeListSchema),
});

const employeePayrollApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(employeePayrollSchema),
});

const employeePayrollChartApiResponseSchema = z.object({
  monthlyPayroll: z.array(monthlyChartSchema),
});

export type EmployeePayrollApiResponse = z.infer<
  typeof employeePayrollApiResponseSchema
>;

export type EmployeePayrollChartApiResponse = z.infer<
  typeof employeePayrollChartApiResponseSchema
>;

const employeeDobApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: employeeDobDataSchema,
});
const hrEventsApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(hrEventsSchema),
});

const resignedApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(resignedSchema),
});

const pendingResignedApiResponseSchema = z.object({
  totalCount: z.number(),
  data: z.array(resignedSchema),
});

const deviceChartSchema = z.object({
  month: z.string(),
  desktop: z.number(),
  mobile: z.number(),
});
const deviceChartApiResponseSchema = z.object({
  data: z.array(deviceChartSchema),
});
export type DeviceChartApiResponse = z.infer<
  typeof deviceChartApiResponseSchema
>;

export type ResignedListApiResponse = z.infer<typeof resignedApiResponseSchema>;
export type PendingResignedListApiResponse = z.infer<
  typeof pendingResignedApiResponseSchema
>;
export type EmployeeFiredResignedApiResponse = z.infer<
  typeof employeeFiredResignedApiResponseSchema
>;
export type ResignedListType = z.infer<typeof resignedSchema>;
export type ResignedListArrayType = z.infer<typeof resignedSchema>[] | [];

export type EmployeeApiResponse = z.infer<typeof employeeApiResponseSchema>;
export type HrEventsApiResponse = z.infer<typeof hrEventsApiResponseSchema>;
export type EmployeeListType = z.infer<typeof employeeListSchema>;
export type EmployeeListArrayType = z.infer<typeof employeeListSchema>[] | [];
export type EmployeeDobTableListArrayType =
  | z.infer<typeof employeeDobTableSchema>[]
  | [];
export type EmployeePayrollListType = z.infer<typeof employeePayrollSchema>;
export type EmployeeDobTableListType = z.infer<typeof employeeDobTableSchema>;
export type EmpDobListType = z.infer<typeof employeeDobDataSchema>;
export type HrEventsListType = z.infer<typeof hrEventsSchema>;
export type EmployeePayrollArrayType =
  | z.infer<typeof employeePayrollSchema>[]
  | [];

export {
  employeeApiResponseSchema,
  employeeListSchema,
  paginationSchema,
  addressSchema,
  positionSchema,
  employeePayrollSchema,
  employeePayrollApiResponseSchema,
  hrEventsApiResponseSchema,
  resignedSchema,
  resignedApiResponseSchema,
  hrIdSchema,
  employeeIdSchema,
  cardDataSchema,
  employeeDobDataSchema,
  employeeDobApiResponseSchema,
  pendingResignedApiResponseSchema,
  employeeFiredResignedApiResponseSchema,
  employeePayrollChartApiResponseSchema,
  deviceChartApiResponseSchema,
};
