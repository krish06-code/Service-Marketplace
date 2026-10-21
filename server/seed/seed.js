require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Payment = require('../models/Payment');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://serviconnect:serviconnect123@cluster0.mongodb.net/serviconnect?retryWrites=true&w=majority';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB for seeding...');

    // Clear existing
    await User.deleteMany();
    await ProviderProfile.deleteMany();
    await Category.deleteMany();
    await Service.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    await Payment.deleteMany();
    console.log('Cleared existing data.');

    // Admin
    const admin = await User.create({
      name: 'Admin User', email: 'admin@serviconnect.in', password: 'Admin@123', role: 'admin'
    });

    // Customers
    const customers = await User.create([
      { name: 'Priya Sharma', email: 'priya@example.com', password: 'Customer@123', role: 'customer' },
      { name: 'Arjun Mehta', email: 'arjun@example.com', password: 'Customer@123', role: 'customer' },
      { name: 'Sneha Patel', email: 'sneha@example.com', password: 'Customer@123', role: 'customer' },
      { name: 'Rohit Kumar', email: 'rohit@example.com', password: 'Customer@123', role: 'customer' },
      { name: 'Ananya Gupta', email: 'ananya@example.com', password: 'Customer@123', role: 'customer' }
    ]);

    // Categories
    const categoriesData = [
      { name: 'Electrician', icon: 'Zap', slug: 'electrician' },
      { name: 'Plumbing', icon: 'Droplets', slug: 'plumbing' },
      { name: 'AC Repair', icon: 'Wind', slug: 'ac-repair' },
      { name: 'Home Cleaning', icon: 'Sparkles', slug: 'home-cleaning' },
      { name: 'Appliance Repair', icon: 'Wrench', slug: 'appliance-repair' },
      { name: 'Painting', icon: 'Paintbrush', slug: 'painting' },
      { name: 'Carpentry', icon: 'Hammer', slug: 'carpentry' },
      { name: 'Tutor', icon: 'GraduationCap', slug: 'tutor' },
      { name: 'Personal Trainer', icon: 'Dumbbell', slug: 'personal-trainer' },
      { name: 'Photography', icon: 'Camera', slug: 'photography' }
    ];
    const categories = await Category.create(categoriesData);

    // Helper to get cat by name
    const getCat = (name) => categories.find(c => c.name === name)._id;

    // Providers (Users + Profiles)
    const providerUsersData = [
      { name: 'Rahul Sharma', email: 'rahul@acrepairs.in', password: 'Provider@123', role: 'provider' },
      { name: 'Pradeep Kumar', email: 'pradeep@electrics.in', password: 'Provider@123', role: 'provider' },
      { name: 'Sunita Devi', email: 'sunita@cleaners.in', password: 'Provider@123', role: 'provider' },
      { name: 'Mohammed Ali', email: 'ali@plumbing.in', password: 'Provider@123', role: 'provider' },
      { name: 'Kavitha Reddy', email: 'kavitha@tutors.in', password: 'Provider@123', role: 'provider' },
      { name: 'Vikram Singh', email: 'vikram@woodworks.in', password: 'Provider@123', role: 'provider' },
      { name: 'Neha Joshi', email: 'neha@photos.in', password: 'Provider@123', role: 'provider' },
      { name: 'Suresh Babu', email: 'suresh@repairs.in', password: 'Provider@123', role: 'provider' }
    ];
    
    const pUsers = await User.create(providerUsersData);

    const locations = [
      { address: 'Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400053', coordinates: { lat: 19.1136, lng: 72.8297 } },
      { address: 'Connaught Place', city: 'Delhi', state: 'Delhi', pincode: '110001', coordinates: { lat: 28.6304, lng: 77.2177 } },
      { address: 'Indiranagar', city: 'Bangalore', state: 'Karnataka', pincode: '560038', coordinates: { lat: 12.9784, lng: 77.6408 } },
      { address: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034', coordinates: { lat: 17.4156, lng: 78.4347 } },
      { address: 'T Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017', coordinates: { lat: 13.0418, lng: 80.2341 } },
      { address: 'Koregaon Park', city: 'Pune', state: 'Maharashtra', pincode: '411001', coordinates: { lat: 18.5362, lng: 73.8939 } },
      { address: 'Bandra', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', coordinates: { lat: 19.0596, lng: 72.8295 } },
      { address: 'Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560034', coordinates: { lat: 12.9352, lng: 77.6245 } }
    ];

    const catsMap = [
      getCat('AC Repair'), getCat('Electrician'), getCat('Home Cleaning'), getCat('Plumbing'), 
      getCat('Tutor'), getCat('Carpentry'), getCat('Photography'), getCat('Appliance Repair')
    ];

    const profiles = [];
    for (let i = 0; i < pUsers.length; i++) {
      const p = await ProviderProfile.create({
        user: pUsers[i]._id,
        bio: `Expert in my field with 5+ years of experience in ${locations[i].city}.`,
        experience: 5 + i,
        categories: [catsMap[i]],
        skills: ['Professional', 'Punctual', 'Expert'],
        location: locations[i],
        verificationStatus: 'approved',
        averageRating: 4.5 + (Math.random() * 0.5),
        totalReviews: 10 + Math.floor(Math.random() * 40),
        completedJobs: 50 + Math.floor(Math.random() * 450),
        availability: {
          monday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
          tuesday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
          wednesday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
          thursday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
          friday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
          saturday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
          sunday: { isAvailable: false, startTime: '09:00', endTime: '18:00' }
        },
        slotDuration: 60
      });
      profiles.push(p);
    }

    // Services
    const serviceTitles = [
      ['AC Servicing', 'AC Gas Refill'],
      ['Switch Board Repair', 'House Wiring'],
      ['Deep Home Cleaning', 'Sofa Cleaning'],
      ['Leakage Repair', 'Tap Installation'],
      ['Math Tuitions', 'Physics Tuitions'],
      ['Furniture Repair', 'Custom Door Making'],
      ['Wedding Photography', 'Portrait Shoot'],
      ['Washing Machine Repair', 'Refrigerator Repair']
    ];
    
    const srvIds = [];
    for (let i = 0; i < profiles.length; i++) {
      for (let j = 0; j < 2; j++) {
        const s = await Service.create({
          provider: profiles[i]._id,
          category: catsMap[i],
          title: serviceTitles[i][j],
          description: `Best ${serviceTitles[i][j]} service in the city`,
          price: 500 + Math.floor(Math.random() * 2000),
          pricingType: 'fixed',
          duration: 60
        });
        srvIds.push(s);
      }
    }

    // Bookings & Payments & Reviews
    const statuses = ['completed', 'in_progress', 'pending', 'accepted'];
    for(let i=0; i<10; i++) {
      const cust = customers[i % 5];
      const srv = srvIds[i % srvIds.length];
      const provId = srv.provider;
      const stat = statuses[i % statuses.length];
      
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + (i-5)); // some past, some future
      
      const b = await Booking.create({
        customer: cust._id,
        provider: provId,
        service: srv._id,
        scheduledDate,
        startTime: '10:00',
        endTime: '11:00',
        address: { street: 'Sample St', city: 'Mumbai', state: 'MH', pincode: '400001' },
        price: srv.price,
        status: stat,
        paymentStatus: stat === 'completed' ? 'paid' : 'pending',
        paymentMethod: 'cod',
        completedAt: stat === 'completed' ? scheduledDate : null
      });

      await Payment.create({
        booking: b._id,
        customer: cust._id,
        provider: provId,
        amount: srv.price,
        status: stat === 'completed' ? 'paid' : 'pending',
        paymentMethod: 'cod',
        paidAt: stat === 'completed' ? scheduledDate : null
      });

      if (stat === 'completed' && i < 5) {
        await Review.create({
          customer: cust._id,
          provider: provId,
          booking: b._id,
          rating: 4 + Math.round(Math.random()),
          comment: 'Great service, highly recommended!'
        });
      }
    }

    console.log('✅ Seeding completed!');
    console.log('--- DEMO CREDENTIALS ---');
    console.log('Admin: admin@serviconnect.in / Admin@123');
    console.log('Customer: priya@example.com / Customer@123');
    console.log('Provider: rahul@acrepairs.in / Provider@123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
