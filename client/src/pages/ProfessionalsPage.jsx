import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, Users, Star, MapPin, CheckCircle, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import ProviderCard from '../components/ui/ProviderCard';
import { SkeletonList } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { providerAPI, categoryAPI } from '../services/api';
import useDebounce from '../hooks/useDebounce';

const ProfessionalsPage = () => {
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
    minRating: searchParams.get('rating') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    city: searchParams.get('location') || '',
  });

  // Keep state in sync with URL params if they change
  useEffect(() => {
    const cat = searchParams.get('category');
    const query = searchParams.get('q');
    const loc = searchParams.get('location');
    if (cat !== null || query !== null || loc !== null) {
      setFilters(prev => ({
        ...prev,
        category: cat !== null ? cat : prev.category,
        q: query !== null ? query : prev.q,
        city: loc !== null ? loc : prev.city,
      }));
    }
  }, [searchParams]);

  const debouncedQ = useDebounce(filters.q, 400);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.data || []);
    } catch (e) {
      /* ignore */
    }
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

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const clearFilters = () => {
    setFilters({ q: '', category: '', minRating: '', maxPrice: '', city: '' });
    setSearchParams({});
  };

  const selectedCategoryObj = categories.find(c => c.slug === filters.category);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-text-primary mb-3">Service Category</h3>
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          <label className={`flex items-center justify-between p-2 rounded-xl cursor-pointer text-sm transition-colors ${!filters.category ? 'bg-accent/10 font-medium text-accent' : 'text-text-secondary hover:bg-bg-surface-2'}`}>
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={() => setFilters(f => ({ ...f, category: '' }))}
                className="accent-accent"
              />
              All Categories
            </span>
          </label>
          {categories.map(cat => (
            <label
              key={cat._id}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer text-sm transition-colors ${filters.category === cat.slug ? 'bg-accent/10 font-medium text-accent' : 'text-text-secondary hover:bg-bg-surface-2'}`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  value={cat.slug}
                  checked={filters.category === cat.slug}
                  onChange={() => setFilters(f => ({ ...f, category: cat.slug }))}
                  className="accent-accent"
                />
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border-color">
        <h3 className="text-sm font-bold text-text-primary mb-3">Minimum Rating</h3>
        <select
          value={filters.minRating}
          onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}
          className="input-field text-sm"
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5+ Stars (Top Rated)</option>
          <option value="4">4.0+ Stars</option>
          <option value="3">3.0+ Stars</option>
        </select>
      </div>

      <div className="pt-4 border-t border-border-color">
        <h3 className="text-sm font-bold text-text-primary mb-3">Max Starting Price (₹)</h3>
        <select
          value={filters.maxPrice}
          onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
          className="input-field text-sm"
        >
          <option value="">Any Budget</option>
          <option value="400">Under ₹400</option>
          <option value="600">Under ₹600</option>
          <option value="1000">Under ₹1,000</option>
          <option value="2000">Under ₹2,000</option>
        </select>
      </div>

      <div className="pt-4 border-t border-border-color">
        <h3 className="text-sm font-bold text-text-primary mb-3">City / Location</h3>
        <input
          type="text"
          placeholder="e.g. Mumbai, Delhi"
          value={filters.city}
          onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
          className="input-field text-sm"
        />
      </div>

      {(filters.category || filters.minRating || filters.maxPrice || filters.city || filters.q) && (
        <button
          onClick={clearFilters}
          className="w-full py-2 px-3 text-xs font-semibold text-danger bg-danger/10 hover:bg-danger/15 rounded-xl transition-colors"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );

  return (
    <PublicLayout>
      {/* Top Banner */}
      <div className="bg-gradient-to-b from-[#FFF5F2] to-white border-b border-border-color pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified & Background-Checked
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                {selectedCategoryObj ? `${selectedCategoryObj.name} Experts` : 'Find Verified Professionals'}
              </h1>
              <p className="text-text-muted mt-2 text-base max-w-2xl">
                Browse verified local specialists, compare transparent rates, review customer feedback, and book instant doorstep appointments.
              </p>
            </div>
            <div className="text-sm text-text-muted shrink-0">
              <span className="font-bold text-text-primary text-lg">{total}</span> verified experts ready
            </div>
          </div>

          {/* Quick Active Filters display */}
          {filters.category && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-accent/20">
              <span className="text-xs text-text-muted font-medium">Filtering by category:</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold">
                {selectedCategoryObj?.name || filters.category}
                <button onClick={() => setFilters(f => ({ ...f, category: '' }))} className="hover:opacity-75">
                  <X className="h-3 w-3 ml-0.5" />
                </button>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Mobile Filter Toggle */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by specialist name, trade, or skill..."
              value={filters.q}
              onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
              className="input-field pl-10 h-11"
            />
            {filters.q && (
              <button
                onClick={() => setFilters(f => ({ ...f, q: '' }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border-color rounded-xl text-text-secondary hover:text-text-primary hover:border-accent transition-colors text-sm font-semibold lg:hidden shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4 text-accent" /> Filters
          </button>
        </div>

        <div className="flex gap-8 items-start">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <div className="bg-white border border-border-color rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-color">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-accent" />
                  <h2 className="font-bold text-text-primary text-sm">Filter Results</h2>
                </div>
                {(filters.category || filters.minRating || filters.maxPrice || filters.city) && (
                  <button onClick={clearFilters} className="text-xs font-semibold text-danger hover:underline">
                    Clear
                  </button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile Filters Drawer */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white border-l border-border-color p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-border-color">
                  <h2 className="font-bold text-text-primary text-base">Filter Professionals</h2>
                  <button onClick={() => setShowFilters(false)} className="p-1 rounded-lg text-text-muted hover:text-text-primary">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Results Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card p-5 space-y-4 animate-pulse">
                    <div className="flex gap-3">
                      <div className="h-14 w-14 rounded-2xl bg-bg-surface-2" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-bg-surface-2 rounded w-3/4" />
                        <div className="h-3 bg-bg-surface-2 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-14 bg-bg-surface-2 rounded-xl" />
                    <div className="h-9 bg-bg-surface-2 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : providers.length === 0 ? (
              <div className="bg-white border border-border-color rounded-2xl p-8">
                <EmptyState
                  icon={Users}
                  title="No professionals found matching your filters"
                  description="Try broadening your search term, clearing category filters, or expanding your city radius."
                  action={{ label: 'Reset All Filters', onClick: clearFilters }}
                />
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {providers.map(p => (
                    <ProviderCard key={p._id} provider={p} />
                  ))}
                </div>
                <div className="mt-8">
                  <Pagination currentPage={page} totalPages={Math.ceil(total / 12)} onPageChange={setPage} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProfessionalsPage;
