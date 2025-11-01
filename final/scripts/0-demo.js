import { initContract, Role, formatAddress, getRoleName } from '../utils/helpers.js';
import { ethers } from 'ethers';

async function demo() {
  console.log('🏥 DEMO - Medical Records Contract\n');
  console.log('═'.repeat(70));

  try {
    const { provider, wallet, contract } = initContract();

    // 1. Thông tin cơ bản
    console.log('\n📊 THÔNG TIN CƠ BẢN');
    console.log('─'.repeat(70));
    
    const network = await provider.getNetwork();
    console.log('Network:', network.name || 'Celo Sepolia Testnet');
    console.log('Chain ID:', network.chainId.toString());
    console.log('Contract:', await contract.getAddress());
    console.log('Your Wallet:', wallet.address);
    
    const balance = await provider.getBalance(wallet.address);
    console.log('Balance:', ethers.formatEther(balance), 'CELO');

    // 2. Thống kê hệ thống
    console.log('\n📈 THỐNG KÊ HỆ THỐNG');
    console.log('─'.repeat(70));
    
    try {
      const recordCount = await contract.get_record_count();
      console.log('Tổng số hồ sơ:', recordCount.toString());
    } catch (error) {
      console.log('Tổng số hồ sơ: 0');
    }

    // 3. Kiểm tra user hiện tại
    console.log('\n👤 THÔNG TIN TÀI KHOẢN HIỆN TẠI');
    console.log('─'.repeat(70));
    
    try {
      const user = await contract.get_user(wallet.address);
      console.log('✅ Đã đăng ký');
      console.log('Vai trò:', getRoleName(user.role));
      console.log('Tên:', user.name);
      console.log('Email:', user.email);
      console.log('Tuổi:', user.age.toString());
      if (user.hasSpecialty) {
        console.log('Chuyên khoa:', user.specialty);
      }
      console.log('Trạng thái:', user.isActive ? '✅ Active' : '❌ Inactive');
      
      // 4. Xem hồ sơ liên quan
      if (user.role === Role.Admin) {
        console.log('\n🔐 QUYỀN ADMIN');
        console.log('─'.repeat(70));
        console.log('✅ Có thể xem tất cả hồ sơ');
        console.log('✅ Có thể đăng ký user mới');
        console.log('✅ Có thể quản lý trạng thái user');
        
        try {
          const allRecords = await contract.get_all_records();
          console.log('\n📚 Tất cả hồ sơ:', allRecords.length);
          
          if (allRecords.length > 0) {
            console.log('\nDanh sách hồ sơ:');
            allRecords.forEach((record, index) => {
              console.log(`  ${index + 1}. Hồ sơ #${record.id} - ${record.patientName}`);
              console.log(`     Bác sĩ: ${record.doctorName}`);
              console.log(`     Chẩn đoán: ${record.diagnosis.substring(0, 50)}...`);
            });
          }
        } catch (error) {
          console.log('Chưa có hồ sơ nào');
        }
        
      } else if (user.role === Role.Doctor) {
        console.log('\n👨‍⚕️ HỒ SƠ CỦA BÁC SĨ');
        console.log('─'.repeat(70));
        
        try {
          const doctorRecords = await contract.get_records_by_doctor(wallet.address);
          console.log('Số hồ sơ đã tạo:', doctorRecords.length);
          
          if (doctorRecords.length > 0) {
            console.log('\nDanh sách hồ sơ:');
            doctorRecords.forEach((record, index) => {
              console.log(`  ${index + 1}. Hồ sơ #${record.id} - ${record.patientName}`);
              console.log(`     Chẩn đoán: ${record.diagnosis}`);
              console.log(`     Điều trị: ${record.treatment}`);
            });
          }
        } catch (error) {
          console.log('Chưa tạo hồ sơ nào');
        }
        
      } else if (user.role === Role.Patient) {
        console.log('\n🤒 HỒ SƠ BỆNH NHÂN');
        console.log('─'.repeat(70));
        
        try {
          const patientRecords = await contract.get_records_by_patient(wallet.address);
          console.log('Số hồ sơ y tế:', patientRecords.length);
          
          if (patientRecords.length > 0) {
            console.log('\nDanh sách hồ sơ:');
            patientRecords.forEach((record, index) => {
              console.log(`  ${index + 1}. Hồ sơ #${record.id}`);
              console.log(`     Bác sĩ: ${record.doctorName}`);
              console.log(`     Chẩn đoán: ${record.diagnosis}`);
              console.log(`     Điều trị: ${record.treatment}`);
              console.log(`     Ngày khám: ${new Date(Number(record.createdAt) * 1000).toLocaleDateString('vi-VN')}`);
            });
          }
        } catch (error) {
          console.log('Chưa có hồ sơ nào');
        }
      }
      
    } catch (error) {
      console.log('❌ Chưa đăng ký trong hệ thống');
      console.log('\n💡 HƯỚNG DẪN');
      console.log('─'.repeat(70));
      console.log('1. Nếu đây là lần đầu tiên, hãy đăng ký Admin:');
      console.log('   npm run register-admin');
      console.log('\n2. Sau đó có thể đăng ký Doctor và Patient:');
      console.log('   npm run register-doctor');
      console.log('   npm run register-patient');
    }

    // 5. Gợi ý các thao tác tiếp theo
    console.log('\n🎯 CÁC LỆNH CÓ SẴN');
    console.log('─'.repeat(70));
    console.log('npm run check-connection    - Kiểm tra kết nối');
    console.log('npm run register-admin      - Đăng ký Admin (chỉ lần đầu)');
    console.log('npm run register-doctor     - Đăng ký Doctor');
    console.log('npm run register-patient    - Đăng ký Patient');
    console.log('npm run create-record       - Tạo hồ sơ y tế (Doctor)');
    console.log('npm run get-records         - Xem hồ sơ');
    console.log('npm run update-record       - Cập nhật hồ sơ (Doctor)');
    console.log('npm run get-all             - Xem tất cả hồ sơ (Admin)');

    console.log('\n═'.repeat(70));
    console.log('✅ Demo hoàn tất!\n');

  } catch (error) {
    console.error('\n❌ Lỗi:', error.message);
    console.log('\n💡 Kiểm tra:');
    console.log('- File .env đã được cấu hình đúng chưa?');
    console.log('- PRIVATE_KEY đã được điền chưa?');
    console.log('- Ví có đủ CELO testnet chưa?');
    process.exit(1);
  }
}

demo();
