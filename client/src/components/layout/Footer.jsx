import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Twitter, Instagram, Linkedin, Github, MapPin, Phone, Mail } from 'lucide-react';

const footerLinks = {
  Marketplace: [
    { label: 'Browse Services', href: '/services' },
    { label: 'Find Professionals', href: '/professionals' },
    { label: 'How It Works', href: '/how-it-works' },
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
  <footer className="bg-[#171717] text-white">
    {/* Top CTA banner */}
    <div className="border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready to book a service?</h3>
            <p className="text-white/60 text-sm">Thousands of verified professionals, one click away.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/services"
              className="px-6 py-3 bg-accent hover:bg-accent-dark text-white text-sm font-semibold rounded-xl transition-all shadow-[0_4px_14px_rgba(244,91,53,0.35)] hover:shadow-[0_6px_20px_rgba(244,91,53,0.45)] hover:-translate-y-0.5"
            >
              Find a Professional
            </Link>
            <Link
              to="/register?role=provider"
              className="px-6 py-3 border border-white/20 hover:border-white/40 text-white text-sm font-semibold rounded-xl transition-all hover:bg-white/5"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Main footer content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
        {/* Brand */}
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-5">
            <div className="h-9 w-9 bg-accent rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-lg font-bold">Servi<span className="text-accent">Connect</span></span>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-xs">
            Connecting you with trusted local professionals for every home and personal service need.
          </p>

          {/* Contact info */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
              <span>Mumbai, Maharashtra, India</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
              <span>support@serviconnect.in</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="p-2 rounded-lg bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/40 text-white/50 hover:text-accent transition-all"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-semibold text-white text-sm mb-4">{title}</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/50 text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} ServiConnect. All rights reserved.</p>
        <p className="text-white/40 text-sm">Made with ❤️ in India</p>
      </div>
    </div>
  </footer>
);

export default Footer;
