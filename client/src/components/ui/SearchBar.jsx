import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';

const SearchBar = ({ placeholder = 'Search...', onSearch, suggestions = [], isLoading = false, value, onChange, className = '' }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const ref = useRef(null);
  const debouncedValue = useDebounce(inputValue, 350);

  useEffect(() => {
    if (onChange) onChange(debouncedValue);
    if (onSearch) onSearch(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    if (onSearch) onSearch(suggestion);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="input-field pl-10 pr-10"
        />
        {inputValue && (
          <button onClick={() => { setInputValue(''); if (onSearch) onSearch(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border-color rounded-xl shadow-xl z-50 overflow-hidden">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => handleSelect(s)} className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-surface-2 hover:text-text-primary transition-colors flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-text-muted" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
