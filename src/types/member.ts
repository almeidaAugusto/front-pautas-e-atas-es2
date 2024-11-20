export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'member';
}