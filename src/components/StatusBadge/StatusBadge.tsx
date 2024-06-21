import { FC } from 'react';

import { InfoIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge, BadgeProps } from '@/components/ui/badge';

import { StatusBadgeProps } from './types';

import { ReplicaStatus, VideoStatus } from '@/types';

const statusTextMap: { [key in VideoStatus | ReplicaStatus]: string } = {
  [VideoStatus.GENERATING]: 'general.statusBadge.generating',
  [VideoStatus.QUEUED]: 'general.statusBadge.generating',
  [VideoStatus.READY]: 'general.statusBadge.ready',
  [VideoStatus.ERROR]: 'general.statusBadge.error',
  [VideoStatus.DELETED]: 'general.statusBadge.error',
  [ReplicaStatus.STARTED]: 'general.statusBadge.training',
  [ReplicaStatus.COMPLETED]: 'general.statusBadge.completed',
};

const badgeVariantMap: { [key in VideoStatus | ReplicaStatus]: string } = {
  [VideoStatus.GENERATING]: 'progress',
  [VideoStatus.QUEUED]: 'progress',
  [VideoStatus.READY]: 'success',
  [VideoStatus.ERROR]: 'error',
  [VideoStatus.DELETED]: 'general.statusBadge.error',
  [ReplicaStatus.STARTED]: 'progress',
  [ReplicaStatus.COMPLETED]: 'success',
};

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation();
  return (
    <Badge variant={badgeVariantMap[status] as BadgeProps['variant']}>
      {t(statusTextMap[status])}{' '}
      {(status === VideoStatus.ERROR || status === ReplicaStatus.ERROR) && (
        <InfoIcon className="ml-1 size-4 text-destructive" />
      )}
    </Badge>
  );
};

export { StatusBadge };
