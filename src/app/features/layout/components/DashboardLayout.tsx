"use client";
import { useAuth } from './AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md w-full">
        <h1 className="text-lg font-bold">Sentia</h1>
        <div className="flex space-x-2">
        {isLoggedIn ? (
            <button
              onClick={() => logout('jwt')}
              className="px-4 py-2 bg-red-950 rounded-md hover:bg-red-600"
            >
              Cerrar sesión (JWT)
            </button>
          ) : (
            <>
              <button
                onClick={() => login('jwt')}
                className="px-4 py-2 bg-blue-950 rounded-md hover:bg-blue-600 mr-2"
              >
                Iniciar sesión (JWT)
              </button>
              <button
                onClick={() => login('oauth')}
                className="px-4 py-2 bg-green-950 rounded-md hover:bg-green-600"
              >
                Iniciar sesión (OAuth)
              </button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 p-4 overflow-auto w-full">
        {children}
      </main>
    </div>
  );
}
