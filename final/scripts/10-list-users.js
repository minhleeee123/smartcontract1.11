import { initContract, handleContractError } from '../utils/helpers.js';

async function listAllUsers() {
  try {
    console.log('👥 Liệt kê tất cả Users đã đăng ký...\n');

    const { contract } = initContract();

    // Danh sách các địa chỉ đã biết (có thể bổ sung)
    const knownAddresses = [
      '0x33835d130f1f98acfcbae204f9552b34917c7ded', // Deployer/Admin
      '0x742d35cc6634c0532925a3b844bc9e7595f0beb1', // Doctor 1
      '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199', // Patient 1
    ];

    console.log('📊 Kiểm tra', knownAddresses.length, 'địa chỉ...\n');
    console.log('═'.repeat(70));

    let foundUsers = [];
    const roleNames = ['👑 Admin', '👨‍⚕️ Doctor', '🤒 Patient'];

    for (const address of knownAddresses) {
      try {
        const user = await contract.get_user(address);
        foundUsers.push({ address, user });
        
        console.log('\n✅ User tìm thấy:');
        console.log('   Địa chỉ:', address);
        console.log('   Vai trò:', roleNames[user.role]);
        console.log('   Tên:', user.name);
        console.log('   Email:', user.email);
        console.log('   Tuổi:', user.age.toString());
        if (user.hasSpecialty) {
          console.log('   Chuyên khoa:', user.specialty);
        }
        console.log('   Trạng thái:', user.isActive ? '✅ Active' : '❌ Inactive');
        console.log('─'.repeat(70));
      } catch (error) {
        console.log('\n❌ Địa chỉ:', address);
        console.log('   Chưa đăng ký');
        console.log('─'.repeat(70));
      }
    }

    // Thống kê
    console.log('\n📈 THỐNG KÊ');
    console.log('═'.repeat(70));
    console.log('Tổng số địa chỉ kiểm tra:', knownAddresses.length);
    console.log('Số user đã đăng ký:', foundUsers.length);

    if (foundUsers.length > 0) {
      const adminCount = foundUsers.filter(u => Number(u.user.role) === 0).length;
      const doctorCount = foundUsers.filter(u => Number(u.user.role) === 1).length;
      const patientCount = foundUsers.filter(u => Number(u.user.role) === 2).length;
      const activeCount = foundUsers.filter(u => u.user.isActive).length;

      console.log('\nPhân bổ theo vai trò:');
      console.log('  👑 Admin:', adminCount);
      console.log('  👨‍⚕️ Doctor:', doctorCount);
      console.log('  🤒 Patient:', patientCount);
      console.log('\nTrạng thái:');
      console.log('  ✅ Active:', activeCount);
      console.log('  ❌ Inactive:', foundUsers.length - activeCount);
    }

    console.log('\n💡 Lưu ý: Để kiểm tra thêm địa chỉ khác, hãy thêm vào mảng');
    console.log('   knownAddresses trong file scripts/10-list-users.js\n');

  } catch (error) {
    handleContractError(error);
    process.exit(1);
  }
}

listAllUsers();
