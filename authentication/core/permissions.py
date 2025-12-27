"""
Permission definitions and role mappings
"""

# All available permissions in the system
ALL_PERMISSIONS = {
    # Household management
    "view_households": "Xem danh sách hộ khẩu",
    "create_household": "Thêm hộ khẩu mới",
    "edit_household": "Sửa thông tin hộ khẩu",
    "delete_household": "Xóa hộ khẩu",
    # Resident management
    "view_residents": "Xem danh sách nhân khẩu",
    "create_resident": "Thêm nhân khẩu mới",
    "edit_resident": "Sửa thông tin nhân khẩu",
    "delete_resident": "Xóa nhân khẩu",
    # Feedback management
    "view_feedback": "Xem kiến nghị",
    "create_feedback": "Gửi kiến nghị",
    "forward_feedback": "Chuyển tiếp kiến nghị",
    "respond_feedback": "Phản hồi kiến nghị",
    "close_feedback": "Đóng kiến nghị",
    # Reports & Analytics
    "view_reports": "Xem báo cáo",
    "export_reports": "Xuất báo cáo",
    "view_analytics": "Xem phân tích dữ liệu",
    # System administration
    "manage_users": "Quản lý tài khoản",
    "manage_roles": "Quản lý vai trò",
    "system_settings": "Cấu hình hệ thống",
    "view_logs": "Xem nhật ký",
}

# Permission categories for organized display
PERMISSION_CATEGORIES = [
    {
        "category": "Quản lý Hộ khẩu",
        "permissions": [
            "view_households",
            "create_household",
            "edit_household",
            "delete_household",
        ],
    },
    {
        "category": "Quản lý Nhân khẩu",
        "permissions": [
            "view_residents",
            "create_resident",
            "edit_resident",
            "delete_resident",
        ],
    },
    {
        "category": "Quản lý Kiến nghị",
        "permissions": [
            "view_feedback",
            "create_feedback",
            "forward_feedback",
            "respond_feedback",
            "close_feedback",
        ],
    },
    {
        "category": "Báo cáo & Thống kê",
        "permissions": [
            "view_reports",
            "export_reports",
            "view_analytics",
        ],
    },
    {
        "category": "Quản trị Hệ thống",
        "permissions": [
            "manage_users",
            "manage_roles",
            "system_settings",
            "view_logs",
        ],
    },
]

# Default permissions for each role
ROLE_PERMISSIONS = {
    "nguoi_dan": [
        "view_households",  # Only their own
        "create_feedback",
        "view_feedback",  # Only their own
    ],
    "to_truong": [
        "view_households",
        "create_household",
        "edit_household",
        "delete_household",
        "view_residents",
        "create_resident",
        "edit_resident",
        "delete_resident",
        "view_feedback",
        "create_feedback",
        "forward_feedback",
        "view_reports",
        "export_reports",
    ],
    "can_bo_phuong": [
        "view_feedback",
        "forward_feedback",
        "respond_feedback",
        "close_feedback",
        "view_reports",
        "export_reports",
        "view_analytics",
    ],
    "admin": list(ALL_PERMISSIONS.keys()),  # All permissions
}

# Role metadata
ROLE_METADATA = {
    "nguoi_dan": {
        "name": "Người dân",
        "code": "CITIZEN",
        "color": "#0D47A1",
        "description": "Cư dân trong khu vực quản lý",
    },
    "to_truong": {
        "name": "Tổ trưởng",
        "code": "LEADER",
        "color": "#1B5E20",
        "description": "Quản lý hộ khẩu, nhân khẩu và kiến nghị trong phạm vi tổ dân phố",
    },
    "can_bo_phuong": {
        "name": "Cán bộ Phường/Xã",
        "code": "OFFICIAL",
        "color": "#E65100",
        "description": "Xử lý kiến nghị và quản lý thông tin cấp phường/xã",
    },
    "admin": {
        "name": "Quản trị viên",
        "code": "ADMIN",
        "color": "#B71C1C",
        "description": "Quản trị toàn bộ hệ thống",
    },
}
