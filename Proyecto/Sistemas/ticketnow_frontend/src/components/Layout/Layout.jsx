import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen relative">
      <nav className="bg-cyan-600 relative z-50">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Logo y navegación */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <Link
                  to="/"
                  className="hidden sm:block text-xl font-bold text-white"
                >
                  TicketNow
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className={`${
                      isActive("/")
                        ? "bg-cyan-700 text-white"
                        : "text-gray-300 hover:text-white"
                    } rounded-md px-3 py-2 text-sm font-medium`}
                  >
                    Inicio
                  </Link>
                  <Link
                    to="/events"
                    className={`${
                      isActive("/events")
                        ? "bg-cyan-700 text-white"
                        : "text-gray-300 hover:text-white"
                    } rounded-md px-3 py-2 text-sm font-medium`}
                  >
                    Eventos
                  </Link>
                  <Link
                    to="/about"
                    className={`${
                      isActive("/about")
                        ? "bg-cyan-700 text-white"
                        : "text-gray-300 hover:text-white"
                    } rounded-md px-3 py-2 text-sm font-medium`}
                  >
                    Nosotros
                  </Link>
                  {user && (
                    <Link
                      to="/my-reservations"
                      className={`${
                        isActive("/my-reservations")
                          ? "bg-cyan-700 text-white"
                          : "text-gray-300 hover:text-white"
                      } rounded-md px-3 py-2 text-sm font-medium`}
                    >
                      Mis Reservas
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-white text-sm">
                    Bienvenido, {user.username}
                  </span>
                  <button
                    onClick={logout}
                    className="text-gray-300 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="ml-4 inline-flex items-center bg-white px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              to="/"
              className={`${
                isActive("/")
                  ? "bg-cyan-700 text-white"
                  : "text-gray-300 hover:bg-cyan-700 hover:text-white"
              } block rounded-md px-3 py-2 text-base font-medium`}
            >
              Inicio
            </Link>
            <Link
              to="/events"
              className={`${
                isActive("/events")
                  ? "bg-cyan-700 text-white"
                  : "text-gray-300 hover:bg-cyan-700 hover:text-white"
              } block rounded-md px-3 py-2 text-base font-medium`}
            >
              Eventos
            </Link>
            <Link
              to="/about"
              className={`${
                isActive("/about")
                  ? "bg-cyan-700 text-white"
                  : "text-gray-300 hover:bg-cyan-700 hover:text-white"
              } block rounded-md px-3 py-2 text-base font-medium`}
            >
              Nosotros
            </Link>
            {user && (
              <Link
                to="/my-reservations"
                className={`${
                  isActive("/my-reservations")
                    ? "bg-cyan-700 text-white"
                    : "text-gray-300 hover:bg-cyan-700 hover:text-white"
                } block rounded-md px-3 py-2 text-base font-medium`}
              >
                Mis Reservas
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-0">{children}</main>
    </div>
  );
}

export default Layout;
