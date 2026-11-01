import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';

const ServiceCard = ({ category, startingPrice }) => {
  const navigate = useNavigate();
  const IconComponent = Icons[category.icon] || Icons.Wrench;

  return (
    <div
      onClick={() => navigate(`/services?category=${category.slug}`)}
      className="card p-5 cursor-pointer group hover:border-accent hover:shadow-[0_8px_24px_rgba(244,91,53,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
    >
      <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
        <IconComponent className="h-6 w-6 text-accent group-hover:text-white transition-colors" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors">{category.name}</h3>
        <p className="text-text-muted text-sm leading-relaxed line-clamp-2">{category.description || `Professional ${category.name.toLowerCase()} services`}</p>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border-color/60">
        <span className="text-accent font-semibold text-sm">From ₹{startingPrice || 299}</span>
        <div className="h-7 w-7 rounded-full bg-bg-surface flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
          <ArrowRight className="h-3.5 w-3.5 text-text-muted group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
