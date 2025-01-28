export type AlertFrequency = 'instant' | 'daily' | 'weekly';

export type PropertyAlert = {
  id: string;
  user_id: string;
  name: string;
  property_type?: string[];
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  min_bathrooms?: number;
  min_area_sqm?: number;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  frequency: AlertFrequency;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  last_notified_at?: string;
};

export type AlertNotification = {
  id: string;
  alert_id: string;
  user_id: string;
  property_id: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
  sent_at?: string;
};
