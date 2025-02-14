export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'tenant' | 'landlord' | 'admin';
  profileImage?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}