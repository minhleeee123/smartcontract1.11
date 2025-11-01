import { initContract, Role, waitForTransaction, handleContractError, displayUser } from '../utils/helpers.js';

async function setUserActive() {
  try {
    console.log('🔄 Kích hoạt/Vô hiệu hóa User...\n');

    const { wallet, contract } = initContract();

    // Địa chỉ user cần thay đổi trạng thái
    const targetUserAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1'; // Thay đổi địa chỉ này
    const isActive = true; // true = kích hoạt, false = vô hiệu hóa

    // Kiểm tra quyền Admin
    console.log('🔐 Kiểm tra quyền Admin của:', wallet.address);
    try {
      const admin = await contract.get_user(wallet.address);
      if (admin.role !== Role.Admin) {
        console.log('❌ Chỉ Admin mới có thể thay đổi trạng thái user!');
        return;
      }
      console.log('✅ Xác nhận Admin:', admin.name);
    } catch (error) {
      console.log('❌ Tài khoản chưa được đăng ký!');
      return;
    }

    // Kiểm tra user cần thay đổi
    console.log('\n🔍 Kiểm tra user:', targetUserAddress);
    let targetUser;
    try {
      targetUser = await contract.get_user(targetUserAddress);
      console.log('✅ Tìm thấy user');
      displayUser(targetUser);
    } catch (error) {
      console.log('❌ User không tồn tại!');
      return;
    }

    // Thực hiện thay đổi
    console.log('\n📝 Thay đổi trạng thái:');
    console.log('   Từ:', targetUser.isActive ? 'Active ✅' : 'Inactive ❌');
    console.log('   Sang:', isActive ? 'Active ✅' : 'Inactive ❌');

    if (targetUser.isActive === isActive) {
      console.log('\n⚠️  User đã ở trạng thái này rồi!');
      return;
    }

    // Gửi transaction
    console.log('\n📤 Đang gửi transaction...');
    const tx = await contract.set_user_active(targetUserAddress, isActive);

    await waitForTransaction(tx, 'Đang cập nhật trạng thái...');

    // Kiểm tra kết quả
    console.log('\n🔍 Kiểm tra kết quả:');
    const updatedUser = await contract.get_user(targetUserAddress);
    displayUser(updatedUser);

    console.log('\n✅ Cập nhật trạng thái thành công!\n');

  } catch (error) {
    handleContractError(error);
    process.exit(1);
  }
}

setUserActive();
