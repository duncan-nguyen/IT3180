import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { ArrowLeft, Trash2, AlertTriangle, Shield, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface AdminRoleDeleteProps {
  onLogout: () => void;
}

export default function AdminRoleDelete({ onLogout }: AdminRoleDeleteProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const roleInfo = {
    name: 'Tổ trưởng',
    code: 'LEADER',
    userCount: 7,
    color: '#1B5E20',
    description: 'Quản lý hộ khẩu, nhân khẩu và kiến nghị trong phạm vi tổ dân phố',
  };

  const affectedUsers = [
    { id: 1, name: 'Trần Thị Bình', email: 'tranthibinh@example.com' },
    { id: 2, name: 'Hoàng Văn Em', email: 'hoangvanem@example.com' },
    { id: 3, name: 'Phạm Văn Giang', email: 'phamvangiang@example.com' },
    { id: 4, name: 'Nguyễn Thị Hà', email: 'nguyenthiha@example.com' },
    { id: 5, name: 'Lê Văn Khoa', email: 'levankkhoa@example.com' },
  ];

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/roles')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3">
            Xóa Vai trò
          </h1>
          <p className="text-[#212121]">
            Xác nhận xóa vai trò: {roleInfo.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Critical Warning */}
            <Card className="border-2 border-[#B71C1C]/40 shadow-lg bg-[#B71C1C]/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#B71C1C]/20">
                    <AlertTriangle className="w-8 h-8 text-[#B71C1C]" />
                  </div>
                  <CardTitle className="text-[#B71C1C]">
                    Cảnh báo: Hành động Nghiêm trọng
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#212121] mb-4">
                  <strong>XÓA VAI TRÒ LÀ HÀNH ĐỘNG CỰC KỲ NGUY HIỂM VÀ KHÔNG THỂ HOÀN TÁC!</strong>
                </p>
                <p className="text-[#212121] mb-4">
                  Trước khi tiếp tục, bạn cần hiểu rõ những hậu quả sau:
                </p>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span><strong>Tất cả {roleInfo.userCount} người dùng</strong> hiện đang sử dụng vai trò này sẽ <strong>MẤT QUYỀN TRUY CẬP NGAY LẬP TỨC</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>Các người dùng sẽ <strong>KHÔNG THỂ ĐĂNG NHẬP</strong> cho đến khi được gán vai trò mới</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>Tất cả các <strong>PHIÊN ĐĂNG NHẬP HIỆN TẠI</strong> của người dùng vai trò này sẽ bị <strong>HỦY NGAY</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>Cấu hình quyền hạn của vai trò sẽ bị <strong>XÓA VĨNh VIỄN</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>Hành động này <strong>KHÔNG THỂ HOÀN TÁC</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>Bạn sẽ phải <strong>TẠO LẠI</strong> vai trò và <strong>CẤU HÌNH LẠI</strong> quyền hạn nếu muốn sử dụng lại</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Affected Users */}
            <Card className="border-2 border-[#B71C1C]/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-[#B71C1C]" />
                  <CardTitle className="text-[#212121]">
                    Người dùng bị Ảnh hưởng ({roleInfo.userCount})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#212121] mb-4">
                  Những người dùng sau đây sẽ <strong>MẤT QUYỀN TRUY CẬP</strong> ngay sau khi bạn xóa vai trò:
                </p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {affectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 bg-[#B71C1C]/5 border border-[#B71C1C]/20 rounded-lg"
                    >
                      <p className="text-[#212121]">
                        <strong>{user.name}</strong>
                      </p>
                      <p className="text-sm text-[#212121]">
                        {user.email}
                      </p>
                    </div>
                  ))}
                  {roleInfo.userCount > 5 && (
                    <div className="p-3 text-center bg-[#F5F5F5] rounded-lg">
                      <p className="text-[#212121]">
                        ... và {roleInfo.userCount - 5} người dùng khác
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Migration Plan Required */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Kế hoạch Chuyển đổi <span className="text-[#B71C1C]">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-[#0D47A1]/5 border-2 border-[#0D47A1]/20 rounded-lg">
                  <p className="text-[#212121] mb-3">
                    <strong>BẮT BUỘC:</strong> Bạn phải có kế hoạch xử lý người dùng sau khi xóa vai trò
                  </p>
                  <ul className="space-y-2 text-[#212121]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#0D47A1] mt-1">→</span>
                      <span>Chuyển người dùng sang vai trò khác</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0D47A1] mt-1">→</span>
                      <span>Khóa tạm thời các tài khoản</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0D47A1] mt-1">→</span>
                      <span>Thông báo trước cho người dùng</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="migration-plan" className="text-[#212121]">
                    Mô tả Kế hoạch Xử lý <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Textarea
                    id="migration-plan"
                    placeholder="Ví dụ: Tất cả 7 Tổ trưởng sẽ được chuyển sang vai trò 'Người dân' tạm thời, sau đó sẽ tạo vai trò mới 'Tổ trưởng V2' với quyền hạn cải tiến..."
                    className="min-h-[150px] border-2 border-[#212121]/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="reason" className="text-[#212121]">
                    Lý do Xóa Vai trò <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Ví dụ: Tái cơ cấu hệ thống phân quyền, gộp vai trò, không còn sử dụng..."
                    className="min-h-[100px] border-2 border-[#212121]/20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Confirmation */}
            <Card className="border-2 border-[#B71C1C]/30 shadow-lg bg-[#B71C1C]/5">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm-understand"
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="confirm-understand" className="text-[#212121] cursor-pointer">
                    <strong>Tôi hiểu rằng {roleInfo.userCount} người dùng sẽ mất quyền truy cập ngay lập tức</strong>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm-plan"
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="confirm-plan" className="text-[#212121] cursor-pointer">
                    <strong>Tôi đã có kế hoạch xử lý cho tất cả người dùng bị ảnh hưởng</strong>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm-irreversible"
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="confirm-irreversible" className="text-[#212121] cursor-pointer">
                    <strong>Tôi hiểu rằng hành động này KHÔNG THỂ HOÀN TÁC</strong>
                  </label>
                </div>

                <div className="pt-4 border-t-2 border-[#B71C1C]/20">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="confirm-delete"
                      className="w-5 h-5 mt-1"
                    />
                    <label htmlFor="confirm-delete" className="text-[#B71C1C] cursor-pointer">
                      <strong>TÔI CHẮC CHẮN MUỐN XÓA VAI TRÒ "{roleInfo.name.toUpperCase()}"</strong>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hành động
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full h-14 bg-[#B71C1C] hover:bg-[#B71C1C]/90">
                  <Trash2 className="w-5 h-5 mr-2" />
                  Xóa Vai trò Vĩnh viễn
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/roles')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                >
                  Hủy và Quay lại
                </Button>
              </CardContent>
            </Card>

            {/* Role Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${roleInfo.color}20` }}
                  >
                    <Shield className="w-6 h-6" style={{ color: roleInfo.color }} />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Vai trò
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Tên vai trò:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {roleInfo.name}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Mã vai trò:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {roleInfo.code}
                  </p>
                </div>

                <div className="p-3 bg-[#B71C1C]/10 border border-[#B71C1C]/20 rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Số người dùng:</strong>
                  </p>
                  <p className="text-2xl text-[#B71C1C]">
                    {roleInfo.userCount} tài khoản
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Mô tả:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {roleInfo.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Alternative Actions */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hành động Thay thế
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-[#212121] mb-3">
                  Thay vì xóa, bạn có thể:
                </p>
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-[#0D47A1]/30 text-[#0D47A1]"
                  onClick={() => navigate(`/admin/roles/${id}/edit`)}
                >
                  Chỉnh sửa Quyền hạn
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-[#0D47A1]/30 text-[#0D47A1]"
                  onClick={() => navigate(`/admin/roles/${id}/detail`)}
                >
                  Xem Chi tiết
                </Button>
                <div className="pt-3 border-t border-[#212121]/10">
                  <p className="text-sm text-[#212121]">
                    <strong>Gợi ý:</strong> Hãy cân nhắc chỉnh sửa quyền hạn thay vì xóa vai trò hoàn toàn
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
