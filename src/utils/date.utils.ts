export const formatDateToDayMonthYear = (date: Date) => {
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.toLocaleString(
    'default',
    {
      year: 'numeric',
    },
  )}`;
};
