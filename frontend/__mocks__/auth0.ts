export const getSession = jest.fn(() => ({
  user: { email: 'test@mail.com' },
}));

export const withApiAuthRequired = (fn: any) => fn;
export const withPageAuthRequired = (fn: any) => fn;
