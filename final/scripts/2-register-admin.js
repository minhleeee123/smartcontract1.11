import { initContract, Role, waitForTransaction, handleContractError, displayUser } from '../utils/helpers.js';

async function registerAdmin() {
  try {
    console.log('👑 Đăng ký Admin đầu tiên...\n');

    const { wallet, contract } = initContract();

    // Kiểm tra xem đã có admin chưa
    try {
      const existingUser = await contract.get_user(wallet.address);
      console.log('⚠️  User đã tồn tại!');
      displayUser(existingUser);
      return;
    } catch (error) {
      // User chưa tồn tại, tiếp tục đăng ký
    }

    // Thông tin admin
    const adminData = {
      userAddress: wallet.address,
      role: Role.Admin,
      name: 'Admin Chính',
      age: 35,
      email: 'admin@hospital.com',
      specialty: '', // Admin không cần specialty
      hasSpecialty: false
    };

    console.log('📝 Thông tin đăng ký:');
    console.log('   Address:', adminData.userAddress);
    console.log('   Vai trò: Admin');
    console.log('   Tên:', adminData.name);
    console.log('   Tuổi:', adminData.age);
    console.log('   Email:', adminData.email);

    // Gửi transaction
    console.log('\n📤 Đang gửi transaction...');
    const tx = await contract.register_user(
      adminData.userAddress,
      adminData.role,
      adminData.name,
      adminData.age,
      adminData.email,
      adminData.specialty,
      adminData.hasSpecialty
    );

    await waitForTransaction(tx, 'Đang đăng ký Admin...');

    // Kiểm tra kết quả
    console.log('\n🔍 Kiểm tra thông tin đã đăng ký:');
    const user = await contract.get_user(wallet.address);
    displayUser(user);

    console.log('\n✅ Đăng ký Admin thành công!\n');
    console.log('💡 Bây giờ bạn có thể đăng ký Doctor và Patient');

  } catch (error) {
    handleContractError(error);
    process.exit(1);
  }
}

registerAdmin();
