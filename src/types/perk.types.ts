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
  hrApproval: 'approved' | 'rejected' | 'pending';
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
