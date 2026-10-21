import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ArrowRight, Calendar, Clock, MapPin, IndianRupee, Truck } from 'lucide-react';
import { providerAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import LoadingSpinner, { PageLoader } from '../components/ui/LoadingSpinner';

const STEPS = ['Select Service', 'Pick Date', 'Pick Time', 'Your Address', 'Confirm'];

const BookingFlowPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selected, setSelected] = useState({
    service: null,
    date: '',
    slot: null,
    address: { street: '', city: '', state: '', pincode: '', landmark: '' },
    notes: '',
  });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const load = async () => {
      setIsLoading(true);
      try {
        const [pRes, sRes] = await Promise.all([providerAPI.getById(providerId), providerAPI.getServices(providerId)]);
        setProvider(pRes.data.data);
        setServices(sRes.data.data || []);
      } catch (e) { showToast('error', 'Failed to load provider'); navigate(-1); }
      finally { setIsLoading(false); }
    };
    load();
  }, [providerId, isAuthenticated]);

  useEffect(() => {
    if (step === 2 && selected.date) {
      setSlotsLoading(true);
      providerAPI.getSlots(providerId, selected.date)
        .then(res => setSlots(res.data.data || []))
        .catch(() => setSlots([]))
        .finally(() => setSlotsLoading(false));
    }
  }, [step, selected.date, providerId]);

  const canNext = () => {
    if (step === 0) return !!selected.service;
    if (step === 1) return !!selected.date;
    if (step === 2) return !!selected.slot;
    if (step === 3) return selected.address.street && selected.address.city && selected.address.pincode;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        provider: provider._id,
        service: selected.service._id,
        scheduledDate: selected.date,
        startTime: selected.slot.time,
        endTime: selected.slot.endTime,
        address: selected.address,
        customerNotes: selected.notes,
        price: selected.service.price,
        paymentMethod: 'cod',
      };
      const res = await bookingAPI.create(payload);
      showToast('success', 'Booking created successfully!');
      navigate('/dashboard/bookings');
    } catch (e) {
      showToast('error', e.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <PageLoader />;

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-bg-primary py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </button>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${i <= step ? 'text-accent' : 'text-text-muted'}`}>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center border text-xs ${i < step ? 'bg-accent border-accent text-white' : i === step ? 'border-accent text-accent' : 'border-border-color text-text-muted'}`}>
                    {i < step ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className="hidden sm:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-accent' : 'bg-border-color'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="card p-6">
          {/* Step 0: Select Service */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-5">Select a Service</h2>
              {services.length === 0 ? (
                <p className="text-text-muted text-center py-8">This provider has no services listed yet.</p>
              ) : (
                <div className="space-y-3">
                  {services.map(svc => (
                    <button
                      key={svc._id}
                      onClick={() => setSelected(s => ({ ...s, service: svc }))}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${selected.service?._id === svc._id ? 'border-accent bg-accent/5' : 'border-border-color hover:border-accent/50'}`}
                    >
                      <div>
                        <p className="font-medium text-text-primary">{svc.title}</p>
                        <p className="text-text-muted text-sm">{svc.duration} min Â· {svc.pricingType?.replace('_', ' ')}</p>
                      </div>
                      <div className="text-success font-bold">â‚¹{svc.price}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 1: Date */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-5">Select a Date</h2>
              <input
                type="date"
                min={today}
                max={maxDateStr}
                value={selected.date}
                onChange={e => setSelected(s => ({ ...s, date: e.target.value, slot: null }))}
                className="input-field"
              />
            </div>
          )}

          {/* Step 2: Time slot */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-5">Select a Time Slot</h2>
              {slotsLoading ? (
                <div className="flex justify-center py-8"><LoadingSpinner size="md" /></div>
              ) : slots.length === 0 ? (
                <p className="text-text-muted text-center py-8">No available slots for this date. Please pick another date.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot, i) => (
                    <button
                      key={i}
                      disabled={!slot.available}
                      onClick={() => setSelected(s => ({ ...s, slot }))}
                      className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
                        !slot.available ? 'border-border-color text-text-muted opacity-40 cursor-not-allowed' :
                        selected.slot?.time === slot.time ? 'border-accent bg-accent text-white' :
                        'border-border-color text-text-secondary hover:border-accent'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-5">Service Address</h2>
              <div className="space-y-4">
                <Input label="Street Address *" placeholder="Flat/House No., Street" value={selected.address.street} onChange={e => setSelected(s => ({ ...s, address: { ...s.address, street: e.target.value } }))} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="City *" placeholder="Mumbai" value={selected.address.city} onChange={e => setSelected(s => ({ ...s, address: { ...s.address, city: e.target.value } }))} />
                  <Input label="State" placeholder="Maharashtra" value={selected.address.state} onChange={e => setSelected(s => ({ ...s, address: { ...s.address, state: e.target.value } }))} />
                </div>
                <Input label="Pincode *" placeholder="400001" value={selected.address.pincode} onChange={e => setSelected(s => ({ ...s, address: { ...s.address, pincode: e.target.value } }))} />
                <Input label="Landmark (optional)" placeholder="Near Metro Station" value={selected.address.landmark} onChange={e => setSelected(s => ({ ...s, address: { ...s.address, landmark: e.target.value } }))} />
                <Textarea label="Additional Notes (optional)" placeholder="Any special instructions for the professional" value={selected.notes} onChange={e => setSelected(s => ({ ...s, notes: e.target.value }))} />
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-5">Confirm Booking</h2>
              <div className="space-y-4">
                <div className="p-4 bg-bg-surface-2 rounded-xl border border-border-color space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-text-muted">Service</span><span className="text-text-primary font-medium">{selected.service?.title}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-text-muted">Provider</span><span className="text-text-primary font-medium">{provider?.user?.name}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-text-muted flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Date</span><span className="text-text-primary font-medium">{new Date(selected.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-text-muted flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Time</span><span className="text-text-primary font-medium">{selected.slot?.time}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-text-muted flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Address</span><span className="text-text-primary font-medium text-right max-w-[200px]">{[selected.address.street, selected.address.city].join(', ')}</span></div>
                  <div className="border-t border-border-color pt-3 flex justify-between"><span className="font-semibold text-text-primary">Total</span><span className="text-success font-bold text-lg">â‚¹{selected.service?.price}</span></div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-success/5 border border-success/20 rounded-xl">
                  <Truck className="h-5 w-5 text-success shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-success">Cash on Delivery</p>
                    <p className="text-xs text-text-muted">Pay the professional directly after service completion.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-border-color">
            {step > 0 && (
              <Button variant="ghost" className="border border-border-color" onClick={() => setStep(s => s - 1)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
            <div className="flex-1" />
            {step < STEPS.length - 1 ? (
              <Button variant="primary" disabled={!canNext()} onClick={() => setStep(s => s + 1)}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button variant="primary" isLoading={submitting} onClick={handleSubmit}>
                Confirm Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlowPage;

