import { format } from 'date-fns';

export const formatDateToDayMonthYear = (date: string | number | Date) =>
  format(date, 'd MMMM yyyy');

export const formatedDate = (date: string | number | Date | undefined) => {
  return date ? new Date(date).toLocaleDateString('en-CA') : '';
};
