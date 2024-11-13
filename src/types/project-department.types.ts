export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface userType {
  _id: string;
  firstName: string;
  lastName: string;
  companyEmail?: string;
  Avatar?: string;
  Designation?: string;
  contactNo?: string;
}

export interface Projects {
  _id: string;
  __v: number;
  projectName?: string;
  projectTitle: string;
  projectDescription?: string;
  techStack?: string[];
  startDate?: string;
  endDate?: string;
  deadline?: string;
  teamMembers?: userType[];
  updatedBy?: userType;
  teamLead?: userType;
  status?:
    | 'Not Started'
    | 'Completed'
    | 'In Progress'
    | 'Overdue'
    | 'Pending'
    | 'Cancelled';
  isActive?: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface Head {
  user?: userType;
  isCurrent: boolean;
  appointDate: string;
  endDate?: string;
}
export interface ProjectSchema {
  _id?: string;
  projectName?: string;
  projectTitle?: string;
  techStack?: string[];
  startDate?: string;
  status?:
    | 'Not Started'
    | 'Completed'
    | 'In Progress'
    | 'Overdue'
    | 'Pending'
    | 'Cancelled';
}

export interface Departments {
  _id: string;
  __v: number;
  departmentName?: string;
  departmentHead?: Head[];
  departmentDirector?: Head[];
  employees?: userType[];
  projects?: ProjectSchema[];
  updatedBy?: userType;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface ProjectsList {
  _id: string;
  projectName: string;
}
export interface DepartmentList {
  _id: string;
  departmentName: string;
}
export interface TrendChartData {
  month: string;
  notStarted: number;
  inProgress: number;
  overdue: number;
  completed: number;
  pending: number;
  cancelled: number;
}
export interface TopChartData {
  department: string;
  employees: number;
}
export interface OverviewChartData {
  department: string;
  projects: number;
  employees: number;
}

export interface ProjectApiResponse {
  pagination: Pagination;
  data: Projects[];
}

export interface ProjectListApiResponse {
  data: ProjectsList[];
}

export interface DepartmentApiResponse {
  pagination: Pagination;
  data: Departments[];
}

export interface DepartmentListApiResponse {
  data: DepartmentList[];
}

export interface ProjectChartApiResponse {
  data: TrendChartData[];
  statistics: {
    totalCount: number;
    pendingCount: number;
    completedCount: number;
    inProgressCount: number;
    cancelledCount: number;
    notStartedCount: number;
    overdueCount: number;
  };
  records: {
    activeCount: number;
    inactiveCount: number;
  };
}

export interface DepartmentChartApiResponse {
  topChart: TopChartData[];
  Overiew: OverviewChartData[];
}
