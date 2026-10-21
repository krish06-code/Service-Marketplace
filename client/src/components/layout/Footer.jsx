import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const footerLinks = {
  Marketplace: [
    { label: 'Browse Services', href: '/services' },
    { label: 'Find Professionals', href: '/providers' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Become a Provider', href: '/register?role=provider' },
  ],
  Company: [
    { label: 'About Us', href: '/#why-choose-us' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Safety', href: '#' },
    { label: 'Community', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Refund Policy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
];

const Footer = () => (
  <footer className="bg-bg-surface border-t border-border-color">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-lg font-bold text-text-primary">ServiConnect</span>
          </Link>
          <p className="text-text-muted text-sm leading-relaxed mb-4">
            Connecting you with trusted local professionals for every home and personal service need.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} className="p-2 rounded-lg bg-bg-surface-2 border border-border-color text-text-muted hover:text-accent hover:border-accent transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-semibold text-text-primary text-sm mb-4">{title}</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-text-muted text-sm hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border-color pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-text-muted text-sm">© {new Date().getFullYear()} ServiConnect. All rights reserved.</p>
        <p className="text-text-muted text-sm">Made with ❤️ in India</p>
      </div>
    </div>
  </footer>
);

export default Footer;
