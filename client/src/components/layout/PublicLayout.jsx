import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = ({ children, hideFooter = false }) => (
  <div className="min-h-screen bg-bg-primary flex flex-col">
    <Navbar />
    <main className="flex-1 pt-16">{children}</main>
    {!hideFooter && <Footer />}
  </div>
);

export default PublicLayout;
