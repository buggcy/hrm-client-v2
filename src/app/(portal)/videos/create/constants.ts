import { isProd } from '@/constants';

import { IReplica, ReplicaStatus, ReplicaType } from '@/types';

export const DEFAULT_REPLICA: IReplica = {
  replica_id: isProd ? 'r243eed46c' : 'r257a3e4d8',
  replica_name: isProd ? 'Steph' : 'Quinn Avatar',
  replica_type: ReplicaType.STUDIO,
  status: ReplicaStatus.COMPLETED,
  created_at: '2024-06-27T16:08:17.000Z',
  updated_at: '2024-06-27T16:08:17.000Z',
  training_progress: '100/100',
  thumbnail_video_url: isProd
    ? 'https://cdn.replica.tavus.io/613/62ca3e4e.mp4'
    : 'https://test.cdn.replica.tavus.io/8175/177b9624.mp4',
};
