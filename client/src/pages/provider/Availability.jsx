import React, { useState, useEffect } from 'react';
import { Clock, Save } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { providerAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { providerSidebarItems } from './Dashboard';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const SLOT_OPTS = [
  { value: '30', label: '30 minutes' },
  { value: '60', label: '60 minutes (1 hr)' },
  { value: '90', label: '90 minutes (1.5 hr)' },
  { value: '120', label: '120 minutes (2 hr)' },
];

const defaultDay = { isAvailable: false, startTime: '09:00', endTime: '18:00' };

const Availability = () => {
  const { showToast } = useToast();
  const [availability, setAvailability] = useState(
    Object.fromEntries(DAYS.map(d => [d, { ...defaultDay }]))
  );
  const [slotDuration, setSlotDuration] = useState('60');
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    providerAPI.getMyProfile().then(res => {
      const profile = res.data.data;
      if (profile?.availability) setAvailability(profile.availability);
      if (profile?.slotDuration) setSlotDuration(String(profile.slotDuration));
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const toggleDay = (day) => setAvailability(prev => ({ ...prev, [day]: { ...prev[day], isAvailable: !prev[day].isAvailable } }));
  const setTime = (day, field, val) => setAvailability(prev => ({ ...prev, [day]: { ...prev[day], [field]: val } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await providerAPI.updateAvailability({ availability, slotDuration: Number(slotDuration) });
      showToast('success', 'Availability updated!');
    } catch (e) { showToast('error', 'Failed to update availability'); }
    finally { setSaving(false); }
  };

  if (isLoading) return <DashboardLayout sidebarItems={providerSidebarItems} title="Availability"><div className="animate-pulse space-y-4">{Array.from({length:7}).map((_,i)=><div key={i} className="card h-16"/>)}</div></DashboardLayout>;

  return (
    <DashboardLayout sidebarItems={providerSidebarItems} title="Availability">
      <div className="max-w-2xl space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-5 flex items-center gap-2"><Clock className="h-5 w-5 text-accent" />Weekly Schedule</h2>
          <div className="space-y-3">
            {DAYS.map(day => {
              const info = availability[day] || defaultDay;
              return (
                <div key={day} className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${info.isAvailable ? 'border-accent/30 bg-accent/5' : 'border-border-color'}`}>
                  <label className="flex items-center gap-3 cursor-pointer w-28 shrink-0">
                    <div
                      onClick={() => toggleDay(day)}
                      className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${info.isAvailable ? 'bg-accent' : 'bg-bg-surface-2 border border-border-color'}`}
                    >
                      <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${info.isAvailable ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm font-medium text-text-primary capitalize">{day.slice(0,3)}</span>
                  </label>
                  {info.isAvailable ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input type="time" value={info.startTime} onChange={e => setTime(day, 'startTime', e.target.value)} className="input-field text-sm py-1.5 flex-1" />
                      <span className="text-text-muted text-sm">to</span>
                      <input type="time" value={info.endTime} onChange={e => setTime(day, 'endTime', e.target.value)} className="input-field text-sm py-1.5 flex-1" />
                    </div>
                  ) : (
                    <span className="text-text-muted text-sm">Closed</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Slot Duration</h2>
          <Select options={SLOT_OPTS} value={slotDuration} onChange={e => setSlotDuration(e.target.value)} label="How long is each booking slot?" />
        </div>

        <Button variant="primary" size="lg" onClick={handleSave} isLoading={saving}>
          <Save className="h-4 w-4 mr-2" /> Save Availability
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Availability;
