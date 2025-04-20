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
    
    // Find a node with 100% score
    const bestNode = nodes.find(node => node.score === '100%');
    
    // Make sure we have a valid node with URL
    if (bestNode && bestNode.url) {
      // Check if the URL already has https:// prefix
      cachedBestNode = bestNode.url.startsWith('http') ? bestNode.url : `https://${bestNode.url}`;
      console.log("Using Hive node:", cachedBestNode);
      return cachedBestNode;
    }
    
    // If no 100% node is found, use the first available node
    if (nodes.length > 0 && nodes[0].url) {
      cachedBestNode = nodes[0].url.startsWith('http') ? nodes[0].url : `https://${nodes[0].url}`;
      console.log("Using fallback Hive node:", cachedBestNode);
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
      url: node.endpoint || node.url, // Use endpoint property if available (contains full URL)
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

// Conversion rate from VESTS to HIVE (HP)
let vestToHpRatio: number | null = null;

// Get network statistics (block height, tx per day, etc.)
export const getNetworkStats = async (): Promise<NetworkStats> => {
  try {
    const apiNode = await getBestHiveNode();
    
    console.log('Making API call to:', apiNode);
    
    // Dynamic properties request
    let resultResponse;
    try {
      resultResponse = await fetch(apiNode, {
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
      
      // Check response status
      if (!resultResponse.ok) {
        throw new Error(`HTTP error status: ${resultResponse.status}`);
      }
    } catch (fetchError) {
      console.error('Fetch error getting dynamic properties:', fetchError);
      // If the best node fails, try the default node
      if (apiNode !== DEFAULT_API_NODE) {
        console.log('Trying default API node as fallback');
        resultResponse = await fetch(DEFAULT_API_NODE, {
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
        
        if (!resultResponse.ok) {
          throw new Error(`Fallback HTTP error status: ${resultResponse.status}`);
        }
      } else {
        throw fetchError;
      }
    }
    
    const data = await resultResponse.json();
    const props = data.result;
    
    // Calculate the VESTS to HP ratio as per https://developers.hive.io/tutorials-recipes/vest-to-hive.html
    const totalHive = parseFloat(props.total_vesting_fund_hive.split(' ')[0]);
    const totalVests = parseFloat(props.total_vesting_shares.split(' ')[0]);
    vestToHpRatio = totalHive / totalVests;
    console.log('VESTS to HP ratio:', vestToHpRatio);
    
    // Price feed request
    let priceResult;
    try {
      priceResult = await fetch(apiNode, {
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
      
      if (!priceResult.ok) {
        throw new Error(`Price feed HTTP error status: ${priceResult.status}`);
      }
    } catch (priceError) {
      console.error('Error fetching price feed:', priceError);
      // Try default node as a fallback if we're not already using it
      if (apiNode !== DEFAULT_API_NODE) {
        console.log('Using fallback node for price feed');
        priceResult = await fetch(DEFAULT_API_NODE, {
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
      } else {
        throw priceError;
      }
    }
    
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
    // Log more detailed error information
    console.log('API Node used:', await getBestHiveNode());
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
    console.log('Fetching witnesses from:', apiNode);
    
    // Request witness data
    let result;
    try {
      result = await fetch(apiNode, {
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
      
      if (!result.ok) {
        throw new Error(`Witness list HTTP error status: ${result.status}`);
      }
    } catch (fetchError) {
      console.error('Error fetching witness list:', fetchError);
      // Try default node as a fallback if we're not already using it
      if (apiNode !== DEFAULT_API_NODE) {
        console.log('Using fallback node for witness list');
        result = await fetch(DEFAULT_API_NODE, {
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
      } else {
        throw fetchError;
      }
    }
    
    const data = await result.json();
    const witnesses = data.result;
    
    // Format the witness data
    return witnesses.map((witness: any, index: number) => {
      // If we don't have the ratio yet, make a call to get it
      if (vestToHpRatio === null) {
        // Use approximate conversion
        vestToHpRatio = 0.00049;
      }
      
      // Convert VESTS to actual Hive Power using the conversion rate
      const vestAmount = parseFloat(witness.votes);
      const hiveAmount = vestAmount * vestToHpRatio;
      
      // Format Hive Power with appropriate suffix (M for millions, B for billions)
      let formattedHp;
      if (hiveAmount >= 1000000000) {
        formattedHp = `${(hiveAmount / 1000000000).toFixed(1)}B HP`;
      } else if (hiveAmount >= 1000000) {
        formattedHp = `${(hiveAmount / 1000000).toFixed(1)}M HP`;
      } else if (hiveAmount >= 1000) {
        formattedHp = `${(hiveAmount / 1000).toFixed(1)}K HP`;
      } else {
        formattedHp = `${hiveAmount.toFixed(1)} HP`;
      }
      
      return {
        id: witness.id,
        name: witness.owner,
        rank: index + 1,
        url: witness.url,
        votes: witness.votes,
        votesHivePower: formattedHp,
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
    console.log(`Fetching witness ${name} from:`, apiNode);
    
    // Request witness data
    let result;
    try {
      result = await fetch(apiNode, {
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
      
      if (!result.ok) {
        throw new Error(`Witness fetch HTTP error status: ${result.status}`);
      }
    } catch (fetchError) {
      console.error(`Error fetching witness ${name}:`, fetchError);
      // Try default node as a fallback if we're not already using it
      if (apiNode !== DEFAULT_API_NODE) {
        console.log('Using fallback node for specific witness');
        result = await fetch(DEFAULT_API_NODE, {
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
      } else {
        throw fetchError;
      }
    }
    
    const data = await result.json();
    const witness = data.result;
    
    if (!witness) {
      return null;
    }
    
    // If we don't have the ratio yet, make a call to get it
    if (vestToHpRatio === null) {
      // Use approximate conversion
      vestToHpRatio = 0.00049;
    }
    
    // Convert VESTS to actual Hive Power using the conversion rate
    const vestAmount = parseFloat(witness.votes);
    const hiveAmount = vestAmount * vestToHpRatio;
    
    // Format Hive Power with appropriate suffix (M for millions, B for billions)
    let formattedHp;
    if (hiveAmount >= 1000000000) {
      formattedHp = `${(hiveAmount / 1000000000).toFixed(1)}B HP`;
    } else if (hiveAmount >= 1000000) {
      formattedHp = `${(hiveAmount / 1000000).toFixed(1)}M HP`;
    } else if (hiveAmount >= 1000) {
      formattedHp = `${(hiveAmount / 1000).toFixed(1)}K HP`;
    } else {
      formattedHp = `${hiveAmount.toFixed(1)} HP`;
    }
    
    // Fetch all witnesses to determine rank
    const allWitnesses = await getWitnesses();
    const rank = allWitnesses.findIndex(w => w.name === name) + 1;
    
    return {
      id: witness.id,
      name: witness.owner,
      rank: rank,
      url: witness.url,
      votes: witness.votes,
      votesHivePower: formattedHp,
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
