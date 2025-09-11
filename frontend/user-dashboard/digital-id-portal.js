// Digital ID Portal for Tourists

const API_BASE_URL = 'https://api.tourist-safety-system.com';

class DigitalIDPortal {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupEventListeners();
      this.checkAuthStatus();
    });
  }

  setupEventListeners() {
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.handleLogout();
      });
    }

    // Download ID button
    const downloadBtn = document.getElementById('download-id-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadDigitalID();
      });
    }

    // Share ID button
    const shareBtn = document.getElementById('share-id-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.shareDigitalID();
      });
    }

    // Verify ID button
    const verifyBtn = document.getElementById('verify-id-btn');
    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => {
        this.verifyDigitalID();
      });
    }
  }

  async checkAuthStatus() {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        this.showLoginView();
        return;
      }

      // Verify token with backend
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        this.showDashboardView(userData);
      } else {
        // Token invalid or expired
        localStorage.removeItem('auth_token');
        this.showLoginView();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.showLoginView();
    }
  }

  async handleLogin() {
    try {
      const phoneNumber = document.getElementById('phone').value;
      const password = document.getElementById('password').value;

      if (!phoneNumber || !password) {
        this.showNotification('Please enter both phone number and password', 'error');
        return;
      }

      // In a real implementation, this would be an actual API call
      // For demo purposes, we'll simulate a successful login
      const loginSuccessful = await this.simulateApiCall('/api/auth/login', {
        phone: phoneNumber,
        password: password
      });

      if (loginSuccessful) {
        // Store token and user data
        localStorage.setItem('auth_token', 'demo_token_12345');
        
        // Fetch user data
        const userData = await this.simulateApiCall('/api/tourists/me');
        
        this.showDashboardView(userData);
        this.showNotification('Login successful!', 'success');
      } else {
        this.showNotification('Invalid credentials. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showNotification('An error occurred during login. Please try again.', 'error');
    }
  }

  handleLogout() {
    localStorage.removeItem('auth_token');
    this.showLoginView();
    this.showNotification('You have been logged out successfully', 'success');
  }

  showLoginView() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('dashboard-container').style.display = 'none';
  }

  showDashboardView(userData) {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'block';

    // Update user info
    document.getElementById('user-name').textContent = userData.name;
    document.getElementById('digital-id-value').textContent = userData.digitalId;
    document.getElementById('safety-score-value').textContent = userData.safetyScore;
    
    // Update QR code
    document.getElementById('qr-code-img').src = userData.qrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(userData.digitalId);
    
    // Update validity dates
    document.getElementById('valid-from').textContent = new Date(userData.validFrom).toLocaleDateString();
    document.getElementById('valid-until').textContent = new Date(userData.validUntil).toLocaleDateString();
    
    // Update emergency contacts
    const contactsList = document.getElementById('emergency-contacts-list');
    contactsList.innerHTML = '';
    
    if (userData.emergencyContacts && userData.emergencyContacts.length > 0) {
      userData.emergencyContacts.forEach(contact => {
        const li = document.createElement('li');
        li.textContent = `${contact.name}: ${contact.phone}`;
        contactsList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'No emergency contacts added';
      contactsList.appendChild(li);
    }
    
    // Update trip details
    document.getElementById('trip-start').textContent = new Date(userData.tripStart).toLocaleDateString();
    document.getElementById('trip-end').textContent = new Date(userData.tripEnd).toLocaleDateString();
    document.getElementById('trip-location').textContent = userData.location;
  }

  downloadDigitalID() {
    // In a real implementation, this would generate a PDF or image file
    // For demo purposes, we'll just show a notification
    this.showNotification('Digital ID downloaded successfully!', 'success');
  }

  shareDigitalID() {
    // In a real implementation, this would open a share dialog
    // For demo purposes, we'll just show a notification
    this.showNotification('Share feature will be available soon!', 'info');
  }

  async verifyDigitalID() {
    try {
      // In a real implementation, this would verify the ID with the blockchain
      // For demo purposes, we'll simulate a successful verification
      const verificationResult = await this.simulateApiCall('/api/digital-id/verify');
      
      if (verificationResult.verified) {
        this.showNotification('Digital ID verified successfully!', 'success');
      } else {
        this.showNotification('Digital ID verification failed!', 'error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      this.showNotification('An error occurred during verification', 'error');
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Helper method to simulate API calls for demo purposes
  async simulateApiCall(endpoint, data = null) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock responses for different endpoints
    switch (endpoint) {
      case '/api/auth/login':
        // Check if credentials match our demo account
        return data.phone === '9876543210' && data.password === 'password123';
        
      case '/api/tourists/me':
        // Return mock user data
        return {
          id: 'usr_12345',
          name: 'John Doe',
          digitalId: 'TSN-1234567890',
          safetyScore: 95,
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TSN-1234567890',
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          emergencyContacts: [
            { name: 'Jane Doe', phone: '9876543211' },
            { name: 'Emergency Services', phone: '112' }
          ],
          tripStart: new Date().toISOString(),
          tripEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          location: 'Guwahati, Assam'
        };
        
      case '/api/digital-id/verify':
        // Return mock verification result
        return {
          verified: true,
          verifiedBy: 'Blockchain Verification Service',
          timestamp: new Date().toISOString()
        };
        
      default:
        return null;
    }
  }
}

// Initialize the app
const app = new DigitalIDPortal();