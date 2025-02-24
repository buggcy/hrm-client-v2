import { z } from 'zod';

export const projectStatus = [
  'Not Started',
  'Completed',
  'In Progress',
  'Overdue',
  'Pending',
  'Cancelled',
] as const;

const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const userIdSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  companyEmail: z.string().optional(),
  Avatar: z.string().optional(),
  Designation: z.string().optional(),
  contactNo: z.string().optional(),
});

const projectSchema = z.object({
  _id: z.string(),
  __v: z.number(),
  updatedBy: userIdSchema.optional(),
  teamLead: userIdSchema.nullable().optional(),
  teamMembers: z.array(userIdSchema).optional(),
  deletedMembers: z.array(userIdSchema).optional(),
  status: z.enum(projectStatus).optional(),
  projectName: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  deadline: z.string().optional(),
  projectTitle: z.string().optional(),
  projectDescription: z.string().optional(),
  cancellationReason: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  isDeleted: z.boolean(),
  isActive: z.boolean().optional(),
  isContinue: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
const projectIdSchema = z.object({
  _id: z.string().optional(),
  status: z.enum(projectStatus).optional(),
  projectName: z.string().optional(),
  startDate: z.string().optional(),
  projectTitle: z.string().optional(),
  techStack: z.array(z.string()).optional(),
});
const headSchema = z.object({
  user: userIdSchema.nullable().optional(),
  isCurrent: z.boolean(),
  appointDate: z.string(),
  endDate: z.string().optional(),
});
const departmentSchema = z.object({
  _id: z.string(),
  __v: z.number(),
  employees: z.array(userIdSchema).optional(),
  projects: z.array(projectIdSchema).optional(),
  deletedEmployees: z.array(userIdSchema).optional(),
  deletedProjects: z.array(projectIdSchema).optional(),
  departmentName: z.string().optional(),
  departmentHead: z.array(headSchema).optional(),
  departmentDirector: z.array(headSchema).optional(),
  isDeleted: z.boolean(),
  updatedBy: userIdSchema.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const projectListSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
});

const departmentListSchema = z.object({
  _id: z.string(),
  departmentName: z.string(),
});

const ProjectOverviewChartSchema = z.object({
  projectName: z.string(),
  deletedMembers: z.number(),
  team: z.number(),
});

const statisticsSchema = z.object({
  totalCount: z.number(),
  pendingCount: z.number(),
  completedCount: z.number(),
  inProgressCount: z.number(),
  cancelledCount: z.number(),
  notStartedCount: z.number(),
  overdueCount: z.number(),
});

const recordsSchema = z.object({
  activeCount: z.number(),
  inactiveCount: z.number(),
});

const TopChartSchema = z.object({
  department: z.string(),
  employees: z.number(),
});

const OverviewChartSchema = z.object({
  department: z.string(),
  projects: z.number(),
  deletedEmployees: z.number(),
  deleteProjects: z.number(),
});

const projectApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(projectSchema),
});

const projectListApiResponseSchema = z.object({
  data: z.array(projectListSchema),
});

const ProjectChartApiResponseSchema = z.object({
  data: z.array(ProjectOverviewChartSchema),
  statistics: statisticsSchema,
  records: recordsSchema,
});

const departmentApiResponseSchema = z.object({
  pagination: paginationSchema,
  data: z.array(departmentSchema),
});

const departmentListApiResponseSchema = z.object({
  data: z.array(departmentListSchema),
});

const DepartmentChartApiResponseSchema = z.object({
  topChart: z.array(TopChartSchema),
  Overiew: z.array(OverviewChartSchema),
});

export type ProjectListApiResponse = z.infer<typeof projectApiResponseSchema>;
export type ProjectListType = z.infer<typeof projectSchema>;
export type ProjectListArrayType = z.infer<typeof projectSchema>[] | [];

export type DepartmentListApiResponse = z.infer<
  typeof departmentApiResponseSchema
>;
export type DepartmentListType = z.infer<typeof departmentSchema>;
export type DepartmentListArrayType = z.infer<typeof departmentSchema>[] | [];

export type ProjectApiResponse = z.infer<typeof projectListApiResponseSchema>;

export type ProjectChartType = z.infer<typeof ProjectOverviewChartSchema>;
export type ProjectChartApiResponse = z.infer<
  typeof ProjectChartApiResponseSchema
>;

export type DepartmentApiResponse = z.infer<
  typeof departmentListApiResponseSchema
>;

export type DepartmentTopChartType = z.infer<typeof TopChartSchema>;
export type DepartmentOverviewChartType = z.infer<typeof OverviewChartSchema>;

export type DepartmentChartApiResponse = z.infer<
  typeof DepartmentChartApiResponseSchema
>;

export {
  OverviewChartSchema,
  TopChartSchema,
  DepartmentChartApiResponseSchema,
  projectApiResponseSchema,
  ProjectChartApiResponseSchema,
  departmentListApiResponseSchema,
  userIdSchema,
  paginationSchema,
  departmentSchema,
  projectSchema,
  statisticsSchema,
  recordsSchema,
  departmentApiResponseSchema,
  headSchema,
  projectListApiResponseSchema,
  projectListSchema,
  ProjectOverviewChartSchema,
};
