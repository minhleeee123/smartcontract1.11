import { ethers } from 'ethers';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Hàm khởi tạo provider và contract
export function initContract() {
  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!privateKey || privateKey === 'YOUR_PRIVATE_KEY_HERE') {
    throw new Error('⚠️  Vui lòng cập nhật PRIVATE_KEY trong file .env');
  }

  // Kết nối provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  // Tạo wallet
  const wallet = new ethers.Wallet(privateKey, provider);

  // Load ABI
  const abiPath = path.join(__dirname, '..', 'abi', 'MedicalRecordsContract.json');
  const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

  // Kết nối contract
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  return { provider, wallet, contract, abi };
}

// Enum Role
export const Role = {
  Admin: 0,
  Doctor: 1,
  Patient: 2
};

export function getRoleName(roleId) {
  const roleNames = ['Admin', 'Doctor', 'Patient'];
  return roleNames[roleId] || 'Unknown';
}

// Format timestamp
export function formatTimestamp(timestamp) {
  return new Date(Number(timestamp) * 1000).toLocaleString('vi-VN');
}

// Format địa chỉ
export function formatAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Hiển thị thông tin user
export function displayUser(user) {
  console.log('\n📋 Thông tin User:');
  console.log('  Address:', user.userAddress);
  console.log('  Vai trò:', getRoleName(user.role));
  console.log('  Tên:', user.name);
  console.log('  Tuổi:', user.age.toString());
  console.log('  Email:', user.email);
  if (user.hasSpecialty) {
    console.log('  Chuyên khoa:', user.specialty);
  }
  console.log('  Trạng thái:', user.isActive ? '✅ Active' : '❌ Inactive');
  console.log('  Ngày tạo:', formatTimestamp(user.createdAt));
}

// Hiển thị thông tin record
export function displayRecord(record) {
  console.log('\n📄 Hồ sơ y tế #' + record.id);
  console.log('  Bệnh nhân:', record.patientName, `(${formatAddress(record.patientAddress)})`);
  console.log('  Bác sĩ:', record.doctorName, `(${formatAddress(record.doctorAddress)})`);
  console.log('  Chẩn đoán:', record.diagnosis);
  console.log('  Điều trị:', record.treatment);
  console.log('  Ngày tạo:', formatTimestamp(record.createdAt));
  console.log('  Cập nhật lần cuối:', formatTimestamp(record.updatedAt));
}

// Xử lý lỗi contract
export function handleContractError(error) {
  console.error('\n❌ Lỗi:', error.message);
  
  if (error.message.includes('UserNotFound')) {
    console.log('💡 User không tồn tại trong hệ thống');
  } else if (error.message.includes('Unauthorized')) {
    console.log('💡 Bạn không có quyền thực hiện thao tác này');
  } else if (error.message.includes('RecordNotFound')) {
    console.log('💡 Không tìm thấy hồ sơ y tế');
  } else if (error.message.includes('InvalidRole')) {
    console.log('💡 Vai trò không hợp lệ');
  } else if (error.message.includes('UserInactive')) {
    console.log('💡 User đã bị vô hiệu hóa');
  } else if (error.message.includes('AlreadyExists')) {
    console.log('💡 User đã tồn tại trong hệ thống');
  }
}

// Chờ transaction
export async function waitForTransaction(tx, message = 'Đang xử lý transaction...') {
  console.log('📤', message);
  console.log('   Transaction hash:', tx.hash);
  
  const receipt = await tx.wait();
  
  console.log('✅ Transaction thành công!');
  console.log('   Block:', receipt.blockNumber);
  console.log('   Gas used:', receipt.gasUsed.toString());
  
  return receipt;
}
