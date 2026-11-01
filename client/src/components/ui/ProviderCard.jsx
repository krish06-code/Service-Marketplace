import React from 'react';
import { MapPin, Star, CheckCircle, IndianRupee, ArrowRight } from 'lucide-react';
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
    <div className="group bg-white border border-border-color rounded-2xl p-5 flex flex-col gap-4 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <Avatar src={avatarSrc} fallback={user.name} size="lg" />
          {provider.verificationStatus === 'approved' && (
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <CheckCircle className="h-3 w-3 text-white fill-current" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-text-primary truncate group-hover:text-accent transition-colors text-sm">
            {user.name}
          </h3>
          <p className="text-text-muted text-xs truncate mt-0.5">
            {provider.categories?.map(c => c.name || c).join(', ')}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-text-primary">{(provider.averageRating || 0).toFixed(1)}</span>
            <span className="text-text-muted text-xs">({provider.totalReviews || 0})</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      {provider.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {provider.skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-bg-surface border border-border-color text-text-muted text-xs font-medium">
              {skill}
            </span>
          ))}
          {provider.skills.length > 3 && (
            <span className="px-2.5 py-1 rounded-lg bg-bg-surface border border-border-color text-text-muted text-xs font-medium">
              +{provider.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm border-t border-border-color pt-3">
        <div className="flex items-center gap-1 text-text-muted text-xs">
          <MapPin className="h-3.5 w-3.5 text-accent" />
          <span className="truncate max-w-[110px]">{location.city || 'India'}</span>
        </div>
        <div className="flex items-center gap-0.5 text-emerald-600 font-bold text-xs">
          <IndianRupee className="h-3.5 w-3.5" />
          <span>{provider.startingPrice || 299}+</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/providers/${provider._id}`)}
        >
          View Profile
        </Button>
        {showBookButton && (
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/book/${provider._id}`)}
          >
            Book Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderCard;
