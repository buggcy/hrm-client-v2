import { IReplica } from '@/types';

export interface SelectReplicaDialogProps {
  children: React.ReactNode;
  onChange: (replicaId: IReplica['replica_id']) => void;
  value?: IReplica['replica_id'];
  defaultValue?: IReplica['replica_id'];
}
