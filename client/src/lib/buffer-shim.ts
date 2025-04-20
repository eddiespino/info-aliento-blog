// This is a minimal Buffer shim for browser use
// It creates a global Buffer with basic functionalities

// Define the Buffer shim
const BufferShim = {
  from: (data: string | any[], encoding?: string): Uint8Array => {
    if (typeof data === 'string') {
      const encoder = new TextEncoder();
      return encoder.encode(data);
    }
    return new Uint8Array(data);
  }
};

// Create a buffer object at the global level
declare global {
  interface Window {
    Buffer: any;
  }
}

// Expose the Buffer shim globally
if (typeof window !== 'undefined') {
  // Create a buffer namespace
  window.Buffer = window.Buffer || {};
  // Add the from method
  window.Buffer.from = BufferShim.from;
}

// Also create it in the global scope for Node.js modules
const buffer = {
  Buffer: BufferShim
};

// Add it to the global scope
(globalThis as any).buffer = buffer;

export default BufferShim;