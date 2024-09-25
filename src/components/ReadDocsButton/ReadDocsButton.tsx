import { cn } from '@/utils';

import { Button } from '../ui/button';

const BASE_DOCS_URL = 'https://docs.tavus.io';

const DOCS_ROUTES = {
  home: BASE_DOCS_URL,
  videoCreate: `${BASE_DOCS_URL}/api-reference/video-request/create-video`,
  videoLibrary: `${BASE_DOCS_URL}/api-reference/video-request/get-videos`,
  videoDetails: `${BASE_DOCS_URL}/api-reference/video-request/get-video`,
  replicaCreate: `${BASE_DOCS_URL}/api-reference/phoenix-replica-model/create-replica`,
  replicaLibrary: `${BASE_DOCS_URL}/api-reference/phoenix-replica-model/get-replicas`,
  replicaDetails: `${BASE_DOCS_URL}/api-reference/phoenix-replica-model/get-replica`,
  apiReference: `${BASE_DOCS_URL}/api-reference`,
  conversationLibrary: `${BASE_DOCS_URL}/api-reference/conversations/get-conversation`,
  conversationCreate: `${BASE_DOCS_URL}/api-reference/conversations/create-conversation`,
  personaLibrary: `${BASE_DOCS_URL}/api-reference/personas/get-persona`,
  personaCreate: `${BASE_DOCS_URL}/api-reference/personas/create-persona`,
} as const;

interface ReadDocsButtonProps {
  to: keyof typeof DOCS_ROUTES;
  className?: string;
  children?: React.ReactNode;
}

export const ReadDocsButton: React.FC<ReadDocsButtonProps> = ({
  to,
  className,
  children = 'Notification',
}) => {
  return (
    <Button variant="outline" className={cn('ml-auto', className)} asChild>
      <a target="_blank" rel="noopener noreferrer" href={DOCS_ROUTES[to]}>
        {children}
      </a>
    </Button>
  );
};
