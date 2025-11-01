import { ethers } from 'ethers';
import { initContract, formatAddress } from '../utils/helpers.js';

async function checkConnection() {
  try {
    console.log('🔍 Kiểm tra kết nối...\n');

    const { provider, wallet, contract } = initContract();

    // 1. Kiểm tra kết nối network
    console.log('📡 Network Info:');
    const network = await provider.getNetwork();
    console.log('   Chain ID:', network.chainId.toString());
    console.log('   Network:', network.name || 'Celo Sepolia Testnet');

    // 2. Kiểm tra ví
    console.log('\n💰 Wallet Info:');
    console.log('   Address:', wallet.address);
    const balance = await provider.getBalance(wallet.address);
    console.log('   Balance:', ethers.formatEther(balance), 'CELO');

    // 3. Kiểm tra contract
    console.log('\n📜 Contract Info:');
    console.log('   Address:', await contract.getAddress());
    
    try {
      const recordCount = await contract.get_record_count();
      console.log('   Record Count:', recordCount.toString());
      console.log('   ✅ Contract đang hoạt động!');
    } catch (error) {
      console.log('   ⚠️  Không thể đọc dữ liệu từ contract');
    }

    // 4. Kiểm tra user hiện tại
    console.log('\n👤 Kiểm tra User hiện tại:');
    try {
      const user = await contract.get_user(wallet.address);
      console.log('   ✅ User đã được đăng ký!');
      console.log('   Vai trò:', ['Admin', 'Doctor', 'Patient'][user.role]);
      console.log('   Tên:', user.name);
      console.log('   Trạng thái:', user.isActive ? 'Active' : 'Inactive');
    } catch (error) {
      console.log('   ℹ️  User chưa được đăng ký trong hệ thống');
      console.log('   💡 Hãy chạy script register-admin để đăng ký Admin đầu tiên');
    }

    console.log('\n✅ Kiểm tra hoàn tất!\n');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

checkConnection();
