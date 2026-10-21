import React, { useState, useEffect } from 'react';
import { CheckCircle, Upload, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { providerAPI, categoryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const STEPS = ['About You', 'Your Location', 'Categories', 'Complete'];

const ProviderOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bio: '', experience: '', skills: '', startingPrice: '',
    location: { address: '', city: '', state: '', pincode: '' },
    selectedCats: [],
  });

  useEffect(() => { categoryAPI.getAll().then(res => setCategories(res.data.data || [])).catch(() => {}); }, []);

  const toggleCat = (id) => setForm(f => ({
    ...f, selectedCats: f.selectedCats.includes(id) ? f.selectedCats.filter(c => c !== id) : [...f.selectedCats, id]
  }));

  const handleComplete = async () => {
    setSaving(true);
    try {
      await providerAPI.updateMyProfile({
        bio: form.bio,
        experience: Number(form.experience),
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        startingPrice: Number(form.startingPrice),
        location: form.location,
        categories: form.selectedCats,
      });
      showToast('success', 'Profile setup complete!');
      navigate('/provider/dashboard');
    } catch (e) { showToast('error', 'Failed to save profile'); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-text-muted mt-1">Let's set up your provider profile in {STEPS.length - 1} quick steps.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-1 text-xs font-medium ${i <= step ? 'text-accent' : 'text-text-muted'}`}>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center border text-xs ${i < step ? 'bg-accent border-accent text-white' : i === step ? 'border-accent text-accent' : 'border-border-color'}`}>
                  {i < step ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className="hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-accent' : 'bg-border-color'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="card p-7">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-text-primary">About You</h2>
              <Textarea label="Professional Bio *" placeholder="Describe your skills and experience..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Years of Experience" type="number" placeholder="5" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
                <Input label="Starting Price (₹)" type="number" placeholder="299" value={form.startingPrice} onChange={e => setForm(f => ({ ...f, startingPrice: e.target.value }))} />
              </div>
              <Input label="Skills (comma separated)" placeholder="AC Repair, Gas Refill, Installation" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2"><MapPin className="h-5 w-5 text-accent" />Your Location</h2>
              <Input label="Street Address" value={form.location.address} onChange={e => setForm(f => ({ ...f, location: { ...f.location, address: e.target.value } }))} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="City *" placeholder="Mumbai" value={form.location.city} onChange={e => setForm(f => ({ ...f, location: { ...f.location, city: e.target.value } }))} />
                <Input label="State" placeholder="Maharashtra" value={form.location.state} onChange={e => setForm(f => ({ ...f, location: { ...f.location, state: e.target.value } }))} />
              </div>
              <Input label="Pincode" placeholder="400001" value={form.location.pincode} onChange={e => setForm(f => ({ ...f, location: { ...f.location, pincode: e.target.value } }))} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-text-primary">Service Categories</h2>
              <p className="text-text-muted text-sm">Select all categories that match your expertise.</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => toggleCat(cat._id)}
                    className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${form.selectedCats.includes(cat._id) ? 'bg-accent border-accent text-white' : 'border-border-color text-text-muted hover:border-accent/50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              {form.selectedCats.length === 0 && <p className="text-xs text-warning">Please select at least one category.</p>}
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-xl font-bold text-text-primary">You're all set!</h2>
              <p className="text-text-muted text-sm">Your provider profile is ready. Start adding services and set your availability to receive bookings.</p>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-5 border-t border-border-color">
            {step > 0 && step < 3 && (
              <Button variant="ghost" className="border border-border-color" onClick={() => setStep(s => s - 1)}>Back</Button>
            )}
            <div className="flex-1" />
            {step < 2 && (
              <Button variant="primary" onClick={() => setStep(s => s + 1)}>Continue <ArrowRight className="h-4 w-4 ml-1" /></Button>
            )}
            {step === 2 && (
              <Button variant="primary" disabled={form.selectedCats.length === 0} onClick={() => { handleComplete(); }}>
                {saving ? 'Saving...' : 'Complete Setup'}
              </Button>
            )}
            {step === 3 && (
              <Button variant="primary" onClick={() => navigate('/provider/dashboard')}>Go to Dashboard <ArrowRight className="h-4 w-4 ml-1" /></Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderOnboarding;
