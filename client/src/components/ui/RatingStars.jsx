import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, maxRating = 5, interactive = false, onChange, size = 'md' }) => {
  const [hovered, setHovered] = React.useState(0);
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const value = i + 1;
        const filled = interactive ? value <= (hovered || rating) : value <= Math.floor(rating);
        const halfFilled = !interactive && !filled && value <= Math.ceil(rating) && rating % 1 >= 0.5;

        return (
          <span
            key={i}
            className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}
            onClick={() => interactive && onChange && onChange(value)}
            onMouseEnter={() => interactive && setHovered(value)}
            onMouseLeave={() => interactive && setHovered(0)}
          >
            <Star
              className={`${starSize} transition-colors ${
                filled ? 'fill-warning text-warning' : halfFilled ? 'fill-warning/50 text-warning' : 'fill-transparent text-text-muted'
              }`}
            />
          </span>
        );
      })}
    </div>
  );
};

export default RatingStars;
