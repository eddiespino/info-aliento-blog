import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useKeychain } from '@/context/KeychainContext';
import LoginModal from '../modals/LoginModal';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { isLoggedIn, user, logout } = useKeychain();
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogin = () => {
    setLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-500 text-3xl">
                    hub
                  </span>
                  <span className="text-lg font-semibold">Aliento Witness</span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <Link href="/" className={`px-3 py-2 text-sm font-medium ${isActive('/') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>
                  Home
                </Link>
                <Link href="/witnesses" className={`px-3 py-2 text-sm font-medium ${isActive('/witnesses') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>
                  Witnesses
                </Link>
                <Link href="/about" className={`px-3 py-2 text-sm font-medium ${isActive('/about') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>
                  About Aliento
                </Link>
              </nav>
            </div>
            
            {/* Authentication */}
            <div className="flex items-center gap-4">
              {!isLoggedIn ? (
                <Button
                  onClick={handleLogin}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary-500 text-white hover:bg-primary-600"
                >
                  <span className="material-symbols-outlined mr-1">login</span>
                  Login with Keychain
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={user?.profileImage} 
                            alt={user?.username || 'User profile'} 
                          />
                          <AvatarFallback>
                            {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">@{user?.username}</span>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {/* Mobile menu button */}
              <button 
                type="button" 
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? '' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'}`}>
              Home
            </Link>
            <Link href="/witnesses" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/witnesses') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'}`}>
              Witnesses
            </Link>
            <Link href="/about" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/about') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'}`}>
              About Aliento
            </Link>
          </div>
        </div>
      </header>

      <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
