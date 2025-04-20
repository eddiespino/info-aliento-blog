import React, { createContext, useContext, ReactNode } from 'react';
import { UserData, LoginResponse, VoteWitnessResponse } from '@/types/hive';

// Create a simplified context for development without Keychain SDK dependencies
interface KeychainContextType {
  keychain: any;
  user: UserData | null;
  isLoggedIn: boolean;
  isKeychainInstalled: boolean;
  login: (username: string) => Promise<LoginResponse>;
  logout: () => void;
  voteWitness: (witness: string, approve: boolean) => Promise<VoteWitnessResponse>;
}

// Create default mock functions that do nothing but return valid responses
const mockLogin = async (username: string): Promise<LoginResponse> => {
  console.log('Mock login called with username:', username);
  return { success: true, username };
};

const mockLogout = () => {
  console.log('Mock logout called');
};

const mockVoteWitness = async (witness: string, approve: boolean): Promise<VoteWitnessResponse> => {
  console.log('Mock vote witness called:', witness, approve);
  return { success: true };
};

// Create a default context with mock implementations
const defaultContextValue: KeychainContextType = {
  keychain: null,
  user: null,
  isLoggedIn: false,
  isKeychainInstalled: false,
  login: mockLogin,
  logout: mockLogout,
  voteWitness: mockVoteWitness
};

const KeychainContext = createContext<KeychainContextType>(defaultContextValue);

export const KeychainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the default context value for now
  return (
    <KeychainContext.Provider value={defaultContextValue}>
      {children}
    </KeychainContext.Provider>
  );
};

export const useKeychain = (): KeychainContextType => {
  const context = useContext(KeychainContext);
  if (!context) {
    throw new Error('useKeychain must be used within a KeychainProvider');
  }
  return context;
};
