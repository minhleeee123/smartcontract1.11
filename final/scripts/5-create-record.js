import { initContract, Role, waitForTransaction, handleContractError, displayRecord } from '../utils/helpers.js';

async function createRecord() {
  try {
    console.log('📝 Tạo hồ sơ y tế mới...\n');

    const { wallet, contract } = initContract();

    // Địa chỉ bệnh nhân (phải đã được đăng ký trước)
    const patientAddress = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'; // Thay đổi theo địa chỉ patient đã đăng ký

    // Kiểm tra doctor (phải là Doctor role)
    console.log('🔐 Kiểm tra quyền Doctor của:', wallet.address);
    try {
      const doctor = await contract.get_user(wallet.address);
      if (doctor.role !== Role.Doctor) {
        console.log('❌ Chỉ Doctor mới có thể tạo hồ sơ y tế!');
        console.log('💡 Bạn cần đăng nhập bằng tài khoản Doctor');
        return;
      }
      console.log('✅ Xác nhận Doctor:', doctor.name);
    } catch (error) {
      console.log('❌ Tài khoản chưa được đăng ký!');
      return;
    }

    // Kiểm tra patient
    console.log('\n🔍 Kiểm tra bệnh nhân:', patientAddress);
    try {
      const patient = await contract.get_user(patientAddress);
      if (patient.role !== Role.Patient) {
        console.log('❌ Địa chỉ không phải là Patient!');
        return;
      }
      console.log('✅ Bệnh nhân:', patient.name);
    } catch (error) {
      console.log('❌ Bệnh nhân chưa được đăng ký!');
      console.log('💡 Hãy đăng ký bệnh nhân trước khi tạo hồ sơ');
      return;
    }

    // Thông tin hồ sơ
    const recordData = {
      patient: patientAddress,
      diagnosis: 'Cao huyết áp độ 2, rối loạn lipid máu',
      treatment: 'Thuốc hạ áp Amlodipine 5mg/ngày, Atorvastatin 10mg/ngày. Tái khám sau 2 tuần.'
    };

    console.log('\n📋 Thông tin hồ sơ:');
    console.log('   Bệnh nhân:', recordData.patient);
    console.log('   Chẩn đoán:', recordData.diagnosis);
    console.log('   Điều trị:', recordData.treatment);

    // Gửi transaction
    console.log('\n📤 Đang tạo hồ sơ...');
    const tx = await contract.create_record(
      recordData.patient,
      recordData.diagnosis,
      recordData.treatment
    );

    const receipt = await waitForTransaction(tx, 'Đang tạo hồ sơ y tế...');

    // Lấy recordId từ logs (nếu có event)
    // Hoặc đọc từ return value
    console.log('\n🔍 Đang lấy thông tin hồ sơ vừa tạo...');
    const recordCount = await contract.get_record_count();
    console.log('   Record ID:', recordCount.toString());

    // Đọc chi tiết hồ sơ
    const record = await contract.get_record(recordCount);
    displayRecord(record);

    console.log('\n✅ Tạo hồ sơ y tế thành công!\n');

  } catch (error) {
    handleContractError(error);
    process.exit(1);
  }
}

createRecord();
