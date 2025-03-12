export async function loginWithOAuth() {
  try {
    // Redirigir al proveedor de OAuth
    window.location.href = `https://accounts.google.com/o/oauth2/auth?
      client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&
      redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&
      response_type=token&
      scope=email%20profile`;
  } catch (error) {
    console.error('OAuth login failed:', error);
    throw error;
  }
}

export async function logoutWithOAuth() {
  try {
    // Esto dependerá del proveedor OAuth (algunos requieren invalidar tokens)
    console.log('Logged out with OAuth');
  } catch (error) {
    console.error('OAuth logout failed:', error);
    throw error;
  }
}
