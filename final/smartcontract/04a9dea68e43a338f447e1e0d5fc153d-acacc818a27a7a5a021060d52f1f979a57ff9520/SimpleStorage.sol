// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title MedicalRecordsContract (Solidity port of Soroban version)
/// @notice Giữ nguyên tên hàm & chức năng cốt lõi so với bản Rust.
/// Quy ước:
/// - "caller.require_auth()" -> dùng msg.sender
/// - Lần đăng ký đầu tiên chỉ cho phép tạo Admin
/// - get_all_records: chỉ Admin được gọi (theo comment gốc)

contract MedicalRecordsContract {
    // ===========================
    // DATA STRUCTURES
    // ===========================

    enum Role {
        Admin,
        Doctor,
        Patient
    }

    struct User {
        address userAddress;
        Role role;
        string name;
        uint32 age;
        string email;
        string specialty;  // dùng kèm hasSpecialty để biểu diễn Option<String>
        bool hasSpecialty;
        bool isActive;
        uint64 createdAt;
        bool exists;       // đánh dấu tồn tại
    }

    struct MedicalRecord {
        uint32 id;                 // tương đương u32
        address patientAddress;
        string patientName;
        address doctorAddress;
        string doctorName;
        string diagnosis;
        string treatment;
        uint64 createdAt;
        uint64 updatedAt;
        bool exists;
    }

    // ===========================
    // STORAGE
    // ===========================

    mapping(address => User) private users;
    mapping(uint256 => MedicalRecord) private records;
    uint32 private recordCounter;

    mapping(address => uint256[]) private patientRecords;
    mapping(address => uint256[]) private doctorRecords;
    uint256[] private allRecordIds;

    uint256 private totalUsers; // để phát hiện lần đăng ký đầu tiên

    // ===========================
    // ERRORS (mapping Error enum)
    // ===========================
    error Unauthorized();   // 1
    error UserNotFound();   // 2
    error RecordNotFound(); // 3
    error InvalidRole();    // 4
    error UserInactive();   // 5
    error AlreadyExists();  // 7

    // ===========================
    // INTERNAL HELPERS / MODIFIERS
    // ===========================

    function _requireAdmin(address who) internal view {
        User storage u = users[who];
        if (!u.exists) revert UserNotFound();
        if (u.role != Role.Admin) revert Unauthorized();
        if (!u.isActive) revert UserInactive();
    }

    // ===========================
    // ADMIN FUNCTIONS
    // ===========================

    /// Đăng ký người dùng mới (chỉ Admin; riêng lần đầu cho phép tạo Admin)
    /// Rust: register_user(env, caller, address, role, name, age, email, specialty)
    /// Solidity: dùng msg.sender thay cho caller
    function register_user(
        address userAddress,
        Role role,
        string calldata name,
        uint32 age,
        string calldata email,
        string calldata specialty,
        bool hasSpecialty
    ) external {
        // Nếu đã có user trước đó -> chỉ Admin mới được đăng ký thêm
        if (totalUsers > 0) {
            _requireAdmin(msg.sender);
        } else {
            // Lần đầu tiên, chỉ cho phép tạo Admin
            if (role != Role.Admin) revert Unauthorized();
        }

        if (users[userAddress].exists) revert AlreadyExists();

        users[userAddress] = User({
            userAddress: userAddress,
            role: role,
            name: name,
            age: age,
            email: email,
            specialty: specialty,
            hasSpecialty: hasSpecialty,
            isActive: true,
            createdAt: uint64(block.timestamp),
            exists: true
        });

        totalUsers += 1;
    }

    /// Kích hoạt/vô hiệu hóa user (chỉ Admin)
    /// Rust: set_user_active(env, caller, user_address, is_active)
    /// Solidity: dùng msg.sender thay cho caller
    function set_user_active(
        address userAddress,
        bool isActive
    ) external {
        _requireAdmin(msg.sender);

        User storage u = users[userAddress];
        if (!u.exists) revert UserNotFound();

        u.isActive = isActive;
    }

    // ===========================
    // DOCTOR FUNCTIONS
    // ===========================

    /// Tạo hồ sơ y tế mới (chỉ Doctor)
    /// Rust: create_record(env, doctor, patient, diagnosis, treatment)
    /// Solidity: dùng msg.sender là doctor
    function create_record(
        address patient,
        string calldata diagnosis,
        string calldata treatment
    ) external returns (uint32) {
        // Kiểm tra doctor (msg.sender)
        User storage d = users[msg.sender];
        if (!d.exists) revert UserNotFound();
        if (d.role != Role.Doctor) revert InvalidRole();
        if (!d.isActive) revert UserInactive();

        // Kiểm tra patient
        User storage p = users[patient];
        if (!p.exists) revert UserNotFound();
        if (p.role != Role.Patient) revert InvalidRole();
        if (!p.isActive) revert UserInactive();

        // Tạo ID mới
        recordCounter += 1;
        uint32 recordId = recordCounter;

        uint64 ts = uint64(block.timestamp);

        records[recordId] = MedicalRecord({
            id: recordId,
            patientAddress: patient,
            patientName: p.name,
            doctorAddress: msg.sender,
            doctorName: d.name,
            diagnosis: diagnosis,
            treatment: treatment,
            createdAt: ts,
            updatedAt: ts,
            exists: true
        });

        // Index cho patient
        patientRecords[patient].push(recordId);

        // Index cho doctor
        doctorRecords[msg.sender].push(recordId);

        // Danh sách tất cả records
        allRecordIds.push(recordId);

        return recordId;
    }

    /// Cập nhật hồ sơ (chỉ Doctor tạo hồ sơ đó)
    /// Rust: update_record(env, doctor, record_id, diagnosis, treatment)
    /// Solidity: dùng msg.sender là doctor
    function update_record(
        uint32 recordId,
        string calldata diagnosis,
        string calldata treatment
    ) external {
        MedicalRecord storage r = records[recordId];
        if (!r.exists) revert RecordNotFound();

        if (r.doctorAddress != msg.sender) revert Unauthorized();

        r.diagnosis = diagnosis;
        r.treatment = treatment;
        r.updatedAt = uint64(block.timestamp);
    }

    // ===========================
    // READ FUNCTIONS (Public)
    // ===========================

    /// Lấy thông tin user
    function get_user(address addr) external view returns (
        address userAddress,
        Role role,
        string memory name,
        uint32 age,
        string memory email,
        string memory specialty,
        bool hasSpecialty,
        bool isActive,
        uint64 createdAt
    ) {
        User storage u = users[addr];
        if (!u.exists) revert UserNotFound();
        return (
            u.userAddress,
            u.role,
            u.name,
            u.age,
            u.email,
            u.specialty,
            u.hasSpecialty,
            u.isActive,
            u.createdAt
        );
    }

    /// Lấy thông tin record
    function get_record(uint32 recordId) public view returns (MedicalRecord memory) {
        MedicalRecord storage r = records[recordId];
        if (!r.exists) revert RecordNotFound();
        return r;
    }

    /// Lấy tất cả hồ sơ của bệnh nhân
    function get_records_by_patient(address patient) external view returns (MedicalRecord[] memory) {
        uint256[] storage ids = patientRecords[patient];
        uint256 n = ids.length;
        MedicalRecord[] memory outArr = new MedicalRecord[](n);
        for (uint256 i = 0; i < n; i++) {
            outArr[i] = get_record(uint32(ids[i]));
        }
        return outArr;
    }

    /// Lấy tất cả hồ sơ của bác sĩ
    function get_records_by_doctor(address doctor) external view returns (MedicalRecord[] memory) {
        uint256[] storage ids = doctorRecords[doctor];
        uint256 n = ids.length;
        MedicalRecord[] memory outArr = new MedicalRecord[](n);
        for (uint256 i = 0; i < n; i++) {
            outArr[i] = get_record(uint32(ids[i]));
        }
        return outArr;
    }

    /// Lấy tất cả hồ sơ (Admin only)
    function get_all_records() external view returns (MedicalRecord[] memory) {
        _requireAdmin(msg.sender);
        uint256 n = allRecordIds.length;
        MedicalRecord[] memory outArr = new MedicalRecord[](n);
        for (uint256 i = 0; i < n; i++) {
            outArr[i] = get_record(uint32(allRecordIds[i]));
        }
        return outArr;
    }

    /// Lấy số lượng records
    function get_record_count() external view returns (uint32) {
        return recordCounter;
    }
}
