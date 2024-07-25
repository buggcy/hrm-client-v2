import { useUserQuery } from '@/hooks';

export const ConsentScript = () => {
  const { data: user } = useUserQuery();
  return (
    <div className="rounded-md border p-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold">Consent Script</h3>
        <div className="flex flex-col gap-6 text-lg font-medium">
          <span className="text-muted-foreground">{`<Keep lips closed and look into the camera for 1 second>`}</span>
          <p>
            I, {user?.first_name} {user?.last_name}, am currently speaking and
            consent Tavus to create an AI clone of me by using the audio and
            video samples I provide. I understand that this AI clone can be used
            to create videos that look and sound like me.
          </p>
        </div>
      </div>
    </div>
  );
};
