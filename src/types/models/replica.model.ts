import { z } from 'zod';

export enum ReplicaStatus {
  ERROR = 'error',
  STARTED = 'training',
  COMPLETED = 'completed',
}

export enum ReplicaType {
  STUDIO = 'system',
  PERSONAL = 'user',
}

export const IReplica = z.object({
  replica_id: z.string(),
  replica_name: z.string(),
  status: z.nativeEnum(ReplicaStatus).nullable(),
  training_progress: z.string(),
  thumbnail_video_url: z.string().url().nullable(),
  error_message: z.string().nullable().optional(),
  created_at: z.string().transform(str => new Date(str)),
  updated_at: z.string().transform(str => new Date(str)),
  replica_type: z.nativeEnum(ReplicaType),
});

export type IReplica = z.infer<typeof IReplica>;
