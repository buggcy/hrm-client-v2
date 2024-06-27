import { isProd } from '@/constants';

import { IReplica, ReplicaStatus, ReplicaType } from '@/types';

export const DEFAULT_REPLICA: IReplica = {
  // TODO: replace with actual data
  replica_id: isProd ? 'r445a7952e' : 'r2a0fd8fc8',
  replica_name: isProd ? 'Bailey' : 'Quinn Avatar',
  replica_type: ReplicaType.STUDIO,
  status: ReplicaStatus.COMPLETED,
  created_at: new Date(),
  updated_at: new Date(),
  training_progress: '100',
  thumbnail_video_url: isProd
    ? 'https://ai-avatar-videos-prod.s3.us-east-1.amazonaws.com/614/29e5a357.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZX2SRGORQHLT4LEF%2F20240627%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240627T160817Z&X-Amz-Expires=604800&X-Amz-Signature=08ca006711c5298aa2f6c9b348a9a439d1de35ab6080678c117dc17015f62685&X-Amz-SignedHeaders=host&x-id=GetObject'
    : 'https://ai-avatar-videos-dev.s3.us-east-1.amazonaws.com/8175/177b9624.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZX2SRGORQHLT4LEF%2F20240621%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240621T161314Z&X-Amz-Expires=604800&X-Amz-Signature=110754d904354386ec9b78f84e3294bf33e68a5f84916b24b21cc9cc5adf994d&X-Amz-SignedHeaders=host&x-id=GetObject',
};
