import { loginWithJWT, logoutWithJWT } from './jwtAuth';
import { loginWithOAuth, logoutWithOAuth } from './oauthAuth';

export const login = async (method: 'jwt' | 'oauth') => {
  if (method === 'jwt') {
    return await loginWithJWT();
  } else if (method === 'oauth') {
    return await loginWithOAuth();
  }
};

export const logout = async (method: 'jwt' | 'oauth') => {
  if (method === 'jwt') {
    return await logoutWithJWT();
  } else if (method === 'oauth') {
    return await logoutWithOAuth();
  }
};
