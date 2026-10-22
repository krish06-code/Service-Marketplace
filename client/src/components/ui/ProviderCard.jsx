import React from 'react';
import { MapPin, Star, CheckCircle, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import Button from './Button';
import { getAssetURL } from '../../services/api';

const ProviderCard = ({ provider, showBookButton = true }) => {
  const navigate = useNavigate();
  const user = provider.user || {};
  const location = provider.location || {};
  const avatarSrc = getAssetURL(user.avatar);

  return (
    <div className="card p-5 flex flex-col gap-4 group hover:border-accent/40 hover:shadow-[0_0_20px_rgba(79,124,255,0.08)] transition-all">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <Avatar src={avatarSrc} fallback={user.name} size="lg" />
          {provider.verificationStatus === 'approved' && (
            <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-0.5">
              <CheckCircle className="h-3 w-3 text-white fill-current" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate group-hover:text-accent transition-colors">{user.name}</h3>
          <p className="text-text-muted text-sm truncate">
            {provider.categories?.map(c => c.name || c).join(', ')}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="text-sm font-medium text-text-primary">{(provider.averageRating || 0).toFixed(1)}</span>
            <span className="text-text-muted text-xs">({provider.totalReviews || 0} reviews)</span>
          </div>
        </div>
      </div>

      {provider.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {provider.skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-bg-surface-2 border border-border-color text-text-muted text-xs">{skill}</span>
          ))}
          {provider.skills.length > 3 && <span className="px-2 py-0.5 rounded-md bg-bg-surface-2 border border-border-color text-text-muted text-xs">+{provider.skills.length - 3}</span>}
        </div>
      )}

      <div className="flex items-center justify-between text-sm border-t border-border-color pt-3">
        <div className="flex items-center gap-1 text-text-muted">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate max-w-[120px]">{location.city || 'India'}</span>
        </div>
        <div className="flex items-center gap-0.5 text-success font-semibold">
          <IndianRupee className="h-3.5 w-3.5" />
          <span>{provider.startingPrice || 299}+</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="flex-1 border border-border-color" onClick={() => navigate(`/providers/${provider._id}`)}>
          View Profile
        </Button>
        {showBookButton && (
          <Button variant="primary" size="sm" className="flex-1" onClick={() => navigate(`/book/${provider._id}`)}>
            Book Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderCard;
