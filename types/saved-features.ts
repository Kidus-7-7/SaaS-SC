import { Property } from './property';
import { SearchFilters } from './search';

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: SearchFilters;
  notificationFrequency: 'daily' | 'weekly' | 'never';
  lastNotificationSent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyComparison {
  id: string;
  userId: string;
  propertyIds: string[];
  properties?: Property[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyNotification {
  id: string;
  userId: string;
  savedSearchId: string;
  propertyId: string;
  type: 'new_property' | 'price_change' | 'status_change';
  message: string;
  read: boolean;
  createdAt: string;
  property?: Property;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  frequency: 'daily' | 'weekly' | 'never';
}
