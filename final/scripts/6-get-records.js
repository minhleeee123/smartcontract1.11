import { initContract, displayRecord, handleContractError } from '../utils/helpers.js';

async function getRecords() {
  try {
    console.log('📚 Xem hồ sơ y tế...\n');

    const { wallet, contract } = initContract();

    // Kiểm tra số lượng records
    const recordCount = await contract.get_record_count();
    console.log('📊 Tổng số hồ sơ:', recordCount.toString());

    if (recordCount === 0n) {
      console.log('ℹ️  Chưa có hồ sơ nào trong hệ thống\n');
      return;
    }

    // Menu lựa chọn
    console.log('\n🔍 Chọn cách xem:');
    console.log('1. Xem hồ sơ theo ID');
    console.log('2. Xem hồ sơ của bệnh nhân');
    console.log('3. Xem hồ sơ của bác sĩ');

    // Mặc định xem hồ sơ theo ID (có thể thay đổi logic)
    const viewType = 1;

    if (viewType === 1) {
      // Xem hồ sơ theo ID
      const recordId = 1; // Thay đổi ID cần xem
      
      console.log('\n📄 Xem hồ sơ #' + recordId);
      try {
        const record = await contract.get_record(recordId);
        displayRecord(record);
      } catch (error) {
        console.log('❌ Không tìm thấy hồ sơ #' + recordId);
      }
    } else if (viewType === 2) {
      // Xem hồ sơ của bệnh nhân
      const patientAddress = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'; // Thay đổi địa chỉ
      
      console.log('\n🤒 Xem hồ sơ của bệnh nhân:', patientAddress);
      const records = await contract.get_records_by_patient(patientAddress);
      
      if (records.length === 0) {
        console.log('ℹ️  Bệnh nhân chưa có hồ sơ nào');
      } else {
        console.log('📊 Tổng số hồ sơ:', records.length);
        records.forEach(record => displayRecord(record));
      }
    } else if (viewType === 3) {
      // Xem hồ sơ của bác sĩ
      const doctorAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'; // Thay đổi địa chỉ
      
      console.log('\n👨‍⚕️ Xem hồ sơ của bác sĩ:', doctorAddress);
      const records = await contract.get_records_by_doctor(doctorAddress);
      
      if (records.length === 0) {
        console.log('ℹ️  Bác sĩ chưa tạo hồ sơ nào');
      } else {
        console.log('📊 Tổng số hồ sơ:', records.length);
        records.forEach(record => displayRecord(record));
      }
    }

    console.log('\n✅ Hoàn tất!\n');

  } catch (error) {
    handleContractError(error);
    process.exit(1);
  }
}

getRecords();
