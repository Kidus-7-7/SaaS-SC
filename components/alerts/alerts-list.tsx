import { useState } from 'react';
import { PropertyAlert } from '@/types/alerts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { formatDistanceToNow } from 'date-fns';

type AlertsListProps = {
  alerts: PropertyAlert[];
  onToggleAlert: (alertId: string, enabled: boolean) => Promise<void>;
  onDeleteAlert: (alertId: string) => Promise<void>;
  onEditAlert: (alert: PropertyAlert) => void;
};

export function AlertsList({
  alerts,
  onToggleAlert,
  onDeleteAlert,
  onEditAlert,
}: AlertsListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleToggle = async (alertId: string, enabled: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [alertId]: true }));
    try {
      await onToggleAlert(alertId, enabled);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [alertId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{alert.name}</CardTitle>
                <CardDescription>
                  Created {formatDistanceToNow(new Date(alert.created_at))} ago
                </CardDescription>
              </div>
              <Switch
                checked={alert.enabled}
                disabled={loadingStates[alert.id]}
                onCheckedChange={(checked) => handleToggle(alert.id, checked)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Price Range</p>
                <p>
                  {alert.min_price
                    ? `${alert.min_price.toLocaleString()} ETB`
                    : 'Any'}{' '}
                  -{' '}
                  {alert.max_price
                    ? `${alert.max_price.toLocaleString()} ETB`
                    : 'Any'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Property Type</p>
                <p>
                  {alert.property_type?.length
                    ? alert.property_type.join(', ')
                    : 'Any'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Bedrooms</p>
                <p>{alert.min_bedrooms ? `${alert.min_bedrooms}+` : 'Any'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Area</p>
                <p>
                  {alert.min_area_sqm
                    ? `${alert.min_area_sqm}+ sqm`
                    : 'Any'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditAlert(alert)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDeleteAlert(alert.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
