import { IReplica } from '@/types';

export interface SelectReplicaDialogProps {
  children: React.ReactNode;
  onSubmit: (replica: IReplica) => void;
  defaultReplica?: IReplica;
}
