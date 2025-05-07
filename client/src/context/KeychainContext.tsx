import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { UserData, LoginResponse, VoteWitnessResponse } from '@/types/hive';
import { getUserData, getUserAccount } from '@/api/hive';
// Import Buffer shim to ensure Buffer is available
import '@/lib/buffer-shim';
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

  // Load saved user data from localStorage if it exists
  // This is done on initial load and helps prevent unnecessary authentication
  useEffect(() => {
    const savedUser = localStorage.getItem('hive_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('Found saved user data in localStorage:', userData.username);
        setUser(userData);
        setIsLoggedIn(true);
        
        // Silently refresh user data in the background without requiring re-authentication
        // This ensures we have the latest data without disrupting the user experience
        if (userData.username) {
          getUserData(userData.username)
            .then(freshUserData => {
              // Only update if there are meaningful differences
              if (JSON.stringify(userData) !== JSON.stringify(freshUserData)) {
                console.log('Updating user data with fresh data from API');
                setUser(freshUserData);
                localStorage.setItem('hive_user', JSON.stringify(freshUserData));
              }
            })
            .catch(error => {
              console.error('Background refresh of user data failed:', error);
              // Keep using cached data on error
            });
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('hive_user');
      }
    }
  }, []);

  // Check if Keychain is installed
  useEffect(() => {
    const checkKeychain = () => {
      // Check if window.hive_keychain exists and is a valid object
      if (
        typeof window !== 'undefined' && 
        'hive_keychain' in window && 
        window.hive_keychain && 
        typeof window.hive_keychain === 'object' &&
        typeof window.hive_keychain.requestWitnessVote === 'function'
      ) {
        console.log('Hive Keychain extension detected and validated');
        setKeychain(window.hive_keychain);
        setIsKeychainInstalled(true);
        return true;
      } else {
        console.log('Hive Keychain extension not properly detected');
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
    
    // In development mode, we still verify the account exists on the blockchain,
    // but we already did this check in the login function before calling mockLogin.
    // Just providing a successful mock response since we know the account exists.
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

  // Real login implementation with strict username verification
  const login = async (username: string): Promise<LoginResponse> => {
    // Remove any @ symbols and trim whitespace
    const cleanedUsername = username.replace('@', '').trim().toLowerCase();
    
    // First check if the account exists on the Hive blockchain
    console.log('Checking if account exists on Hive blockchain:', cleanedUsername);
    const hiveAccount = await getUserAccount(cleanedUsername);
    
    if (!hiveAccount) {
      console.error('Account does not exist on Hive blockchain:', cleanedUsername);
      return {
        success: false,
        error: 'The account does not exist on the Hive blockchain'
      };
    }
    
    console.log('Account verified on Hive blockchain:', cleanedUsername);
    
    if (useDevelopmentMode) {
      // Use mock login in development
      const response = await mockLogin(cleanedUsername);
      
      if (response.success) {
        try {
          console.log('Development mode: Fetching user data for:', cleanedUsername);
          const userData = await getUserData(cleanedUsername);
          setUser(userData);
          
          // Save user data to localStorage for persistence in development mode
          localStorage.setItem('hive_user', JSON.stringify(userData));
        } catch (dataError) {
          console.error('Development mode: Error fetching user data:', dataError);
          const userData = { username: cleanedUsername };
          setUser(userData);
          
          // Save minimal user data to localStorage
          localStorage.setItem('hive_user', JSON.stringify(userData));
        }
        setIsLoggedIn(true);
      }
      
      return response;
    }
    
    if (!isKeychainInstalled || !keychain) {
      return { success: false, error: 'Keychain not installed' };
    }

    try {
      // Now check if the account exists in keychain
      console.log('Verifying account exists in keychain:', cleanedUsername);
      
      // Create a unique message to sign to verify the key exists
      const signMessage = `Login to Aliento Witness Dashboard: ${new Date().toISOString()}`;

      // Check if the login will succeed by attempting a signature first
      const verifyKeychainHasAccount = new Promise<boolean>((resolve) => {
        // The keychain will only attempt to sign if it has the account
        keychain.requestSignBuffer(
          cleanedUsername,
          signMessage,
          'Posting',
          (verifyResponse) => {
            if (verifyResponse.success) {
              console.log('Account verified in keychain:', cleanedUsername);
              resolve(true);
            } else {
              // If there's an error that's not related to the account not existing,
              // log it specifically
              if (verifyResponse.message && verifyResponse.message.includes("account doesn't exist")) {
                console.log('Account does not exist in keychain:', cleanedUsername);
              } else if (verifyResponse.message && verifyResponse.message.includes("User canceled")) {
                console.log('User canceled the verification:', cleanedUsername);
              } else {
                console.log('Verification failed with message:', verifyResponse.message);
              }
              resolve(false);
            }
          }
        );
      });

      // Wait for account verification
      const accountExists = await verifyKeychainHasAccount;
      
      if (!accountExists) {
        console.error('Account not found in keychain or user canceled');
        return { 
          success: false, 
          error: 'Account not found in your Hive Keychain or request was canceled' 
        };
      }

      // If verification passed, proceed with actual login
      console.log('Proceeding with login for verified account:', cleanedUsername);
      
      const loginMessage = `Login to Aliento Witness Dashboard: ${new Date().toISOString()}`;
      
      const response = await new Promise<LoginResponse>((resolve) => {
        keychain.requestSignBuffer(
          cleanedUsername,
          loginMessage,
          'Posting',
          (keychainResponse) => {
            console.log('Keychain login response:', keychainResponse);
            if (keychainResponse.success) {
              resolve({ 
                success: true, 
                username: cleanedUsername,
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
        try {
          console.log('Fetching complete user data for:', cleanedUsername);
          const userData = await getUserData(cleanedUsername);
          setUser(userData);
          setIsLoggedIn(true);
          
          // Save user data to localStorage for persistence across page reloads
          localStorage.setItem('hive_user', JSON.stringify(userData));
        } catch (dataError) {
          console.error('Error fetching user data:', dataError);
          // Set minimal user data if fetching complete data fails
          setUser({ username: cleanedUsername });
          setIsLoggedIn(true);
        }
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
    
    // Clear user data from state
    setUser(null);
    setIsLoggedIn(false);
    
    // Remove saved user data from localStorage
    localStorage.removeItem('hive_user');
    console.log('User logged out, data cleared from localStorage');
  };

  // Vote witness implementation using direct Keychain API
  const voteWitness = async (witness: string, approve: boolean): Promise<VoteWitnessResponse> => {
    console.log('Vote witness called with parameters:', { witness, approve });
    console.log('Current state:', { 
      useDevelopmentMode, 
      isKeychainInstalled, 
      keychain: !!keychain, 
      isLoggedIn, 
      user: !!user 
    });
    
    // Check if real Keychain can be used
    if (!isKeychainInstalled || !keychain || !isLoggedIn || !user) {
      if (useDevelopmentMode) {
        console.log('Using development mode for voting');
        const response = await mockVoteWitness(witness, approve);
        
        // In development mode, update user data after voting
        if (response.success && user) {
          try {
            console.log('Development mode: Updating user data after witness vote');
            const userData = await getUserData(user.username);
            setUser(userData);
            
            // Update localStorage with the latest user data
            localStorage.setItem('hive_user', JSON.stringify(userData));
          } catch (dataError) {
            console.error('Development mode: Error updating user data after vote:', dataError);
          }
        }
        
        return response;
      } else {
        return { success: false, error: 'Not logged in or Keychain not available' };
      }
    }
    
    // At this point, we know we can use the real Keychain
    console.log('Using real Keychain for voting');
    
    try {
      console.log('Voting for witness:', witness, approve);
      
      const response = await new Promise<VoteWitnessResponse>((resolve) => {
        keychain!.requestWitnessVote(
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
      
      // Update user data after successful vote to refresh witness votes and free votes count
      if (response.success) {
        try {
          console.log('Updating user data after witness vote');
          const userData = await getUserData(user.username);
          setUser(userData);
          
          // Update localStorage with the latest user data after voting
          localStorage.setItem('hive_user', JSON.stringify(userData));
        } catch (dataError) {
          console.error('Error updating user data after vote:', dataError);
        }
      }
      
      return response;
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