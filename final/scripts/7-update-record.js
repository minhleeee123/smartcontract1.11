import { initContract, Role, waitForTransaction, handleContractError, displayRecord } from '../utils/helpers.js';

async function updateRecord() {
  try {
    console.log('✏️  Cập nhật hồ sơ y tế...\n');

    const { wallet, contract } = initContract();

    // ID hồ sơ cần cập nhật
    const recordId = 1; // Thay đổi ID cần cập nhật

    // Kiểm tra hồ sơ tồn tại
    console.log('🔍 Kiểm tra hồ sơ #' + recordId);
    let record;
    try {
      record = await contract.get_record(recordId);
      console.log('✅ Tìm thấy hồ sơ');
      displayRecord(record);
    } catch (error) {
      console.log('❌ Không tìm thấy hồ sơ #' + recordId);
      return;
    }

    // Kiểm tra quyền (chỉ doctor tạo hồ sơ mới được cập nhật)
    console.log('\n🔐 Kiểm tra quyền...');
    if (record.doctorAddress.toLowerCase() !== wallet.address.toLowerCase()) {
      console.log('❌ Chỉ bác sĩ tạo hồ sơ mới có thể cập nhật!');
      console.log('   Doctor của hồ sơ:', record.doctorAddress);
      console.log('   Địa chỉ hiện tại:', wallet.address);
      return;
    }

    const doctor = await contract.get_user(wallet.address);
    if (doctor.role !== Role.Doctor) {
      console.log('❌ Chỉ Doctor mới có thể cập nhật hồ sơ!');
      return;
    }
    console.log('✅ Xác nhận quyền:', doctor.name);

    // Thông tin cập nhật
    const updateData = {
      recordId: recordId,
      diagnosis: 'Cao huyết áp độ 2, rối loạn lipid máu (Đã cải thiện)',
      treatment: 'Thuốc hạ áp Amlodipine 5mg/ngày, Atorvastatin 10mg/ngày. Huyết áp ổn định. Tiếp tục điều trị. Tái khám sau 1 tháng.'
    };

    console.log('\n📋 Thông tin cập nhật:');
    console.log('   Record ID:', updateData.recordId);
    console.log('   Chẩn đoán mới:', updateData.diagnosis);
    console.log('   Điều trị mới:', updateData.treatment);

    // Gửi transaction
    console.log('\n📤 Đang cập nhật hồ sơ...');
    const tx = await contract.update_record(
      updateData.recordId,
      updateData.diagnosis,
      updateData.treatment
    );

    await waitForTransaction(tx, 'Đang cập nhật hồ sơ y tế...');

    // Kiểm tra kết quả
    console.log('\n🔍 Kiểm tra hồ sơ sau khi cập nhật:');
    const updatedRecord = await contract.get_record(recordId);
    displayRecord(updatedRecord);

    console.log('\n✅ Cập nhật hồ sơ thành công!\n');

  } catch (error) {
    handleContractError(error);
    process.exit(1);
  }
}

updateRecord();
