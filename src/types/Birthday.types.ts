export interface Birthday {
  id: number;
  firstName: string;
  lastName: string;
  DOB: string;
  Avatar?: string;
  daysUntilBirthday: number;
}

export interface BirthdayResponse {
  message: string;
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  data: Birthday[];
}
