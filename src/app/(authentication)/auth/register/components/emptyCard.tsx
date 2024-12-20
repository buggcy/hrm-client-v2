'use client';
interface EmptyCardProps {
  message: string;
}
const EmptyCard: React.FC<EmptyCardProps> = ({ message }) => (
  <div className="mt-40 flex h-full items-center justify-center p-8">
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-xl">
        <span className="font-bold">No Results Found</span>
      </h1>
      <p className="text-sm text-gray-500">
        There are no Pending {message} at the moment.
      </p>
    </div>
  </div>
);

export default EmptyCard;
