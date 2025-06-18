export interface HiveNode {
  url: string;
  version: string;
  lastUpdate: string;
  score: string;
  tests: string;
}

export interface NetworkStats {
  blockHeight: string;
  txPerDay: string;
  activeWitnesses: string;
  hivePrice: string;
}

export interface Witness {
  id: string;
  name: string;
  rank: number;
  url: string;
  votes: string;
  votesHivePower: string;
  lastBlock: string;
  missedBlocks: number;
  priceFeed: string;
  version: string;
  created: string;
  profileImage: string;
  isActive: boolean; // Flag to indicate if the witness is active (has signed a block in the last 72 hours)
  witnessDescription?: string; // The witness description from posting_metadata
  hbdInterestRate?: string; // HBD interest rate (APR)
}

export interface UserData {
  username: string;
  profileImage?: string;
  hivePower?: string;
  effectiveHivePower?: string;
  proxiedHivePower?: string;
  freeWitnessVotes?: number;
  witnessVotes?: string[];
  proxy?: string; // The account this user is proxying their votes to
}

export interface ProxyAccount {
  username: string;
  hivePower: string;
  profileImage: string;
  children?: ProxyAccount[];
}

export interface WitnessVoter {
  username: string;
  profileImage: string;
  hivePower: string;
  proxiedHivePower?: string;
  totalHivePower?: string;
  proxyAccounts?: ProxyAccount[];
}

export type VoteWitnessResponse = {
  success: boolean;
  error?: string;
  result?: any;
};

export type LoginResponse = {
  success: boolean;
  username?: string;
  error?: string;
  publicKey?: string;
  result?: any;
};
