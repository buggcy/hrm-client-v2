import { URLS } from '@/components/CopyApiUrl/constants';

export interface CopyApiUrlProps {
  type: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: keyof typeof URLS;
  id?: string;
  className?: string;
}
