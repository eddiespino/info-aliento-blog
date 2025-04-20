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
}

export interface UserData {
  username: string;
  profileImage?: string;
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
