export interface CopyApiUrlProps {
  type: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: 'video' | 'replica';
  id?: string;
}
