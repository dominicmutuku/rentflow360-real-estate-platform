// Seed script to populate database with sample properties, users, and agents
// Run with: node backend/seed-properties.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');

// Sample data
const sampleUsers = [
  // Agents
  {
    firstName: 'Sarah',
    lastName: 'Johnson', 
    email: 'sarah.johnson@rentflow360.com',
    password: 'agent123',
    role: 'agent',
    isActive: true,
    phone: '+1234567890',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face'
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@rentflow360.com', 
    password: 'agent123',
    role: 'agent',
    isActive: true,
    phone: '+1234567891',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@rentflow360.com',
    password: 'agent123', 
    role: 'agent',
    isActive: true,
    phone: '+1234567892',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  // Regular Users
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'user123',
    role: 'user',
    isActive: true,
    phone: '+1234567893'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'user123',
    role: 'user', 
    isActive: true,
    phone: '+1234567894'
  },
  {
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@example.com',
    password: 'user123',
    role: 'user',
    isActive: true,
    phone: '+1234567895'
  }
];

const sampleProperties = [
  // Trending Properties
  {
    title: 'Modern Luxury Apartment in Downtown',
    description: 'Stunning 2-bedroom apartment with panoramic city views, premium finishes, and access to world-class amenities. Located in the heart of downtown with easy access to restaurants, shopping, and entertainment.',
    propertyType: 'apartment',
    listingType: 'rent',
    price: { amount: 150000, currency: 'KES', period: 'monthly' },
    location: {
      address: '123 Downtown Plaza',
      city: 'Nairobi',
      county: 'Nairobi',
      coordinates: { latitude: -1.2921, longitude: 36.8219 }
    },
    specifications: {
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      unit: 'sqm',
      parkingSpaces: 1
    },
    amenities: ['air-conditioning', 'balcony', 'gym', 'swimming-pool', 'elevator'],
    images: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop', isPrimary: true, caption: 'Living Room' },
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Kitchen' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', caption: 'Bedroom' }
    ],
    contact: {
      phone: '+254700123456',
      email: 'contact@rentflow360.com',
      preferredContactMethod: 'phone'
    },
    status: 'active',
    featured: true,
    trending: true,
    views: 247,
    favorites: 32
  },
  {
    title: 'Charming Family House in Karen',
    description: 'Beautiful 3-bedroom house featuring spacious rooms, private garden, and secure parking. Perfect for families looking for comfort and tranquility.',
    propertyType: 'house',
    listingType: 'rent',
    price: { amount: 180000, currency: 'KES', period: 'monthly' },
    location: {
      address: '456 Karen Road',
      city: 'Nairobi',
      county: 'Nairobi',
      neighborhood: 'Karen',
      coordinates: { latitude: -1.3194, longitude: 36.6872 }
    },
    specifications: {
      bedrooms: 3,
      bathrooms: 2,
      area: 200,
      unit: 'sqm',
      parkingSpaces: 2
    },
    amenities: ['garden', 'fireplace', 'parking', 'security-guard'],
    images: [
      { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop', isPrimary: true, caption: 'Front View' },
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', caption: 'Living Room' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', caption: 'Garden' }
    ],
    contact: {
      phone: '+254700123457',
      email: 'karen@rentflow360.com',
      preferredContactMethod: 'phone'
    },
    status: 'active',
    featured: true,
    trending: true,
    views: 189,
    favorites: 28
  },
  {
    title: 'Penthouse with Rooftop in Westlands',
    description: 'Exclusive penthouse apartment with private rooftop terrace offering panoramic city views. Features premium finishes and modern amenities.',
    propertyType: 'penthouse',
    listingType: 'sale',
    price: { amount: 35000000, currency: 'KES' },
    location: {
      address: '789 Westlands Avenue',
      city: 'Nairobi',
      county: 'Nairobi',
      neighborhood: 'Westlands',
      coordinates: { latitude: -1.2676, longitude: 36.8098 }
    },
    specifications: {
      bedrooms: 3,
      bathrooms: 3,
      area: 250,
      unit: 'sqm',
      parkingSpaces: 2
    },
    amenities: ['terrace', 'elevator', 'gym', 'swimming-pool', 'security-guard'],
    images: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop', isPrimary: true, caption: 'Penthouse View' },
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', caption: 'Rooftop Terrace' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', caption: 'Interior' }
    ],
    contact: {
      phone: '+254700123458',
      email: 'westlands@rentflow360.com',
      preferredContactMethod: 'phone'
    },
    status: 'active',
    featured: true,
    trending: true,
    views: 312,
    favorites: 45
  },
  // Regular Properties
  {
    title: 'Cozy Studio in Kilimani',
    description: 'Perfect studio apartment for young professionals. Modern finishes and close to shopping centers and restaurants.',
    propertyType: 'studio',
    listingType: 'rent',
    price: { amount: 65000, currency: 'KES', period: 'monthly' },
    location: {
      address: '321 Kilimani Road',
      city: 'Nairobi',
      county: 'Nairobi',
      neighborhood: 'Kilimani',
      coordinates: { latitude: -1.2921, longitude: 36.7833 }
    },
    specifications: {
      bedrooms: 0,
      bathrooms: 1,
      area: 45,
      unit: 'sqm',
      parkingSpaces: 1
    },
    amenities: ['furnished', 'internet', 'security-guard'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', isPrimary: true, caption: 'Studio Layout' },
      { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop', caption: 'Kitchen Area' }
    ],
    contact: {
      phone: '+254700123459',
      email: 'kilimani@rentflow360.com',
      preferredContactMethod: 'phone'
    },
    status: 'active',
    featured: false,
    trending: false,
    views: 87,
    favorites: 12
  },
  {
    title: 'Spacious Family Home in Runda',
    description: 'Large 4-bedroom family home in exclusive Runda estate. Features swimming pool, landscaped garden, and 24/7 security.',
    propertyType: 'villa',
    listingType: 'sale',
    price: { amount: 45000000, currency: 'KES' },
    location: {
      address: '654 Runda Estate',
      city: 'Nairobi',
      county: 'Nairobi',
      neighborhood: 'Runda',
      coordinates: { latitude: -1.2167, longitude: 36.7833 }
    },
    specifications: {
      bedrooms: 4,
      bathrooms: 4,
      area: 350,
      unit: 'sqm',
      parkingSpaces: 3
    },
    amenities: ['swimming-pool', 'garage', 'garden', 'security-guard', 'gated-community'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', isPrimary: true, caption: 'Villa Exterior' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', caption: 'Swimming Pool' },
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop', caption: 'Living Area' }
    ],
    contact: {
      phone: '+254700123460',
      email: 'runda@rentflow360.com',
      preferredContactMethod: 'phone'
    },
    status: 'active',
    featured: false,
    trending: false,
    views: 156,
    favorites: 23
  },
  {
    title: 'Modern Maisonette in Lavington',
    description: 'Contemporary 3-bedroom maisonette with modern finishes. Open plan living and dining area with beautiful natural lighting.',
    propertyType: 'maisonette',
    listingType: 'rent',
    price: { amount: 120000, currency: 'KES', period: 'monthly' },
    location: {
      address: '987 Lavington Drive',
      city: 'Nairobi',
      county: 'Nairobi',
      neighborhood: 'Lavington',
      coordinates: { latitude: -1.2833, longitude: 36.7667 }
    },
    specifications: {
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      unit: 'sqm',
      parkingSpaces: 2
    },
    amenities: ['balcony', 'parking', 'security-guard', 'garden'],
    images: [
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', isPrimary: true, caption: 'Living Room' },
      { url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&h=600&fit=crop', caption: 'Dining Area' }
    ],
    contact: {
      phone: '+254700123461',
      email: 'lavington@rentflow360.com',
      preferredContactMethod: 'phone'
    },
    status: 'active',
    featured: false,
    trending: false,
    views: 134,
    favorites: 19
  },
  {
    title: 'Luxury Apartment in Upperhill',
    description: 'High-end 2-bedroom apartment in prestigious Upperhill area. Premium finishes and stunning city views.',
    propertyType: 'apartment',
    listingType: 'rent',
    price: { amount: 140000, currency: 'KES', period: 'monthly' },
    location: {
      address: '159 Upperhill Heights',
      city: 'Nairobi',
      county: 'Nairobi',
      neighborhood: 'Upperhill',
      coordinates: { latitude: -1.2921, longitude: 36.8219 }
    },
    specifications: {
      bedrooms: 2,
      bathrooms: 2,
      area: 130,
      unit: 'sqm',
      parkingSpaces: 1
    },
    amenities: ['balcony', 'gym', 'elevator', 'security-guard'],
    images: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop', isPrimary: true, caption: 'Living Room' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', caption: 'City View' }
    ],
    contact: {
      phone: '+254700123462',
      email: 'upperhill@rentflow360.com',
      preferredContactMethod: 'phone'
    },
    status: 'active',
    featured: true,
    trending: false,
    views: 203,
    favorites: 31
  },
  {
    title: 'Affordable Apartment in South B',
    description: 'Well-maintained 2-bedroom apartment in quiet South B neighborhood. Good access to public transport and amenities.',
    propertyType: 'apartment',
    listingType: 'rent',
    price: { amount: 85000, currency: 'KES', period: 'monthly' },
    location: {
      address: '741 South B Estate',
      city: 'Nairobi',
      county: 'Nairobi',
      neighborhood: 'South B',
      coordinates: { latitude: -1.3167, longitude: 36.8333 }
    },
    specifications: {
      bedrooms: 2,
      bathrooms: 1,
      area: 85,
      unit: 'sqm',
      parkingSpaces: 1
    },
    amenities: ['parking', 'water-supply', 'security-guard'],
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', isPrimary: true, caption: 'Living Room' },
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', caption: 'Bedroom' }
    ],
    contact: {
      phone: '+254700123463',
      email: 'southb@rentflow360.com',
      preferredContactMethod: 'phone'
    },
    status: 'active',
    featured: false,
    trending: false,
    views: 98,
    favorites: 14
  }
];

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function seedUsers() {
  console.log('🌱 Seeding users...');
  
  for (const userData of sampleUsers) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⏭️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();
      console.log(`✅ Created user: ${userData.firstName} ${userData.lastName} (${userData.role})`);
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error.message);
    }
  }
}

