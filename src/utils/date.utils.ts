import { format } from 'date-fns';

export const formatDateToDayMonthYear = (date: string | number | Date) =>
  format(date, 'd MMMM yyyy');
