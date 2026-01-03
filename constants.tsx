
export const COLORS = {
  // Light Mode: Vintage Journal
  parchment: '#F2EFE9',
  navy: '#1D3557',
  sage: '#8AB17D',
  charcoal: '#2B2D42',
  slate: '#4A4E69',
  gold: '#E9C46A',
  white: '#FFFFFF',
  
  // Dark Mode: Midnight Library
  ink: '#1B1D23',
  deepslate: '#2C2F36',
  teal: '#A8DADC',
  burnt: '#E76F51',
  offwhite: '#F1FAEE',
  lightgrey: '#CED4DA',
  steel: '#457B9D',
  
  // Legacy support
  primaryBlue: '#3B82F6',
  successGreen: '#10B981',
  warningAmber: '#F59E0B',
  errorRed: '#EF4444',
};

export const CATEGORY_COLORS = [
  '#1D3557', '#8AB17D', '#E9C46A', '#A8DADC', '#E76F51', '#457B9D', '#3B82F6', '#10B981'
];

export const MOCK_USER: any = {
  uid: 'user_123',
  email: 'hello@ephemera.io',
  displayName: 'Alex Rivers',
  preferences: {
    theme: 'light',
    defaultView: 'grid',
    language: 'en'
  },
  createdAt: Date.now(),
  lastLogin: Date.now()
};
