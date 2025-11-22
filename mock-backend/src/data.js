import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Hash password for demo user
const hashedPassword = bcrypt.hashSync('demo123', 10);

// Demo Users
export const users = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'demo@watchpassport.com',
    password: hashedPassword,
    firstName: 'John',
    lastName: 'Collector',
    phoneNumber: '+1-555-0123',
    kycStatus: 'verified',
    kycVerifiedAt: new Date('2024-01-15').toISOString(),
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'collector@example.com',
    password: hashedPassword,
    firstName: 'Sarah',
    lastName: 'Williams',
    phoneNumber: '+1-555-0456',
    kycStatus: 'verified',
    kycVerifiedAt: new Date('2024-02-01').toISOString(),
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
];

// Demo Watches
export const watches = [
  {
    id: uuidv4(),
    serialNumber: 'RLX-SUB-2023-001234',
    brand: 'Rolex',
    model: 'Submariner Date',
    referenceNumber: '126610LN',
    yearOfProduction: 2023,
    caseMaterial: 'Oystersteel',
    dialColor: 'Black',
    braceletMaterial: 'Oystersteel',
    movement: 'Calibre 3235',
    waterResistance: '300m',
    estimatedValue: 12500,
    purchasePrice: 11800,
    purchaseDate: new Date('2023-06-15').toISOString(),
    purchaseLocation: 'Official Rolex Boutique, Geneva',
    certificateOfAuthenticity: true,
    boxAndPapers: true,
    warrantyValid: true,
    warrantyExpirationDate: new Date('2028-06-15').toISOString(),
    condition: 'Excellent',
    images: ['/api/placeholder/600/400'],
    status: 'certified',
    currentOwnerId: '550e8400-e29b-41d4-a716-446655440000',
    blockchainHash: '0x1234567890abcdef1234567890abcdef12345678',
    createdAt: new Date('2023-06-16').toISOString(),
    updatedAt: new Date('2023-06-16').toISOString(),
  },
  {
    id: uuidv4(),
    serialNumber: 'PP-NAU-2022-005678',
    brand: 'Patek Philippe',
    model: 'Nautilus',
    referenceNumber: '5711/1A-010',
    yearOfProduction: 2022,
    caseMaterial: 'Stainless Steel',
    dialColor: 'Blue',
    braceletMaterial: 'Stainless Steel',
    movement: 'Calibre 26-330 S C',
    waterResistance: '120m',
    estimatedValue: 95000,
    purchasePrice: 32000,
    purchaseDate: new Date('2022-03-10').toISOString(),
    purchaseLocation: 'Patek Philippe Boutique, Paris',
    certificateOfAuthenticity: true,
    boxAndPapers: true,
    warrantyValid: true,
    warrantyExpirationDate: new Date('2024-03-10').toISOString(),
    condition: 'Mint',
    images: ['/api/placeholder/600/400'],
    status: 'certified',
    currentOwnerId: '550e8400-e29b-41d4-a716-446655440000',
    blockchainHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    createdAt: new Date('2022-03-11').toISOString(),
    updatedAt: new Date('2022-03-11').toISOString(),
  },
  {
    id: uuidv4(),
    serialNumber: 'AP-RO-2021-009876',
    brand: 'Audemars Piguet',
    model: 'Royal Oak',
    referenceNumber: '15500ST.OO.1220ST.01',
    yearOfProduction: 2021,
    caseMaterial: 'Stainless Steel',
    dialColor: 'Blue',
    braceletMaterial: 'Stainless Steel',
    movement: 'Calibre 4302',
    waterResistance: '50m',
    estimatedValue: 62000,
    purchasePrice: 28000,
    purchaseDate: new Date('2021-11-20').toISOString(),
    purchaseLocation: 'AP Boutique, New York',
    certificateOfAuthenticity: true,
    boxAndPapers: true,
    warrantyValid: false,
    condition: 'Very Good',
    images: ['/api/placeholder/600/400'],
    status: 'certified',
    currentOwnerId: '550e8400-e29b-41d4-a716-446655440000',
    blockchainHash: '0x9876543210fedcba9876543210fedcba98765432',
    createdAt: new Date('2021-11-21').toISOString(),
    updatedAt: new Date('2021-11-21').toISOString(),
  },
];

// Demo Watch History
export const watchHistory = [
  {
    id: uuidv4(),
    watchId: watches[0].id,
    eventType: 'certification',
    description: 'Watch certified and registered on blockchain',
    performedBy: users[0].id,
    eventDate: new Date('2023-06-16').toISOString(),
    blockchainHash: watches[0].blockchainHash,
    createdAt: new Date('2023-06-16').toISOString(),
  },
  {
    id: uuidv4(),
    watchId: watches[0].id,
    eventType: 'service',
    description: 'Regular maintenance performed at authorized service center',
    performedBy: users[0].id,
    eventDate: new Date('2024-06-10').toISOString(),
    notes: 'Full service, water resistance tested, movement regulated',
    createdAt: new Date('2024-06-10').toISOString(),
  },
];

// Demo Transfers
export const transfers = [
  {
    id: uuidv4(),
    watchId: watches[1].id,
    fromUserId: users[0].id,
    toUserId: null,
    transferToken: 'TRF-' + Date.now(),
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    status: 'pending',
    expiresAt: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // 2 minutes
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Demo Stolen Reports
export const stolenReports = [];

export default {
  users,
  watches,
  watchHistory,
  transfers,
  stolenReports,
};
