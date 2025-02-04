/**
 * Interface representando um Usuario/Profissional.
 */
export interface User {
  user_id?: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: 'professional' | 'manager';
  status: boolean;
  profile_pictures: string | null;
}
