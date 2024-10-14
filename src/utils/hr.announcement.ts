export const getBadgeColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-500';
    case 'Medium':
      return 'bg-yellow-500';
    case 'Low':
      return 'bg-green-500';
    default:
      return '';
  }
};

export const getStatusBadgeColor = (isEnabled: boolean) => {
  return isEnabled ? 'bg-green-500' : 'bg-red-500';
};
