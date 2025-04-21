// Type definitions for Hive Keychain browser extension
// These types help TypeScript understand the Hive Keychain API

declare global {
  interface Window {
    hive_keychain: HiveKeychain;
  }
}

interface HiveKeychain {
  requestSignBuffer: (
    username: string,
    message: string,
    key: "Posting" | "Active" | "Memo",
    callback: (response: KeychainResponse) => void,
    // Optional field for request ID
    rpc?: string
  ) => void;

  requestBroadcast: (
    username: string,
    operations: any[],
    key: "Posting" | "Active",
    callback: (response: KeychainResponse) => void,
    // Optional field for request ID
    rpc?: string
  ) => void;

  requestSignTx: (
    username: string,
    tx: any,
    key: "Posting" | "Active",
    callback: (response: KeychainResponse) => void,
    // Optional field for request ID
    rpc?: string
  ) => void;

  requestWitnessVote: (
    username: string,
    witness: string,
    vote: boolean,
    callback: (response: KeychainResponse) => void
  ) => void;

  requestCustomJson: (
    username: string,
    jsonId: string,
    keyType: "Posting" | "Active",
    jsonData: string | object,
    displayName: string,
    callback: (response: KeychainResponse) => void
  ) => void;

  requestAddAccountAuthority: (
    username: string,
    authorizedUsername: string,
    role: "Posting" | "Active",
    weight: number,
    callback: (response: KeychainResponse) => void
  ) => void;

  requestRemoveAccountAuthority: (
    username: string,
    authorizedUsername: string,
    role: "Posting" | "Active",
    callback: (response: KeychainResponse) => void
  ) => void;

  requestTransfer: (
    username: string,
    to: string,
    amount: string,
    memo: string,
    currency: string,
    callback: (response: KeychainResponse) => void,
    enforce?: boolean
  ) => void;

  checkKeychain: () => boolean;
}

interface KeychainResponse {
  success: boolean;
  error?: string;
  message?: string;
  result?: any;
  publicKey?: string;
  data?: any;
  request_id?: string;
}

export {};