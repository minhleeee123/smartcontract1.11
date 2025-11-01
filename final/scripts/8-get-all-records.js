import { initContract, Role, displayRecord, handleContractError } from '../utils/helpers.js';

async function getAllRecords() {
  try {
    console.log('📚 Xem tất cả hồ sơ y tế (Admin only)...\n');

    const { wallet, contract } = initContract();

    // Kiểm tra quyền Admin
    console.log('🔐 Kiểm tra quyền Admin...');
    try {
      const user = await contract.get_user(wallet.address);
      if (user.role !== Role.Admin) {
        console.log('❌ Chỉ Admin mới có thể xem tất cả hồ sơ!');
        console.log('💡 Vai trò hiện tại:', ['Admin', 'Doctor', 'Patient'][user.role]);
        return;
      }
      console.log('✅ Xác nhận Admin:', user.name);
    } catch (error) {
      console.log('❌ Tài khoản chưa được đăng ký!');
      return;
    }

    // Lấy tất cả hồ sơ
    console.log('\n📊 Đang tải tất cả hồ sơ...');
    const records = await contract.get_all_records();

    if (records.length === 0) {
      console.log('ℹ️  Chưa có hồ sơ nào trong hệ thống\n');
      return;
    }

    console.log('📊 Tổng số hồ sơ:', records.length);
    console.log('═'.repeat(70));

    // Hiển thị tất cả hồ sơ
    records.forEach((record, index) => {
      displayRecord(record);
      if (index < records.length - 1) {
        console.log('─'.repeat(70));
      }
    });

    console.log('═'.repeat(70));

    // Thống kê
    const patientCount = new Set(records.map(r => r.patientAddress.toLowerCase())).size;
    const doctorCount = new Set(records.map(r => r.doctorAddress.toLowerCase())).size;

    console.log('\n📈 Thống kê:');
    console.log('   Tổng số hồ sơ:', records.length);
    console.log('   Số bệnh nhân:', patientCount);
    console.log('   Số bác sĩ:', doctorCount);

    console.log('\n✅ Hoàn tất!\n');

  } catch (error) {
    handleContractError(error);
    process.exit(1);
  }
}

getAllRecords();
