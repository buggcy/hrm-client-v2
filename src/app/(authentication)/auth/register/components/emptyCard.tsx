'use client';
interface EmptyCardProps {
  message: string;
}
const EmptyCard: React.FC<EmptyCardProps> = ({ message }) => (
  <div className="mt-40 flex h-full items-center justify-center p-8">
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <span className="text-2xl font-semibold text-foreground">
        No Results Found
      </span>
      <p className="text-gray-500">
        There are no Pending {message} at the moment.
      </p>
    </div>
  </div>
);

export default EmptyCard;
