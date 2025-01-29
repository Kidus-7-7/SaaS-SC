-- Create enum for alert frequency
CREATE TYPE alert_frequency AS ENUM ('instant', 'daily', 'weekly');

-- Create property alerts table
CREATE TABLE property_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    property_type TEXT[],
    min_price INTEGER,
    max_price INTEGER,
    min_bedrooms INTEGER,
    min_bathrooms INTEGER,
    min_area_sqm INTEGER,
    location JSONB,
    frequency alert_frequency NOT NULL DEFAULT 'daily',
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_notified_at TIMESTAMPTZ,
    CONSTRAINT valid_price_range CHECK (
        (min_price IS NULL AND max_price IS NULL) OR
        (min_price IS NULL AND max_price IS NOT NULL) OR
        (min_price IS NOT NULL AND max_price IS NULL) OR
        (min_price <= max_price)
    )
);

-- Create alert notifications table
CREATE TABLE alert_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID NOT NULL REFERENCES property_alerts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    UNIQUE(alert_id, property_id)
);

-- Create indexes
CREATE INDEX idx_property_alerts_user ON property_alerts(user_id);
CREATE INDEX idx_property_alerts_enabled ON property_alerts(enabled) WHERE enabled = true;
CREATE INDEX idx_alert_notifications_status ON alert_notifications(status) WHERE status = 'pending';
CREATE INDEX idx_alert_notifications_user ON alert_notifications(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_property_alerts_updated_at
    BEFORE UPDATE ON property_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE property_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own alerts
CREATE POLICY "Users can view their own alerts"
    ON property_alerts FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own alerts
CREATE POLICY "Users can insert their own alerts"
    ON property_alerts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own alerts
CREATE POLICY "Users can update their own alerts"
    ON property_alerts FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own alerts
CREATE POLICY "Users can delete their own alerts"
    ON property_alerts FOR DELETE
    USING (auth.uid() = user_id);

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
    ON alert_notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Only service role can insert notifications
CREATE POLICY "Service role can insert notifications"
    ON alert_notifications FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Only service role can update notifications
CREATE POLICY "Service role can update notifications"
    ON alert_notifications FOR UPDATE
    USING (auth.uid() IS NOT NULL);
