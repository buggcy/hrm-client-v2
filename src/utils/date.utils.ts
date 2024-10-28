import { format } from 'date-fns';

export const formatDateToDayMonthYear = (date: string | number | Date) =>
  format(date, 'd MMMM yyyy');

export const formatedDate = (date: string | number | Date | undefined) => {
  return date ? new Date(date).toLocaleDateString('en-CA') : '';
};

export const formatedTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
