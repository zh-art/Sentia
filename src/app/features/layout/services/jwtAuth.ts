export async function loginWithJWT() {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: 'testuser',
          password: 'password',
        }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error('Login failed');
  
      const { token } = await response.json();
  
      localStorage.setItem('token', token);
  
      return token;
    } catch (error) {
      console.error('JWT login failed:', error);
      throw error;
    }
  }
  
  export async function logoutWithJWT() {
    try {
      localStorage.removeItem('token');
      console.log('Logged out with JWT');
    } catch (error) {
      console.error('JWT logout failed:', error);
      throw error;
    }
  }
  