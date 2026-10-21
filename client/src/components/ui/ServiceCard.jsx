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
      className="card p-5 cursor-pointer group hover:border-accent/50 hover:shadow-[0_0_20px_rgba(79,124,255,0.1)] flex flex-col gap-4"
    >
      <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
        <IconComponent className="h-6 w-6 text-accent" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors">{category.name}</h3>
        <p className="text-text-muted text-sm leading-relaxed line-clamp-2">{category.description || `Professional ${category.name.toLowerCase()} services`}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-success text-sm font-medium">From ₹{startingPrice || 299}</span>
        <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default ServiceCard;
