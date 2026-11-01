import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Zap } from 'lucide-react';

const Sidebar = ({ items = [], isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-border-color z-40 transform transition-transform duration-300 ease-in-out shadow-[2px_0_20px_rgba(0,0,0,0.10)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto lg:shadow-none`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-border-color lg:hidden">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-accent rounded-xl flex items-center justify-center">
              <Zap className="h-4 w-4 text-white fill-current" />
            </div>
            <span className="font-bold text-text-primary">Servi<span className="text-accent">Connect</span></span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="h-full flex flex-col py-3 overflow-y-auto">
          <ul className="flex-1 px-3 space-y-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-accent text-white shadow-[0_4px_14px_rgba(244,91,53,0.25)]'
                        : 'text-text-muted hover:text-text-primary hover:bg-bg-surface'
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`shrink-0 ${isActive ? 'text-white' : 'group-hover:text-text-primary'}`}
                        style={{ height: '1rem', width: '1rem' }}
                      />
                    )}
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className={`ml-auto text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1 font-semibold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-accent text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
