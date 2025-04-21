import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useKeychain } from '@/context/KeychainContext';
import LoginModal from '../modals/LoginModal';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '../ThemeToggle';
import alientoLogo from '@/assets/aliento-logo.png';

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
        <div className="container mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center flex-shrink-0">
              <div className="flex-shrink-0 mr-1 sm:mr-0">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                  {/* Inline SVG for Aliento logo - ensures it always displays */}
                  <svg 
                    viewBox="0 0 100 100" 
                    className="h-8 w-8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="50" fill="#222B38" />
                    <path d="M31.25 26.04C35.42 26.04 38.54 29.17 38.54 33.33C38.54 37.5 35.42 40.62 31.25 40.62C27.08 40.62 23.96 37.5 23.96 33.33C23.96 29.17 27.08 26.04 31.25 26.04Z" fill="#fff" />
                    <path d="M50 33.33C54.17 33.33 57.29 36.46 57.29 40.63C57.29 44.79 54.17 47.92 50 47.92C45.83 47.92 42.71 44.79 42.71 40.63C42.71 36.46 45.83 33.33 50 33.33Z" fill="#fff" />
                    <path d="M68.75 26.04C72.92 26.04 76.04 29.17 76.04 33.33C76.04 37.5 72.92 40.62 68.75 40.62C64.58 40.62 61.46 37.5 61.46 33.33C61.46 29.17 64.58 26.04 68.75 26.04Z" fill="#fff" />
                    <path d="M31.25 59.38C35.42 59.38 38.54 62.5 38.54 66.67C38.54 70.83 35.42 73.96 31.25 73.96C27.08 73.96 23.96 70.83 23.96 66.67C23.96 62.5 27.08 59.38 31.25 59.38Z" fill="#fff" />
                    <path d="M68.75 59.38C72.92 59.38 76.04 62.5 76.04 66.67C76.04 70.83 72.92 73.96 68.75 73.96C64.58 73.96 61.46 70.83 61.46 66.67C61.46 62.5 64.58 59.38 68.75 59.38Z" fill="#fff" />
                    <path d="M31.25 40.62V59.38" stroke="#fff" strokeWidth="3" />
                    <path d="M31.25 40.62L50 47.92" stroke="#fff" strokeWidth="3" />
                    <path d="M31.25 59.38L50 47.92" stroke="#fff" strokeWidth="3" />
                    <path d="M68.75 40.62L50 47.92" stroke="#fff" strokeWidth="3" />
                    <path d="M68.75 40.62V59.38" stroke="#fff" strokeWidth="3" />
                    <path d="M68.75 59.38L50 47.92" stroke="#fff" strokeWidth="3" />
                  </svg>
                  <span className="text-lg font-semibold hidden xs:inline-block">Aliento Witness</span>
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
            <div className="flex items-center gap-2">
              <div className="ml-auto mr-2">
                <ThemeToggle />
              </div>
              
              {!isLoggedIn ? (
                <Button
                  onClick={handleLogin}
                  variant="default"
                  size="sm"
                  className="inline-flex items-center justify-center px-2 py-1 h-8 text-xs"
                >
                  <span className="material-symbols-outlined text-xs mr-1">login</span>
                  <span className="hidden sm:inline">Login with Keychain</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={user?.profileImage} 
                            alt={user?.username || 'User profile'} 
                          />
                          <AvatarFallback>
                            {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:flex flex-col">
                          <span className="text-sm font-medium">@{user?.username}</span>
                          <span className="text-xs text-muted-foreground">
                            {user?.hivePower} <span className="opacity-70">(own)</span>
                          </span>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <div className="p-2 text-sm">
                      <div className="flex flex-col space-y-1 mb-2">
                        <div className="text-muted-foreground">Own Hive Power:</div>
                        <div className="font-medium">{user?.hivePower}</div>
                      </div>
                      <div className="flex flex-col space-y-1 mb-2">
                        <div className="text-muted-foreground">Effective Hive Power:</div>
                        <div className="font-medium">{user?.effectiveHivePower}</div>
                        <div className="text-xs text-muted-foreground">
                          (includes delegations in/out)
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1 mb-2">
                        <div className="text-muted-foreground">Witness Votes:</div>
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/20 text-primary font-medium px-2 py-0.5 rounded-full text-xs">
                            {user?.freeWitnessVotes} free votes
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({30 - (user?.freeWitnessVotes || 0)}/30 used)
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 border-t border-border pt-2">
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                          Logout
                        </DropdownMenuItem>
                      </div>
                    </div>
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
                      <div className="flex flex-col">
                        <div className="font-medium">@{user?.username}</div>
                        <div className="text-xs text-muted-foreground">
                          {user?.hivePower} <span className="opacity-70">(own)</span>
                        </div>
                        <div className="text-xs mt-1">
                          <span className="bg-primary/20 text-primary font-medium px-2 py-0.5 rounded-full">
                            {user?.freeWitnessVotes} free votes
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive p-0 h-auto mt-2"
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
