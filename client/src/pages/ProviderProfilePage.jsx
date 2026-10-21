import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Clock, IndianRupee, Heart, ArrowLeft, Briefcase } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import RatingStars from '../components/ui/RatingStars';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { providerAPI, reviewAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProviderProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [provRes, svcRes, revRes] = await Promise.all([
          providerAPI.getById(id),
          providerAPI.getServices(id),
          reviewAPI.getProviderReviews(id, { limit: 5 }),
        ]);
        setProvider(provRes.data.data);
        setServices(svcRes.data.data || []);
        setReviews(revRes.data.data || []);
      } catch (e) {
        showToast('error', 'Failed to load provider profile');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleFav = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setFavLoading(true);
    try {
      await userAPI.toggleFavourite(id);
      setIsFav(!isFav);
      showToast('success', isFav ? 'Removed from favourites' : 'Added to favourites');
    } catch (e) {
      showToast('error', 'Failed to update favourites');
    } finally {
      setFavLoading(false);
    }
  };

  if (isLoading) return <PublicLayout><div className="max-w-4xl mx-auto px-4 py-10 space-y-4"><SkeletonCard /><SkeletonCard /></div></PublicLayout>;
  if (!provider) return <PublicLayout><EmptyState icon={Briefcase} title="Provider not found" /></PublicLayout>;

  const provUser = provider.user || {};
  const loc = provider.location || {};
  const availability = provider.availability || {};
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Hero */}
        <div className="card p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative shrink-0">
              <Avatar
                src={provUser.avatar ? `${import.meta.env.VITE_SOCKET_URL}${provUser.avatar}` : null}
                fallback={provUser.name}
                size="xl"
              />
              {provider.verificationStatus === 'approved' && (
                <div className="absolute -bottom-2 -right-2 bg-success rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-white fill-current" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">{provUser.name}</h1>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {provider.categories?.map(c => <Badge key={c._id || c} variant="info">{c.name || c}</Badge>)}
                  </div>
                </div>
                <button
                  onClick={handleFav}
                  disabled={favLoading}
                  className={`p-2 rounded-xl border transition-colors ${isFav ? 'border-danger/40 bg-danger/10 text-danger' : 'border-border-color text-text-muted hover:border-danger/40 hover:text-danger'}`}
                >
                  <Heart className={`h-5 w-5 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={provider.averageRating || 0} size="sm" />
                  <span className="font-semibold text-text-primary">{(provider.averageRating || 0).toFixed(1)}</span>
                  <span className="text-text-muted text-sm">({provider.totalReviews || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-text-muted text-sm">
                  <MapPin className="h-4 w-4" /> {loc.city || 'India'}
                </div>
                <div className="flex items-center gap-1 text-text-muted text-sm">
                  <Briefcase className="h-4 w-4" /> {provider.experience || 0} yrs experience
                </div>
                <div className="flex items-center gap-1 text-success text-sm font-semibold">
                  <CheckCircle className="h-4 w-4" /> {provider.completedJobs || 0} jobs done
                </div>
              </div>

              {provider.bio && <p className="text-text-muted text-sm mt-4 leading-relaxed">{provider.bio}</p>}

              {provider.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {provider.skills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-bg-surface-2 border border-border-color text-text-muted text-xs">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border-color">
            <Button variant="primary" size="lg" className="flex-1" onClick={() => navigate(`/book/${id}`)}>
              <IndianRupee className="h-4 w-4 mr-1" /> Book Now
            </Button>
            {isAuthenticated && user?.role === 'customer' && (
              <Button variant="secondary" size="lg" onClick={() => navigate('/messages')}>
                Message
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Services */}
          <div className="lg:col-span-2 space-y-6">
            {services.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Services Offered</h2>
                <div className="space-y-3">
                  {services.map(svc => (
                    <div key={svc._id} className="flex items-center justify-between p-3 bg-bg-surface-2 rounded-xl border border-border-color">
                      <div>
                        <p className="font-medium text-text-primary text-sm">{svc.title}</p>
                        {svc.description && <p className="text-text-muted text-xs mt-0.5 line-clamp-1">{svc.description}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3.5 w-3.5 text-text-muted" />
                          <span className="text-text-muted text-xs">{svc.duration} min</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-success font-bold">â‚¹{svc.price}</div>
                        <div className="text-text-muted text-xs">{svc.pricingType?.replace('_', ' ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Customer Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-text-muted text-sm text-center py-6">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="border-b border-border-color pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar fallback={r.customer?.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{r.customer?.name}</p>
                          <RatingStars rating={r.rating} size="sm" />
                        </div>
                        <span className="ml-auto text-text-muted text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      {r.comment && <p className="text-text-muted text-sm pl-11">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-4">Availability</h3>
              <div className="space-y-2">
                {days.map(day => {
                  const info = availability[day] || {};
                  return (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className="text-text-muted capitalize">{day.slice(0, 3)}</span>
                      {info.isAvailable ? (
                        <span className="text-text-primary text-xs">{info.startTime} â€“ {info.endTime}</span>
                      ) : (
                        <span className="text-text-muted text-xs">Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-3">Location</h3>
              <div className="flex items-start gap-2 text-text-muted text-sm">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                <span>{[loc.address, loc.city, loc.state].filter(Boolean).join(', ') || 'India'}</span>
              </div>
              {provider.serviceRadius && (
                <p className="text-text-muted text-xs mt-2">Serves within {provider.serviceRadius} km</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProviderProfilePage;

