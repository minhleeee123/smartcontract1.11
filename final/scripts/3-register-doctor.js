import { initContract, Role, waitForTransaction, handleContractError, displayUser } from '../utils/helpers.js';

async function registerDoctor() {
  try {
    console.log('👨‍⚕️ Đăng ký Bác sĩ mới...\n');

    const { wallet, contract } = initContract();

    // Địa chỉ bác sĩ (có thể thay đổi)
    // Để test, bạn có thể tạo địa chỉ mới hoặc dùng địa chỉ khác
    const doctorAddress = '0x742d35cc6634c0532925a3b844bc9e7595f0beb1'; // Thay đổi địa chỉ này

    // Kiểm tra xem bác sĩ đã tồn tại chưa
    try {
      const existingUser = await contract.get_user(doctorAddress);
      console.log('⚠️  Bác sĩ đã tồn tại!');
      displayUser(existingUser);
      return;
    } catch (error) {
      // User chưa tồn tại, tiếp tục đăng ký
    }

    // Thông tin bác sĩ
    const doctorData = {
      userAddress: doctorAddress,
      role: Role.Doctor,
      name: 'Bác sĩ Nguyễn Văn A',
      age: 45,
      email: 'doctor.nguyen@hospital.com',
      specialty: 'Tim mạch',
      hasSpecialty: true
    };

    console.log('📝 Thông tin đăng ký:');
    console.log('   Address:', doctorData.userAddress);
    console.log('   Vai trò: Doctor');
    console.log('   Tên:', doctorData.name);
    console.log('   Tuổi:', doctorData.age);
    console.log('   Email:', doctorData.email);
    console.log('   Chuyên khoa:', doctorData.specialty);

    // Kiểm tra quyền Admin
    console.log('\n🔐 Kiểm tra quyền Admin của:', wallet.address);
    const admin = await contract.get_user(wallet.address);
    if (Number(admin.role) !== Role.Admin) {
      console.log('❌ Chỉ Admin mới có thể đăng ký user mới!');
      return;
    }

    // Gửi transaction
    console.log('\n📤 Đang gửi transaction...');
    const tx = await contract.register_user(
      doctorData.userAddress,
      doctorData.role,
      doctorData.name,
      doctorData.age,
      doctorData.email,
      doctorData.specialty,
      doctorData.hasSpecialty
    );

    await waitForTransaction(tx, 'Đang đăng ký Bác sĩ...');

    // Kiểm tra kết quả
    console.log('\n🔍 Kiểm tra thông tin đã đăng ký:');
    const user = await contract.get_user(doctorAddress);
    displayUser(user);

    console.log('\n✅ Đăng ký Bác sĩ thành công!\n');

  } catch (error) {
    handleContractError(error);
    process.exit(1);
  }
}

registerDoctor();
