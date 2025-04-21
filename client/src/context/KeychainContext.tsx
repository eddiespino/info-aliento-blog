import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { UserData, LoginResponse, VoteWitnessResponse } from '@/types/hive';
// Type definitions are imported via the .d.ts file automatically

// Create a context for Keychain functionality
interface KeychainContextType {
  keychain: Window['hive_keychain'] | null;
  user: UserData | null;
  isLoggedIn: boolean;
  isKeychainInstalled: boolean;
  login: (username: string) => Promise<LoginResponse>;
  logout: () => void;
  voteWitness: (witness: string, approve: boolean) => Promise<VoteWitnessResponse>;
  isDevelopmentMode: boolean;
}

// Create default context values
const defaultContextValue: KeychainContextType = {
  keychain: null,
  user: null,
  isLoggedIn: false,
  isKeychainInstalled: false,
  login: async () => ({ success: false, error: 'Context not initialized' }),
  logout: () => {},
  voteWitness: async () => ({ success: false, error: 'Context not initialized' }),
  isDevelopmentMode: false
};

// Create the context
const KeychainContext = createContext<KeychainContextType>(defaultContextValue);

// Provider component
export const KeychainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [keychain, setKeychain] = useState<Window['hive_keychain'] | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isKeychainInstalled, setIsKeychainInstalled] = useState(false);
  
  // For development environment
  const isDevelopmentMode = import.meta.env.DEV || import.meta.env.MODE === 'development';
  const [useDevelopmentMode, setUseDevelopmentMode] = useState(isDevelopmentMode);

  // Check if Keychain is installed
  useEffect(() => {
    const checkKeychain = () => {
      // Check if window.hive_keychain exists
      if (typeof window !== 'undefined' && 'hive_keychain' in window) {
        console.log('Hive Keychain extension detected');
        setKeychain((window as any).hive_keychain);
        setIsKeychainInstalled(true);
        return true;
      } else {
        console.log('Hive Keychain extension not detected');
        return false;
      }
    };

    // First immediate check
    const initialCheck = checkKeychain();
    
    // If keychain not found initially, try a few more times with delay
    // Sometimes browser extensions take a moment to initialize
    if (!initialCheck) {
      let attempts = 0;
      const maxAttempts = 3;
      const checkInterval = setInterval(() => {
        attempts++;
        const found = checkKeychain();
        
        if (found || attempts >= maxAttempts) {
          clearInterval(checkInterval);
          
          // If still not found after all attempts and in development mode,
          // enable the development mode fallback
          if (!found && isDevelopmentMode) {
            console.log('Switching to development mode after failed keychain detection');
            setUseDevelopmentMode(true);
          }
        }
      }, 1000); // Check every second
      
      return () => clearInterval(checkInterval);
    }
  }, [isDevelopmentMode]);

  // Mock functions for development environment
  const mockLogin = async (username: string): Promise<LoginResponse> => {
    console.log('Development mode: Mock login called with username:', username);
    
    // Simulate a successful login with the provided username
    return { 
      success: true, 
      username,
      result: { username }
    };
  };

  const mockLogout = () => {
    console.log('Development mode: Mock logout called');
  };

  const mockVoteWitness = async (witness: string, approve: boolean): Promise<VoteWitnessResponse> => {
    console.log('Development mode: Mock vote witness called:', witness, approve);
    return { success: true };
  };

  // Real login implementation using Keychain
  const login = async (username: string): Promise<LoginResponse> => {
    if (useDevelopmentMode) {
      // Use mock login in development
      const response = await mockLogin(username);
      
      if (response.success) {
        setUser({ username });
        setIsLoggedIn(true);
      }
      
      return response;
    }
    
    if (!isKeychainInstalled || !keychain) {
      return { success: false, error: 'Keychain not installed' };
    }

    try {
      // This is a simplified implementation - in a real app you'd verify 
      // the user with a challenge that the blockchain signs
      const response = await new Promise<LoginResponse>((resolve) => {
        keychain.requestSignBuffer(
          username,
          `Login to Aliento Witness Dashboard: ${new Date().toISOString()}`,
          'Posting',
          (keychainResponse) => {
            console.log('Keychain login response:', keychainResponse);
            if (keychainResponse.success) {
              resolve({ 
                success: true, 
                username,
                publicKey: keychainResponse.publicKey,
                result: keychainResponse 
              });
            } else {
              resolve({ 
                success: false, 
                error: keychainResponse.message || 'Unknown error' 
              });
            }
          }
        );
      });

      if (response.success) {
        setUser({ username });
        setIsLoggedIn(true);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: String(error) };
    }
  };

  // Logout function
  const logout = () => {
    if (useDevelopmentMode) {
      mockLogout();
    }
    
    setUser(null);
    setIsLoggedIn(false);
  };

  // Vote witness implementation
  const voteWitness = async (witness: string, approve: boolean): Promise<VoteWitnessResponse> => {
    if (useDevelopmentMode) {
      return mockVoteWitness(witness, approve);
    }
    
    if (!isKeychainInstalled || !keychain || !isLoggedIn || !user) {
      return { success: false, error: 'Not logged in or Keychain not available' };
    }

    try {
      return new Promise<VoteWitnessResponse>((resolve) => {
        keychain.requestWitnessVote(
          user.username,
          witness,
          approve,
          (keychainResponse) => {
            console.log('Keychain vote witness response:', keychainResponse);
            if (keychainResponse.success) {
              resolve({ success: true, result: keychainResponse });
            } else {
              resolve({ 
                success: false, 
                error: keychainResponse.message || 'Unknown error'
              });
            }
          }
        );
      });
    } catch (error) {
      console.error('Vote witness error:', error);
      return { success: false, error: String(error) };
    }
  };
  
  // Create context value
  const contextValue: KeychainContextType = {
    keychain,
    user,
    isLoggedIn,
    // In development mode, we pretend the keychain is installed
    isKeychainInstalled: isKeychainInstalled || useDevelopmentMode,
    login,
    logout,
    voteWitness,
    isDevelopmentMode
  };

  return (
    <KeychainContext.Provider value={contextValue}>
      {children}
    </KeychainContext.Provider>
  );
};

// Custom hook to use the keychain context
export const useKeychain = (): KeychainContextType => {
  const context = useContext(KeychainContext);
  if (!context) {
    throw new Error('useKeychain must be used within a KeychainProvider');
  }
  return context;
};