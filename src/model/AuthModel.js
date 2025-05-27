const BASE_URL = 'https://story-api.dicoding.dev/v1';

const AuthModel = {
  async login({ email, password }) {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      return data.loginResult;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isLoggedIn() { return !!this.getToken(); },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default AuthModel;