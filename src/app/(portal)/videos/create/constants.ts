import { isProd } from '@/constants';

import { IReplica, ReplicaStatus, ReplicaType } from '@/types';

export const DEFAULT_REPLICA: IReplica = {
  replica_id: isProd ? 'r79e1c033f' : 'r257a3e4d8',
  replica_name: isProd ? 'Carter' : 'Quinn Avatar',
  replica_type: ReplicaType.STUDIO,
  status: ReplicaStatus.COMPLETED,
  created_at: '2024-08-12T19:22:43.761Z',
  updated_at: '2024-08-13T01:44:24.433Z',
  training_progress: '100/100',
  thumbnail_video_url: isProd
    ? 'https://cdn.replica.tavus.io/4967/b93cfa96.mp4'
    : 'https://test.cdn.replica.tavus.io/8175/177b9624.mp4',
};
