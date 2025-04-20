import { HiveNode, NetworkStats, Witness } from '@/types/hive';

// Default API node to use if we can't fetch the best nodes
const DEFAULT_API_NODE = 'https://api.hive.blog';

// Cache the best node to reduce API calls
let cachedBestNode: string | null = null;
let cachedNodeList: HiveNode[] = [];

// Function to get the best available Hive node
export const getBestHiveNode = async (): Promise<string> => {
  if (cachedBestNode) {
    return cachedBestNode;
  }

  try {
    const nodes = await getHiveNodes();
    
    // Find first node with 100% score
    const bestNode = nodes.find(node => node.score === '100%');
    
    if (bestNode) {
      cachedBestNode = `https://${bestNode.url}`;
      return cachedBestNode;
    }
    
    return DEFAULT_API_NODE;
  } catch (error) {
    console.error('Error getting best Hive node:', error);
    return DEFAULT_API_NODE;
  }
};

// Function to get available Hive API nodes
export const getHiveNodes = async (): Promise<HiveNode[]> => {
  if (cachedNodeList.length > 0) {
    return cachedNodeList;
  }

  try {
    // Use beacon API to fetch node information
    const response = await fetch('https://beacon.peakd.com/api/nodes');
    const data = await response.json();
    
    // Format node data
    const nodes = data.map((node: any) => ({
      url: node.url,
      version: node.version || '-',
      lastUpdate: node.lastUpdate || 'unknown',
      score: `${node.score}%`,
      tests: `${node.passedTests} / ${node.totalTests}`
    }));
    
    cachedNodeList = nodes;
    return nodes;
  } catch (error) {
    console.error('Error fetching Hive nodes:', error);
    return [];
  }
};

// Get network statistics (block height, tx per day, etc.)
export const getNetworkStats = async (): Promise<NetworkStats> => {
  try {
    const apiNode = await getBestHiveNode();
    
    // Dynamic properties request
    const result = await fetch(`${apiNode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "condenser_api.get_dynamic_global_properties",
        "params": [],
        "id": 1
      })
    });
    
    const data = await result.json();
    const props = data.result;
    
    // Price feed request
    const priceResult = await fetch(`${apiNode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "condenser_api.get_current_median_history_price",
        "params": [],
        "id": 1
      })
    });
    
    const priceData = await priceResult.json();
    const price = priceData.result;
    
    // Format the price as USD
    const hivePrice = parseFloat(price.base.split(' ')[0]) / parseFloat(price.quote.split(' ')[0]);
    
    return {
      blockHeight: props.head_block_number.toLocaleString(),
      txPerDay: Math.round(props.current_aslot / 1440 * 20).toLocaleString(), // Rough estimate
      activeWitnesses: "21", // Top witnesses count is always 21
      hivePrice: `$${hivePrice.toFixed(3)}`
    };
  } catch (error) {
    console.error('Error fetching network stats:', error);
    return {
      blockHeight: "Unknown",
      txPerDay: "Unknown",
      activeWitnesses: "21",
      hivePrice: "Unknown"
    };
  }
};

// Get witness information
export const getWitnesses = async (): Promise<Witness[]> => {
  try {
    const apiNode = await getBestHiveNode();
    
    // Request witness data
    const result = await fetch(`${apiNode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "condenser_api.get_witnesses_by_vote",
        "params": ["", 100],
        "id": 1
      })
    });
    
    const data = await result.json();
    const witnesses = data.result;
    
    // Format the witness data
    return witnesses.map((witness: any, index: number) => {
      // Convert vests to Hive Power
      const vestToHp = parseFloat(witness.votes) / 1000000000000;
      
      return {
        id: witness.id,
        name: witness.owner,
        rank: index + 1,
        url: witness.url,
        votes: witness.votes,
        votesHivePower: `${(vestToHp / 1000000).toFixed(1)}M HP`,
        lastBlock: `#${witness.last_confirmed_block_num}`,
        missedBlocks: witness.total_missed,
        priceFeed: `$${parseFloat(witness.hbd_exchange_rate.base).toFixed(3)}`,
        version: witness.running_version,
        created: witness.created,
        profileImage: `https://images.hive.blog/u/${witness.owner}/avatar`
      };
    });
  } catch (error) {
    console.error('Error fetching witnesses:', error);
    return [];
  }
};

// Get information for a specific witness
export const getWitnessByName = async (name: string): Promise<Witness | null> => {
  try {
    const apiNode = await getBestHiveNode();
    
    // Request witness data
    const result = await fetch(`${apiNode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "condenser_api.get_witness_by_account",
        "params": [name],
        "id": 1
      })
    });
    
    const data = await result.json();
    const witness = data.result;
    
    if (!witness) {
      return null;
    }
    
    // Convert vests to Hive Power
    const vestToHp = parseFloat(witness.votes) / 1000000000000;
    
    // Fetch all witnesses to determine rank
    const allWitnesses = await getWitnesses();
    const rank = allWitnesses.findIndex(w => w.name === name) + 1;
    
    return {
      id: witness.id,
      name: witness.owner,
      rank: rank,
      url: witness.url,
      votes: witness.votes,
      votesHivePower: `${(vestToHp / 1000000).toFixed(1)}M HP`,
      lastBlock: `#${witness.last_confirmed_block_num}`,
      missedBlocks: witness.total_missed,
      priceFeed: `$${parseFloat(witness.hbd_exchange_rate.base).toFixed(3)}`,
      version: witness.running_version,
      created: witness.created,
      profileImage: `https://images.hive.blog/u/${witness.owner}/avatar`
    };
  } catch (error) {
    console.error(`Error fetching witness ${name}:`, error);
    return null;
  }
};
