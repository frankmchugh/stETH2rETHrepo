
import { SUPPORTED_CHAINS, Token } from '@uniswap/sdk-core'

// Addresses

export const V3_SWAP_ROUTER_ADDRESS =
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
export const WETH_CONTRACT_ADDRESS =
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

// Currencies and Tokens

export const USDC_TOKEN = new Token(
    SUPPORTED_CHAINS[0],
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  6,
  'USDC',
  'USD//C'
)

export const RETH_TOKEN = new Token(
  SUPPORTED_CHAINS[0],
  '0xae78736Cd615f374D3085123A210448E74Fc6393',
  18
)

export const DAI_TOKEN = new Token(
    SUPPORTED_CHAINS[0],
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)

export const WETH_TOKEN = new Token(
    SUPPORTED_CHAINS[0],
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  18,
  'WETH',
  'Wrapped Ether'
)


export const WSTETH_TOKEN = new Token(
  SUPPORTED_CHAINS[0],
'0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
18,
'WSTETH',
'Wrapped liquid staked Ether'
)

export const STETH_TOKEN = new Token(
  SUPPORTED_CHAINS[0],
'0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
18,
'STETH',
'stETH'
)




// ABI's

export const ERC20_ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address _spender, uint256 _value) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]

export const WETH_ABI = [
  // Wrap ETH
  'function deposit() payable',

  // Unwrap ETH
  'function withdraw(uint wad) public',
]

// Transactions

export const MAX_FEE_PER_GAS = 100000000000
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 1