async function seedProperties() {
  console.log('🏠 Seeding properties...');
  
  // Get all agents for random assignment
  const agents = await User.find({ role: 'agent' });
  if (agents.length === 0) {
    console.error('❌ No agents found! Please seed users first.');
    return;
  }

  for (const propertyData of sampleProperties) {
    try {
      // Check if property already exists (by title)
      const existingProperty = await Property.findOne({ title: propertyData.title });
      if (existingProperty) {
        console.log(`⏭️  Property "${propertyData.title}" already exists, skipping...`);
        continue;
      }

      // Assign random agent
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      
      // Generate slug
      const slug = propertyData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Create property
      const property = new Property({
        ...propertyData,
        owner: randomAgent._id,
        agent: randomAgent._id, // Just the ObjectId reference
        slug: slug,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        updatedAt: new Date()
      });

      await property.save();
      console.log(`✅ Created property: ${propertyData.title} (${propertyData.trending ? 'TRENDING' : 'regular'})`);
    } catch (error) {
      console.error(`❌ Error creating property "${propertyData.title}":`, error.message);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting database seeding...\n');
    
    await connectDB();
    await seedUsers();
    await seedProperties();
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    
    const userCount = await User.countDocuments();
    const propertyCount = await Property.countDocuments();
    const trendingCount = await Property.countDocuments({ trending: true });
    const featuredCount = await Property.countDocuments({ featured: true });
    
    console.log(`   Users: ${userCount}`);
    console.log(`   Properties: ${propertyCount}`);
    console.log(`   Trending Properties: ${trendingCount}`);
    console.log(`   Featured Properties: ${featuredCount}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();