import { FC } from 'react';
import { useRouter } from 'next/navigation';

import { format } from 'date-fns';

import { CopyRequestID } from '@/components/CopyRequestID';

import { DeletePersonaBtn } from '../DeletePersonaBtn';

import { IPersona } from '@/types';

const Item = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-full max-w-38.5">
      <p className="text-sm font-semibold">{label}</p>
    </div>
    <div className="w-full">{children}</div>
  </div>
);

export const PersonaInfoBlock: FC<{
  created_at?: IPersona['created_at'];
  name?: IPersona['persona_name'];
  persona_id?: IPersona['persona_id'];
  replica_id?: IPersona['default_replica_id'];
  withDelete?: boolean;
}> = ({ created_at, name, persona_id, replica_id, withDelete }) => {
  const router = useRouter();

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-xl font-semibold">{name}</h3>
        {withDelete && (
          <DeletePersonaBtn
            id={persona_id}
            onDeleted={() => {
              router.push('/conversations');
            }}
          />
        )}
      </div>

      <div className="space-y-4">
        {persona_id && (
          <Item label="Persona ID">
            <CopyRequestID id={persona_id} />
          </Item>
        )}
        {replica_id && (
          <Item label="Replica ID">
            <CopyRequestID id={replica_id} />
          </Item>
        )}
        <Item label="Created">
          <p className="text-sm font-medium">
            {created_at && format(created_at, 'MMMM d, h:mm aaa')}
          </p>
        </Item>
      </div>
    </div>
  );
};
