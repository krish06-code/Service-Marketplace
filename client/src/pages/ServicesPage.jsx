import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import ProviderCard from '../components/ui/ProviderCard';
import { SkeletonList } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { providerAPI, categoryAPI } from '../services/api';
import { Users } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    minRating: '',
    maxPrice: '',
    city: searchParams.get('location') || '',
  });

  const debouncedQ = useDebounce(filters.q, 400);

  const fetchCategories = useCallback(async () => {
    try { const res = await categoryAPI.getAll(); setCategories(res.data.data || []); } catch (e) { /* ignore */ }
  }, []);

  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 12 };
      if (debouncedQ) params.search = debouncedQ;
      if (filters.category) params.category = filters.category;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.city) params.city = filters.city;
      params.verificationStatus = 'approved';
      const res = await providerAPI.getAll(params);
      setProviders(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQ, filters.category, filters.minRating, filters.maxPrice, filters.city, page]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const clearFilters = () => setFilters({ q: '', category: '', minRating: '', maxPrice: '', city: '' });

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="category" value="" checked={!filters.category} onChange={() => setFilters(f => ({ ...f, category: '' }))} className="accent-accent" />
            <span className="text-sm text-text-secondary">All Categories</span>
          </label>
          {categories.map(cat => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="category" value={cat.slug} checked={filters.category === cat.slug} onChange={() => setFilters(f => ({ ...f, category: cat.slug }))} className="accent-accent" />
              <span className="text-sm text-text-secondary">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Min Rating</h3>
        <select value={filters.minRating} onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))} className="input-field text-sm">
          <option value="">Any Rating</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Max Price (â‚¹)</h3>
        <select value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} className="input-field text-sm">
          <option value="">Any Price</option>
          <option value="500">Under â‚¹500</option>
          <option value="1000">Under â‚¹1000</option>
          <option value="2000">Under â‚¹2000</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">City</h3>
        <input
          type="text"
          placeholder="e.g. Mumbai"
          value={filters.city}
          onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
          className="input-field text-sm"
        />
      </div>

      <button onClick={clearFilters} className="text-sm text-accent hover:underline">Clear All Filters</button>
    </div>
  );

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Find Professionals</h1>
          <p className="text-text-muted">Browse verified experts for every service you need.</p>
        </div>

        {/* Search + filter toggle */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search services, providers..."
            value={filters.q}
            onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
            className="input-field flex-1"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-border-color rounded-lg text-text-muted hover:text-text-primary hover:border-accent transition-colors text-sm lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-text-primary">Filters</h2>
                {(filters.category || filters.minRating || filters.maxPrice || filters.city) && (
                  <button onClick={clearFilters} className="text-xs text-danger hover:underline">Clear</button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-72 bg-bg-surface border-l border-border-color p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-text-primary">Filters</h2>
                  <button onClick={() => setShowFilters(false)}><X className="h-5 w-5 text-text-muted" /></button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-text-muted text-sm">{total} professionals found</p>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card p-5 space-y-3 animate-pulse">
                    <div className="flex gap-3"><div className="h-12 w-12 rounded-full bg-bg-surface-2" /><div className="flex-1 space-y-2"><div className="h-4 bg-bg-surface-2 rounded w-3/4" /><div className="h-3 bg-bg-surface-2 rounded w-1/2" /></div></div>
                    <div className="h-16 bg-bg-surface-2 rounded" />
                    <div className="h-8 bg-bg-surface-2 rounded" />
                  </div>
                ))}
              </div>
            ) : providers.length === 0 ? (
              <EmptyState icon={Users} title="No professionals found" description="Try adjusting your filters or search term." action={{ label: 'Clear Filters', onClick: clearFilters }} />
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {providers.map(p => <ProviderCard key={p._id} provider={p} />)}
                </div>
                <Pagination currentPage={page} totalPages={Math.ceil(total / 12)} onPageChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ServicesPage;

