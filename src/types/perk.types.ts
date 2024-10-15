export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface Perk {
  _id: string;
  assignedDecrementAmount: number;
  assignedIncrementAmount: number;
  createdAt: string;
  dateApplied: string;
  decisionDate: string;
  decrementAmount: number;
  description: string;
  document: string;
  hrApproval: 'approved' | 'rejected' | 'pending' | 'available';
  incrementAmount: number;
  isAvailable: boolean;
  isAvailed: boolean;
  name: string;
  salaryDecrement: boolean;
  salaryIncrement: boolean;
  updatedAt: string;
  __v: number;
}

export interface PerkApiResponse {
  pagination: Pagination;
  data: Perk[];
}

export interface PerkRecords {
  totalRecords: number;
  totalAvailablePerks: number;
  totalPendingPerks: number;
  totalRejectedPerks: number;
  totalApprovedPerks: number;
  totalIncrementAmount: number;
  totalDecrementAmount: number;
}

export interface PerkAverage {
  averageIncrementAmount: number;
  averageDecrementAmount: number;
}

export interface AvailablePerks {
  _id: string;
  perksId: {
    _id: string;
    name: string;
    salaryIncrement: boolean;
    salaryDecrement: boolean;
    updatedAt: string;
    createdAt: string;
    description: string;
    __v: number;
  };
  assignedIncrementAmount: number;
  hrApproval: 'approved' | 'rejected' | 'pending' | 'available';
  incrementAmount: number;
  isAvailed: boolean;
  assignedDecrementAmount: number;
  decrementAmount: number;
}
export interface PerkRecordApiResponse {
  records: PerkRecords;
  averages: PerkAverage;
  availableData: AvailablePerks[];
  approvedData: AvailablePerks[];
}
