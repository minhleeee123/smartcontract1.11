# Medical Records Smart Contract on Celo

A decentralized medical records management system built on the Celo blockchain. This smart contract enables secure storage and management of medical records with role-based access control.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Smart Contract Details](#smart-contract-details)
- [Deployment Information](#deployment-information)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contract Functions](#contract-functions)
- [Security Features](#security-features)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

The Medical Records Smart Contract is a blockchain-based solution for managing medical records with enhanced security and transparency. It implements a role-based access control system with three user types: Admin, Doctor, and Patient.

### Key Benefits

- **Immutable Records**: All medical records are stored permanently on the blockchain
- **Access Control**: Role-based permissions ensure only authorized users can access/modify records
- **Transparency**: All actions are recorded on-chain for audit purposes
- **Decentralization**: No central authority controls the data
- **Security**: Built-in security features prevent unauthorized access

## ✨ Features

### User Management
- **Three User Roles**: Admin, Doctor, Patient
- **User Registration**: Admins can register new users
- **User Activation/Deactivation**: Control user access
- **Profile Management**: Store user information (name, email, specialty for doctors)

### Medical Records Management
- **Create Records**: Doctors can create medical records for patients
- **Update Records**: Doctors can update their own created records
- **View Records**: Users can view records based on their role
- **Query Functions**: 
  - Get records by patient
  - Get records by doctor
  - Get all records (Admin only)
  - Get specific record by ID

### Security Features
- **Role-Based Access Control**: Different permissions for each role
- **Owner Verification**: Only record creators can update records
- **Active User Check**: Inactive users cannot perform actions
- **Timestamp Tracking**: Creation and update times are recorded

## 📜 Smart Contract Details

### Contract Information

- **Contract Name**: `MedicalRecordsContract`
- **Compiler Version**: Solidity 0.8.30
- **License**: MIT
- **Network**: Celo Alfajores Testnet / Celo Mainnet

### Data Structures

#### User Structure
```solidity
struct User {
    address userAddress;      // User's wallet address
    Role role;               // Admin, Doctor, or Patient
    string name;             // User's full name
    uint32 age;              // User's age
    string email;            // Contact email
    string specialty;        // Doctor's specialty (if applicable)
    bool hasSpecialty;       // Whether user has a specialty field
    bool isActive;           // Account activation status
    uint64 createdAt;        // Registration timestamp
    bool exists;             // Whether user exists in system
}
```

#### Medical Record Structure
```solidity
struct MedicalRecord {
    uint32 id;                      // Unique record ID
    address patientAddress;         // Patient's wallet address
    string patientName;             // Patient's name
    address doctorAddress;          // Doctor's wallet address
    string doctorName;              // Doctor's name
    string diagnosis;               // Medical diagnosis
    string treatment;               // Treatment plan
    uint64 createdAt;              // Record creation time
    uint64 updatedAt;              // Last update time
    bool exists;                   // Whether record exists
}
```

### Roles

```solidity
enum Role {
    Admin,    // 0 - System administrator
    Doctor,   // 1 - Medical practitioner
    Patient   // 2 - Patient user
}
```

## 🚀 Deployment Information

### Deployed Contract Address

**Celo Alfajores Testnet**: 
```
[Your deployed contract address will go here]
```

**Celo Mainnet**: 
```
[Your mainnet contract address if deployed]
```

### Deployment Details

- **Deployer Address**: [Your deployer wallet address]
- **Deployment Date**: [Deployment date]
- **Transaction Hash**: [Deployment transaction hash]
- **Block Number**: [Deployment block number]

### Network Configuration

#### Celo Alfajores Testnet
- **Chain ID**: 44787
- **RPC URL**: `https://alfajores-forno.celo-testnet.org`
- **Block Explorer**: https://alfajores.celoscan.io
- **Faucet**: https://faucet.celo.org/alfajores

#### Celo Mainnet
- **Chain ID**: 42220
- **RPC URL**: `https://forno.celo.org`
- **Block Explorer**: https://celoscan.io

## 📦 Prerequisites

Before running this project, ensure you have:

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **A Celo wallet** with some CELO tokens for gas fees
- **Git**: For cloning the repository

## 📥 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd smartcontract1.11/final
```

2. **Install dependencies**
```bash
npm install
```

3. **Install required packages**
```bash
npm install ethers@^6.13.0 dotenv@^16.4.5
```

## ⚙️ Configuration

### 1. Environment Setup

Create a `.env` file in the project root:

```env
# Network Configuration
RPC_URL=https://alfajores-forno.celo-testnet.org

# Wallet Private Key (KEEP THIS SECRET!)
PRIVATE_KEY=your_private_key_here

# Deployed Contract Address
CONTRACT_ADDRESS=your_contract_address_here

# Network Details
CHAIN_ID=44787
NETWORK_NAME=Celo Alfajores Testnet
```

### 2. Security Best Practices

⚠️ **IMPORTANT**: Never commit your `.env` file or private keys to version control!

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

### 3. Get Test Tokens

For Alfajores testnet:
1. Visit https://faucet.celo.org/alfajores
2. Enter your wallet address
3. Receive test CELO tokens

## 🎯 Usage

### Check Connection

Verify your setup and connection to the network:

```bash
npm run check-connection
```

Expected output:
```
🔍 Kiểm tra kết nối...

📡 Network Info:
   Chain ID: 44787
   Network: Celo Alfajores Testnet

💰 Wallet Info:
   Address: 0x...
   Balance: 1.5 CELO

📜 Contract Info:
   Address: 0x...
   Record Count: 0
   ✅ Contract đang hoạt động!
```

### Register Admin (First User)

```bash
npm run register-admin
```

This registers the first admin user in the system.

### Register Doctor

```bash
npm run register-doctor
```

Registers a new doctor (must be executed by an admin).

### Register Patient

```bash
npm run register-patient
```

Registers a new patient (must be executed by an admin).

### Create Medical Record

```bash
npm run create-record
```

Creates a new medical record (must be executed by a doctor).

### Get Records by Patient

```bash
npm run get-records
```

Retrieves all medical records for a specific patient.

### Update Medical Record

```bash
npm run update-record
```

Updates an existing medical record (must be the doctor who created it).

### Get All Records (Admin)

```bash
npm run get-all
```

Retrieves all medical records in the system (admin only).

### Set User Active/Inactive

```bash
npm run set-user-active
```

Activate or deactivate a user account (admin only).

### List All Users

```bash
npm run list-users
```

Lists all registered users in the system.

## 📚 Contract Functions

### Public Functions

#### `register_user`
```solidity
function register_user(
    address _userAddress,
    Role _role,
    string memory _name,
    uint32 _age,
    string memory _email,
    string memory _specialty,
    bool _hasSpecialty
) public
```
Registers a new user in the system.

**Requirements**:
- First user must be Admin
- Only Admin can register new users
- User must not already exist

#### `create_record`
```solidity
function create_record(
    address _patientAddress,
    string memory _diagnosis,
    string memory _treatment
) public returns (uint32)
```
Creates a new medical record.

**Requirements**:
- Caller must be a Doctor
- Doctor must be active
- Patient must exist and be active
- Returns the new record ID

#### `update_record`
```solidity
function update_record(
    uint32 _recordId,
    string memory _diagnosis,
    string memory _treatment
) public
```
Updates an existing medical record.

**Requirements**:
- Caller must be the doctor who created the record
- Record must exist

#### `get_record`
```solidity
function get_record(uint32 _recordId) 
    public view returns (MedicalRecord memory)
```
Retrieves a specific medical record by ID.

**Requirements**:
- Record must exist

#### `get_records_by_patient`
```solidity
function get_records_by_patient(address _patientAddress) 
    public view returns (MedicalRecord[] memory)
```
Gets all records for a specific patient.

#### `get_records_by_doctor`
```solidity
function get_records_by_doctor(address _doctorAddress) 
    public view returns (MedicalRecord[] memory)
```
Gets all records created by a specific doctor.

#### `get_all_records`
```solidity
function get_all_records() 
    public view returns (MedicalRecord[] memory)
```
Gets all medical records in the system.

**Requirements**:
- Caller must be an Admin

#### `get_user`
```solidity
function get_user(address _userAddress) 
    public view returns (
        address, Role, string memory, uint32, 
        string memory, string memory, 
        bool, bool, uint64
    )
```
Retrieves user information.

**Requirements**:
- User must exist

#### `set_user_active`
```solidity
function set_user_active(address _userAddress, bool _isActive) public
```
Sets user activation status.

**Requirements**:
- Caller must be Admin
- User must exist

#### `get_record_count`
```solidity
function get_record_count() public view returns (uint32)
```
Returns the total number of records.

## 🔒 Security Features

### Access Control

1. **Role-Based Permissions**
   - Admin: Can register users, view all records, activate/deactivate users
   - Doctor: Can create and update medical records
   - Patient: Can view their own records

2. **Active User Verification**
   - All actions require the user to be active
   - Admins can deactivate users to revoke access

3. **Record Ownership**
   - Only the doctor who created a record can update it
   - Prevents unauthorized modifications

### Error Handling

The contract includes custom errors for better error reporting:
- `UserNotFound()`: User does not exist in the system
- `Unauthorized()`: User lacks permission for the action
- `RecordNotFound()`: Medical record does not exist
- `InvalidRole()`: Invalid role specified
- `UserInactive()`: User account is inactive
- `AlreadyExists()`: User already registered

### Data Validation

- Non-empty strings for names and medical information
- Valid addresses for users
- Timestamp tracking for audit trails

## 🧪 Testing

### Manual Testing

Test the contract functions using the provided scripts:

```bash
# 1. Check connection
npm run check-connection

# 2. Register admin
npm run register-admin

# 3. Register doctor and patient
npm run register-doctor
npm run register-patient

# 4. Create a medical record
npm run create-record

# 5. View records
npm run get-records

# 6. Update a record
npm run update-record

# 7. View all records (as admin)
npm run get-all
```

### Test Scenarios

1. **User Registration Flow**
   - Register Admin → Register Doctor → Register Patient
   - Verify each user's role and information

2. **Medical Record Creation**
   - Doctor creates record for patient
   - Verify record details and timestamps

3. **Access Control**
   - Try accessing admin functions as doctor (should fail)
   - Try updating record as different doctor (should fail)

4. **User Management**
   - Deactivate user
   - Try to perform actions (should fail)
   - Reactivate user

## 📁 Project Structure

```
final/
├── package.json                 # Project dependencies and scripts
├── README.md                    # This file
├── .env                         # Environment configuration (not in git)
├── .gitignore                   # Git ignore rules
│
├── abi/
│   └── MedicalRecordsContract.json  # Contract ABI
│
├── scripts/
│   ├── 0-demo.js               # Demo script
│   ├── 1-check-connection.js   # Connection checker
│   ├── 2-register-admin.js     # Register admin user
│   ├── 3-register-doctor.js    # Register doctor user
│   ├── 4-register-patient.js   # Register patient user
│   ├── 5-create-record.js      # Create medical record
│   ├── 6-get-records.js        # Get patient records
│   ├── 7-update-record.js      # Update record
│   ├── 8-get-all-records.js    # Get all records (admin)
│   ├── 9-set-user-active.js    # Set user status
│   └── 10-list-users.js        # List all users
│
├── utils/
│   └── helpers.js              # Helper functions and utilities
│
└── smartcontract/
    └── 04a9dea68e43a338f447e1e0d5fc153d-acacc818a27a7a5a021060d52f1f979a57ff9520/
        ├── artifacts.../MedicalRecordsContract.json  # Compiled contract
        └── contracts.../[contract files]              # Source code
```

## 🔧 Helper Functions

The `utils/helpers.js` file provides utility functions:

### `initContract()`
Initializes the connection to the smart contract.

### `getRoleName(roleId)`
Converts role ID to human-readable name.

### `formatTimestamp(timestamp)`
Formats Unix timestamp to readable date.

### `formatAddress(address)`
Shortens Ethereum address for display.

### `displayUser(user)`
Pretty prints user information.

### `displayRecord(record)`
Pretty prints medical record information.

### `handleContractError(error)`
Handles and displays contract errors.

### `waitForTransaction(tx, message)`
Waits for transaction confirmation with progress.

## 📝 NPM Scripts

```json
{
  "demo": "node scripts/0-demo.js",
  "check-connection": "node scripts/1-check-connection.js",
  "register-admin": "node scripts/2-register-admin.js",
  "register-doctor": "node scripts/3-register-doctor.js",
  "register-patient": "node scripts/4-register-patient.js",
  "create-record": "node scripts/5-create-record.js",
  "get-records": "node scripts/6-get-records.js",
  "update-record": "node scripts/7-update-record.js",
  "get-all": "node scripts/8-get-all-records.js",
  "set-user-active": "node scripts/9-set-user-active.js",
  "list-users": "node scripts/10-list-users.js"
}
```

## 🌐 Network Information

### Celo Alfajores Testnet

- **Purpose**: Testing and development
- **Chain ID**: 44787
- **Currency**: CELO (testnet)
- **Block Time**: ~5 seconds
- **Explorer**: https://alfajores.celoscan.io

### Celo Mainnet

- **Purpose**: Production deployment
- **Chain ID**: 42220
- **Currency**: CELO
- **Block Time**: ~5 seconds
- **Explorer**: https://celoscan.io

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use ESLint for code linting
- Follow Solidity best practices
- Add comments for complex logic
- Write tests for new features

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Support

For support and questions:

- Open an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

Potential improvements for future versions:

1. **IPFS Integration**: Store large medical files off-chain
2. **Encryption**: Add end-to-end encryption for sensitive data
3. **Multi-signature**: Require multiple approvals for critical actions
4. **Event Logging**: Enhanced event emissions for better tracking
5. **Role Hierarchy**: More granular role permissions
6. **Batch Operations**: Process multiple records at once
7. **Search Functionality**: Advanced query capabilities
8. **Mobile App**: React Native mobile application
9. **Web Interface**: React web dashboard
10. **Analytics**: On-chain analytics and reporting

## 🎯 Use Cases

This smart contract is suitable for:

1. **Hospitals**: Decentralized patient record management
2. **Clinics**: Secure medical history storage
3. **Telemedicine**: Remote consultation record keeping
4. **Research**: Anonymized medical data for research
5. **Insurance**: Transparent medical claims processing
6. **Health Networks**: Cross-institution record sharing

## ⚠️ Disclaimer

This is a demonstration project for educational purposes. Before using in production:

- Conduct thorough security audits
- Implement proper key management
- Consider privacy regulations (HIPAA, GDPR, etc.)
- Test extensively on testnet
- Consult with legal and security experts

## 🙏 Acknowledgments

- Celo blockchain platform
- OpenZeppelin for smart contract libraries
- Ethers.js for blockchain interaction
- The blockchain development community

---

**Built with ❤️ on Celo blockchain**

For more information about Celo, visit: https://celo.org
