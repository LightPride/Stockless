// Mock Database for Stockless Platform

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  tags: string[];
  restrictions: string[];
  socialMediaConnected: boolean;
  socialMediaType: string;
  gallery: MediaItem[];
  contractSigned: boolean;
}

export interface MediaItem {
  id: string;
  thumb: string;
  permalink: string;
  caption: string;
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
}

export interface LicenseRequest {
  id: string;
  buyerId: string;
  creatorId: string;
  media: string[];
  status: 'Pending' | 'Completed' | 'Rejected';
  licenseTerms: {
    mediaType: 'Photo' | 'Video';
    editingRights: boolean;
    duration: string;
    exclusivity: boolean;
  };
  createdAt: string;
  price: number;
}

export interface User {
  id: string;
  email: string;
  role: 'buyer' | 'creator';
  name: string;
}

// Mock Users for Authentication
export const mockUsers: User[] = [
  { id: 'buyer1', email: 'buyer@demo.com', role: 'buyer', name: 'Acme Agency' },
  { id: 'creator1', email: 'alice@demo.com', role: 'creator', name: 'Alice Johnson' },
  { id: 'creator2', email: 'bob@demo.com', role: 'creator', name: 'Bob Wilson' },
  { id: 'creator3', email: 'sara@demo.com', role: 'creator', name: 'Sara Chen' },
  { id: 'creator4', email: 'john@demo.com', role: 'creator', name: 'John Doe' },
];

// Mock Creators Database
export const mockCreators: Creator[] = [
  {
    id: 'creator1',
    name: 'Alice Johnson',
    avatar: 'file:///Users/irynavynnyk/Desktop/2025-09-13%2008.55.41.jpg',
    tags: ['Sports', 'Nature', 'Adventure', 'Fitness', 'Outdoor'],
    restrictions: ['Not for alcohol', 'Not for political ads'],
    socialMediaConnected: true,
    socialMediaType: 'Instagram',
    contractSigned: true,
    gallery: [
      {
        id: 'media1',
        thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=640&fit=crop',
        permalink: 'https://instagram.com/p/FAKE123',
        caption: 'Sunset in Bali'
      },
      {
        id: 'media2',
        thumb: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=640&h=640&fit=crop',
        permalink: 'https://instagram.com/p/FAKE124',
        caption: 'Mountain hike'
      },
      {
        id: 'media3',
        thumb: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=640&h=640&fit=crop',
        permalink: 'https://instagram.com/p/FAKE125',
        caption: 'Running at dawn'
      },
      {
        id: 'media4',
        thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=640&h=640&fit=crop',
        permalink: 'https://instagram.com/p/FAKE126',
        caption: 'Forest trail'
      },
      {
        id: 'media5',
        thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=640&fit=crop',
        permalink: 'https://instagram.com/p/FAKE127',
        caption: 'Ocean sunset'
      },
      {
        id: 'media6',
        thumb: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=640&h=640&fit=crop',
        permalink: 'https://instagram.com/p/FAKE128',
        caption: 'Peak view'
      }
    ]
  },
  {
    id: 'creator2',
    name: 'Bob Wilson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    tags: ['Fashion', 'Lifestyle', 'Urban', 'Memes', 'Comedy', 'Entertainment'],
    restrictions: ['Not for competitors'],
    socialMediaConnected: true,
    socialMediaType: 'Instagram',
    contractSigned: true,
    gallery: [
      {
        id: 'media7',
        thumb: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=640&h=640&fit=crop',
        permalink: 'https://instagram.com/p/FAKE129',
        caption: 'Street style'
      },
      {
        id: 'media8',
        thumb: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=640&h=640&fit=crop',
        permalink: 'https://instagram.com/p/FAKE130',
        caption: 'Urban coffee'
      },
      {
        id: 'media9',
        thumb: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=640&h=640&fit=crop',
        permalink: 'https://instagram.com/p/FAKE131',
        caption: 'City lights'
      }
    ]
  },
  {
    id: 'creator3',
    name: 'Sara Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    tags: ['Food', 'Travel', 'Culture', 'Art', 'Design', 'Beauty'],
    restrictions: ['No fast food brands'],
    socialMediaConnected: true,
    socialMediaType: 'Instagram',
    contractSigned: true,
    gallery: [
      {
        id: 'media10',
        thumb: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=640&h=640&fit=crop',
        permalink: 'https://instagram.com/p/FAKE132',
        caption: 'Asian cuisine'
      },
      {
        id: 'media11',
        thumb: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=640&h=640&fit=crop',
        permalink: 'https://instagram.com/p/FAKE133',
        caption: 'Restaurant vibes'
      },
      {
        id: 'media12',
        thumb: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=640&h=640&fit=crop',
        permalink: 'https://instagram.com/p/FAKE134',
        caption: 'Travel memories'
      }
    ]
  },
  {
    id: 'creator4',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    tags: ['Technology', 'Business', 'Education', 'Gaming', 'Music'],
    restrictions: ['Commercial use only'],
    socialMediaConnected: false,
    socialMediaType: 'Instagram',
    contractSigned: false,
    gallery: []
  }
];

// Mock Buyers Database  
export const mockBuyers: Buyer[] = [
  {
    id: 'buyer1',
    name: 'Acme Agency',
    email: 'acme@example.com'
  }
];

// Mock License Requests Database
export const mockRequests: LicenseRequest[] = [
  {
    id: 'req1',
    buyerId: 'buyer1',
    creatorId: 'creator1',
    media: ['media1', 'media2'],
    status: 'Completed',
    licenseTerms: {
      mediaType: 'Photo',
      editingRights: false,
      duration: '12 months',
      exclusivity: true
    },
    createdAt: '2024-01-15',
    price: 299
  },
  {
    id: 'req2',
    buyerId: 'buyer1',
    creatorId: 'creator2',
    media: ['media7'],
    status: 'Pending',
    licenseTerms: {
      mediaType: 'Video',
      editingRights: true,
      duration: '6 months',
      exclusivity: false
    },
    createdAt: '2024-01-20',
    price: 149
  }
];