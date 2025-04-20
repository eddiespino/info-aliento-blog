import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useKeychain } from '@/context/KeychainContext';
import LoginModal from '../modals/LoginModal';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '../ThemeToggle';

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
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm transition-colors duration-200">
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
                <Link href="/" className={`px-3 py-2 text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                  Home
                </Link>
                <Link href="/witnesses" className={`px-3 py-2 text-sm font-medium ${isActive('/witnesses') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                  Witnesses
                </Link>
                <Link href="/about" className={`px-3 py-2 text-sm font-medium ${isActive('/about') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                  About Aliento
                </Link>
              </nav>
            </div>
            
            {/* Authentication */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              {!isLoggedIn ? (
                <Button
                  onClick={handleLogin}
                  variant="default"
                  className="inline-flex items-center justify-center"
                >
                  <span className="material-symbols-outlined mr-1">login</span>
                  <span className="hidden sm:inline">Login with Keychain</span>
                  <span className="sm:hidden">Login</span>
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
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {/* Mobile menu button */}
              <button 
                type="button" 
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden fixed inset-0 z-40 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="fixed inset-y-0 right-0 max-w-xs w-full bg-background shadow-xl transform transition-transform duration-300 ease-in-out"
            style={{ width: '80%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-4 py-5 border-b border-border">
              <span className="text-lg font-semibold">Menu</span>
              <button 
                type="button" 
                className="text-muted-foreground hover:text-foreground focus:outline-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1 overflow-y-auto">
              <Link 
                href="/" 
                className={`block px-4 py-3 rounded-md text-base font-medium ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined align-bottom mr-2">home</span>
                Home
              </Link>
              <Link 
                href="/witnesses" 
                className={`block px-4 py-3 rounded-md text-base font-medium ${isActive('/witnesses') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined align-bottom mr-2">supervised_user_circle</span>
                Witnesses
              </Link>
              <Link 
                href="/about" 
                className={`block px-4 py-3 rounded-md text-base font-medium ${isActive('/about') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined align-bottom mr-2">info</span>
                About Aliento
              </Link>
              
              {/* Divider */}
              <div className="my-3 border-t border-border"></div>
              
              {/* Account section */}
              <div className="px-4 py-3">
                {!isLoggedIn ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Log in with Hive Keychain to vote for witnesses</p>
                    <Button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogin();
                      }}
                      variant="default"
                      className="w-full"
                    >
                      <span className="material-symbols-outlined mr-2">login</span>
                      Login with Keychain
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-3">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage 
                          src={user?.profileImage} 
                          alt={user?.username || 'User profile'} 
                        />
                        <AvatarFallback>
                          {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">@{user?.username}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive p-0 h-auto"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleLogout();
                          }}
                        >
                          Sign out
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
