
/**
 * Mock AuthService for testing
 */

const mockAuthService = {
  login: jest.fn().mockResolvedValue({
    access_token: 'mock_token',
    refresh_token: 'mock_refresh_token',
    tourist: {
      id: 'tourist-1234',
      name: 'Test User',
      phone: '9876543210',
      safety_score: 100,
      entry_point: 'Mobile App Registration',
      is_active: true
    }
  }),
  register: jest.fn().mockResolvedValue({
    access_token: 'mock_token',
    refresh_token: 'mock_refresh_token',
    tourist: {
      id: 'tourist-1234',
      name: 'Test User',
      phone: '9876543210',
      safety_score: 100,
      entry_point: 'Mobile App Registration',
      is_active: true
    },
    digital_id: {
      id: 'TSN-1234567890',
      blockchain_hash: '0x1234567890abcdef',
      issued_date: new Date().toISOString(),
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  }),
  verifyDigitalId: jest.fn().mockResolvedValue(true)
};

module.exports = mockAuthService;
