import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ items = [], isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar panel */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-bg-surface border-r border-border-color z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <nav className="h-full flex flex-col py-4 overflow-y-auto">
          <ul className="flex-1 px-3 space-y-1">
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
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'text-text-muted hover:text-text-primary hover:bg-bg-surface-2'
                    }`}
                  >
                    {Icon && <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-accent' : 'group-hover:text-text-primary'}`} style={{ height: '1.125rem', width: '1.125rem' }} />}
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="ml-auto bg-accent text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
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
