export interface CopyApiUrlProps {
  type: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: string;
  id?: string;
}
