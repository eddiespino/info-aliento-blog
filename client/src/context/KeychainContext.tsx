import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { UserData, LoginResponse, VoteWitnessResponse } from '@/types/hive';

// Create a context for Keychain functionality
interface KeychainContextType {
  keychain: any;
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
  const [keychain, setKeychain] = useState<any>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isKeychainInstalled, setIsKeychainInstalled] = useState(false);
  
  // For development environment
  const isDevelopmentMode = process.env.NODE_ENV === 'development';
  const [useDevelopmentMode, setUseDevelopmentMode] = useState(isDevelopmentMode);

  // Check if Keychain is installed
  useEffect(() => {
    const checkKeychain = () => {
      // Check if window.hive_keychain exists
      if (typeof window !== 'undefined' && 'hive_keychain' in window) {
        setKeychain((window as any).hive_keychain);
        setIsKeychainInstalled(true);
      } else {
        console.log('Hive Keychain extension not detected');
        
        // If in development mode, we'll still provide mock functionality
        if (isDevelopmentMode) {
          setUseDevelopmentMode(true);
        }
      }
    };

    checkKeychain();
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
          (response: any) => {
            if (response.success) {
              resolve({ 
                success: true, 
                username,
                publicKey: response.publicKey,
                result: response 
              });
            } else {
              resolve({ 
                success: false, 
                error: response.message 
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
          (response: any) => {
            if (response.success) {
              resolve({ success: true, result: response });
            } else {
              resolve({ success: false, error: response.message });
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