import { Property } from './property';
import { User } from './user';

export type RentalApplicationStatus = 'pending' | 'approved' | 'rejected';
export type MaintenanceRequestStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface TenantApplication {
  id: string;
  propertyId: string;
  applicantId: string;
  status: RentalApplicationStatus;
  applicationDate: string;
  monthlyIncome: number;
  employmentDetails: {
    employer: string;
    position: string;
    startDate: string;
    monthlyIncome: number;
  };
  rentalHistory: {
    previousAddress: string;
    landlordName: string;
    landlordContact: string;
    rentAmount: number;
    startDate: string;
    endDate: string;
  }[];
  creditScore: number;
  backgroundCheck: {
    completed: boolean;
    passedCheck: boolean;
    reportUrl?: string;
  };
  documents: {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: MaintenanceRequestStatus;
  category: string;
  images: string[];
  assignedTo?: string;
  scheduledDate?: string;
  completedDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RentPayment {
  id: string;
  propertyId: string;
  tenantId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
  lateFee?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantCommunication {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  subject: string;
  message: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyDocument {
  id: string;
  propertyId: string;
  name: string;
  type: 'lease' | 'insurance' | 'inspection' | 'tax' | 'other';
  url: string;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FinancialRecord {
  id: string;
  propertyId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
