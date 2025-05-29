import { getSession } from '@auth0/nextjs-auth0';

test('Crea sesión autenticada', () => {
  const session = getSession();
  expect(session.user.email).toBe('test@mail.com');
});


