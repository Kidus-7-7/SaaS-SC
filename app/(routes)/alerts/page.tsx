'use client';

import { useState } from 'react';
import { AlertForm } from '@/components/alerts/alert-form';
import { AlertsList } from '@/components/alerts/alerts-list';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { PropertyAlert } from '@/types/alerts';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PropertyAlert[]>([]);
  const [editingAlert, setEditingAlert] = useState<PropertyAlert | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const handleCreateAlert = async (data: Partial<PropertyAlert>) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to create alerts',
          variant: 'destructive',
        });
        return;
      }

      const { data: alert, error } = await supabase
        .from('property_alerts')
        .insert([
          {
            ...data,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setAlerts((prev) => [...prev, alert as PropertyAlert]);
      setIsDialogOpen(false);
      toast({
        title: 'Alert created',
        description: 'You will be notified when matching properties are found',
      });
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to create alert. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateAlert = async (data: Partial<PropertyAlert>) => {
    if (!editingAlert) return;

    try {
      const { data: alert, error } = await supabase
        .from('property_alerts')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingAlert.id)
        .select()
        .single();

      if (error) throw error;

      setAlerts((prev) =>
        prev.map((a) =>
          a.id === editingAlert.id ? (alert as PropertyAlert) : a
        )
      );
      setEditingAlert(null);
      setIsDialogOpen(false);
      toast({
        title: 'Alert updated',
        description: 'Your alert preferences have been updated',
      });
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to update alert. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleAlert = async (alertId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('property_alerts')
        .update({ enabled, updated_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, enabled } : alert
        )
      );
      toast({
        title: enabled ? 'Alert enabled' : 'Alert disabled',
        description: enabled
          ? 'You will now receive notifications for this alert'
          : 'You will no longer receive notifications for this alert',
      });
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to update alert. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('property_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
      toast({
        title: 'Alert deleted',
        description: 'Your alert has been deleted',
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete alert. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Property Alerts</h1>
          <p className="text-muted-foreground">
            Get notified when new properties match your criteria
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Alert</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingAlert ? 'Edit Alert' : 'Create New Alert'}
              </DialogTitle>
            </DialogHeader>
            <AlertForm
              initialData={editingAlert || undefined}
              onSubmit={editingAlert ? handleUpdateAlert : handleCreateAlert}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AlertsList
        alerts={alerts}
        onToggleAlert={handleToggleAlert}
        onDeleteAlert={handleDeleteAlert}
        onEditAlert={(alert) => {
          setEditingAlert(alert);
          setIsDialogOpen(true);
        }}
      />
    </div>
  );
}
