import { initContract, Role, waitForTransaction, handleContractError, displayUser } from '../utils/helpers.js';

async function registerPatient() {
  try {
    console.log('🤒 Đăng ký Bệnh nhân mới...\n');

    const { wallet, contract } = initContract();

    // Địa chỉ bệnh nhân (có thể thay đổi)
    const patientAddress = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'; // Thay đổi địa chỉ này

    // Kiểm tra xem bệnh nhân đã tồn tại chưa
    try {
      const existingUser = await contract.get_user(patientAddress);
      console.log('⚠️  Bệnh nhân đã tồn tại!');
      displayUser(existingUser);
      return;
    } catch (error) {
      // User chưa tồn tại, tiếp tục đăng ký
    }

    // Thông tin bệnh nhân
    const patientData = {
      userAddress: patientAddress,
      role: Role.Patient,
      name: 'Trần Thị B',
      age: 28,
      email: 'patient.tran@email.com',
      specialty: '', // Patient không cần specialty
      hasSpecialty: false
    };

    console.log('📝 Thông tin đăng ký:');
    console.log('   Address:', patientData.userAddress);
    console.log('   Vai trò: Patient');
    console.log('   Tên:', patientData.name);
    console.log('   Tuổi:', patientData.age);
    console.log('   Email:', patientData.email);

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
      patientData.userAddress,
      patientData.role,
      patientData.name,
      patientData.age,
      patientData.email,
      patientData.specialty,
      patientData.hasSpecialty
    );

    await waitForTransaction(tx, 'Đang đăng ký Bệnh nhân...');

    // Kiểm tra kết quả
    console.log('\n🔍 Kiểm tra thông tin đã đăng ký:');
    const user = await contract.get_user(patientAddress);
    displayUser(user);

    console.log('\n✅ Đăng ký Bệnh nhân thành công!\n');

  } catch (error) {
    handleContractError(error);
    process.exit(1);
  }
}

registerPatient();
