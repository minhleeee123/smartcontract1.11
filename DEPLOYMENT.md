# Deployment Guide

This guide provides step-by-step instructions for deploying the Medical Records Smart Contract to the Celo blockchain.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Deploying to Testnet](#deploying-to-testnet)
4. [Deploying to Mainnet](#deploying-to-mainnet)
5. [Post-Deployment Setup](#post-deployment-setup)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- Node.js v18+ installed
- npm or yarn package manager
- A code editor (VS Code recommended)
- Git for version control

### Required Accounts

- MetaMask or similar Web3 wallet
- Celo wallet with sufficient balance
  - Testnet: Get free tokens from faucet
  - Mainnet: Purchase CELO tokens

### Required Knowledge

- Basic understanding of smart contracts
- Familiarity with command line
- Understanding of blockchain transactions

## Pre-Deployment Checklist

### 1. Environment Setup

✅ Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

✅ Fill in your configuration:
```env
RPC_URL=https://alfajores-forno.celo-testnet.org
PRIVATE_KEY=your_private_key_here
```

### 2. Get Testnet Tokens

For Alfajores Testnet:

1. Visit: https://faucet.celo.org/alfajores
2. Enter your wallet address
3. Request tokens (you'll receive test CELO)
4. Wait for confirmation

Verify balance:
```bash
npm run check-connection
```

### 3. Review Smart Contract

Before deploying, review the contract:

Location: `smartcontract/contracts/MedicalRecordsContract.sol`

Key points to verify:
- ✅ Solidity version (0.8.30)
- ✅ License identifier (MIT)
- ✅ Contract name and functions
- ✅ Access control mechanisms
- ✅ Error handling

### 4. Install Dependencies

```bash
npm install
```

Verify installation:
```bash
npm list ethers dotenv
```

## Deploying to Testnet

### Method 1: Using Remix IDE (Recommended for Beginners)

1. **Prepare Contract**
   - Open https://remix.ethereum.org
   - Create new file: `MedicalRecordsContract.sol`
   - Paste your contract code

2. **Compile Contract**
   - Go to "Solidity Compiler" tab
   - Select compiler version: 0.8.30
   - Click "Compile"
   - Verify no errors

3. **Connect to Celo**
   - Install MetaMask
   - Add Celo Alfajores network:
     ```
     Network Name: Celo Alfajores Testnet
     RPC URL: https://alfajores-forno.celo-testnet.org
     Chain ID: 44787
     Currency: CELO
     Explorer: https://alfajores.celoscan.io
     ```

4. **Deploy**
   - Go to "Deploy & Run" tab
   - Environment: "Injected Provider - MetaMask"
   - Select your contract
   - Click "Deploy"
   - Confirm transaction in MetaMask

5. **Save Details**
   - Copy deployed contract address
   - Copy transaction hash
   - Save both to `.env` file

### Method 2: Using Hardhat (Advanced)

1. **Install Hardhat**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. **Initialize Hardhat**
```bash
npx hardhat init
```

3. **Configure Hardhat**

Create `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.30",
  networks: {
    alfajores: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 44787
    }
  }
};
```

4. **Create Deployment Script**

Create `scripts/deploy.js`:
```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying MedicalRecordsContract...");

  const MedicalRecords = await hre.ethers.getContractFactory("MedicalRecordsContract");
  const contract = await MedicalRecords.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("Contract deployed to:", address);
  console.log("Save this address to your .env file!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

5. **Deploy**
```bash
npx hardhat run scripts/deploy.js --network alfajores
```

### Method 3: Using Foundry

1. **Install Foundry**
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. **Initialize Project**
```bash
forge init
```

3. **Deploy**
```bash
forge create --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  src/MedicalRecordsContract.sol:MedicalRecordsContract
```

## Post-Deployment Setup

### 1. Update Configuration

Update `.env` with deployed contract address:
```env
CONTRACT_ADDRESS=0xYourContractAddressHere
```

### 2. Verify Connection

```bash
npm run check-connection
```

Expected output:
```
📡 Network Info:
   Chain ID: 44787
   Network: Celo Alfajores Testnet

📜 Contract Info:
   Address: 0x...
   Record Count: 0
   ✅ Contract đang hoạt động!
```

### 3. Register First Admin

```bash
npm run register-admin
```

This creates the initial admin user who can register other users.

### 4. Test Basic Functions

```bash
# Register a doctor
npm run register-doctor

# Register a patient
npm run register-patient

# Create a test record
npm run create-record

# View the record
npm run get-records
```

## Deploying to Mainnet

⚠️ **WARNING**: Mainnet deployment involves real money. Triple-check everything!

### Pre-Mainnet Checklist

- [ ] Thoroughly tested on testnet
- [ ] Security audit completed
- [ ] All functions working correctly
- [ ] Error handling tested
- [ ] Gas optimization done
- [ ] Documentation complete
- [ ] Backup of private keys
- [ ] Sufficient CELO for gas

### Mainnet Deployment Steps

1. **Update Configuration**

Update `.env` for mainnet:
```env
RPC_URL=https://forno.celo.org
CHAIN_ID=42220
NETWORK_NAME=Celo Mainnet
CONTRACT_ADDRESS=
```

2. **Fund Wallet**
   - Purchase CELO tokens
   - Transfer to deployment wallet
   - Verify balance

3. **Deploy Contract**

Use same deployment method as testnet, but:
- Double-check network (mainnet)
- Use higher gas price if needed
- Keep transaction hash

4. **Verify on Explorer**

Visit: https://celoscan.io
- Search for your contract address
- Verify deployment
- Check contract code

## Verification

### Contract Verification on CeloScan

1. **Prepare Source Code**
   - Flatten your contract if it has imports
   - Keep original formatting

2. **Verify on CeloScan**
   - Go to https://celoscan.io
   - Navigate to your contract
   - Click "Verify and Publish"
   - Select:
     - Compiler version: 0.8.30
     - License: MIT
   - Paste your contract code
   - Submit

3. **Verification Success**
   - Contract source code visible
   - Functions readable on explorer
   - Users can interact via explorer

### Verify Deployment Checklist

- [ ] Contract deployed successfully
- [ ] Transaction confirmed
- [ ] Contract address saved
- [ ] Contract verified on explorer
- [ ] Basic functions tested
- [ ] Admin registered
- [ ] Documentation updated

## Deployment Information Template

After deployment, update README.md with:

```markdown
## Deployment Information

### Celo Alfajores Testnet
- **Contract Address**: 0x...
- **Deployer**: 0x...
- **Deployment Date**: YYYY-MM-DD
- **Transaction Hash**: 0x...
- **Block Number**: #...
- **Explorer**: https://alfajores.celoscan.io/address/0x...

### Celo Mainnet
- **Contract Address**: 0x...
- **Deployer**: 0x...
- **Deployment Date**: YYYY-MM-DD
- **Transaction Hash**: 0x...
- **Block Number**: #...
- **Explorer**: https://celoscan.io/address/0x...
```

## Troubleshooting

### Common Issues

#### 1. "Insufficient Funds"

**Problem**: Not enough CELO for gas
**Solution**: 
```bash
# Check balance
npm run check-connection

# Get testnet tokens
# Visit: https://faucet.celo.org/alfajores
```

#### 2. "Nonce Too Low"

**Problem**: Transaction nonce mismatch
**Solution**:
```bash
# Reset MetaMask account
# Settings > Advanced > Reset Account
```

#### 3. "Contract Not Deployed"

**Problem**: Contract address incorrect
**Solution**:
```bash
# Verify contract address in .env
# Check on explorer: https://alfajores.celoscan.io
```

#### 4. "Invalid Private Key"

**Problem**: Private key format wrong
**Solution**:
```env
# Private key should be 64 hex characters
# Should NOT include "0x" prefix
PRIVATE_KEY=abc123...def789
```

#### 5. "Network Error"

**Problem**: Cannot connect to RPC
**Solution**:
```bash
# Try alternative RPC URLs
# Alfajores: https://alfajores-forno.celo-testnet.org
# Mainnet: https://forno.celo.org
```

### Gas Optimization Tips

1. **Minimize Storage Operations**
   - Storage is expensive
   - Use memory when possible

2. **Batch Transactions**
   - Group multiple operations
   - Saves on transaction costs

3. **Optimize Strings**
   - Use bytes32 for short strings
   - Store large data off-chain (IPFS)

4. **Remove Unnecessary Code**
   - Delete unused functions
   - Remove redundant checks

### Getting Help

If you encounter issues:

1. **Check Logs**
```bash
# Enable verbose logging
DEBUG=* npm run check-connection
```

2. **Check Explorer**
   - View transaction details
   - Check for revert reasons
   - Verify gas usage

3. **Community Support**
   - Celo Discord: https://discord.gg/celo
   - Celo Forum: https://forum.celo.org
   - Stack Overflow: Tag with `celo`

## Post-Deployment Monitoring

### Monitor Contract Activity

```bash
# Check record count
npm run check-connection

# List all users
npm run list-users

# Get all records (admin only)
npm run get-all
```

### Set Up Alerts

Consider setting up monitoring for:
- New user registrations
- Record creation rate
- Failed transactions
- Unusual activity

### Regular Maintenance

- Monitor gas prices
- Check for new Solidity versions
- Review and update documentation
- Backup important data
- Regular security reviews

## Best Practices

### Security

- [ ] Never commit private keys
- [ ] Use hardware wallet for mainnet
- [ ] Regular security audits
- [ ] Implement emergency pause function
- [ ] Multi-signature for critical functions

### Documentation

- [ ] Keep README updated
- [ ] Document all functions
- [ ] Maintain change log
- [ ] API documentation
- [ ] User guides

### Testing

- [ ] Unit tests for all functions
- [ ] Integration tests
- [ ] Gas optimization tests
- [ ] Security tests
- [ ] User acceptance testing

---

**Deployment Checklist Complete! 🎉**

Your Medical Records Smart Contract is now deployed and ready to use on the Celo blockchain.
