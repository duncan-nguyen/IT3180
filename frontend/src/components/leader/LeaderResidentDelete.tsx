import LeaderLayout from './LeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ArrowLeft, Trash2, AlertTriangle, User, Home } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface LeaderResidentDeleteProps {
  onLogout: () => void;
}

export default function LeaderResidentDelete({ onLogout }: LeaderResidentDeleteProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - would come from API
  const residentData = {
    id: '1',
    name: 'Nguyễn Văn An',
    idNumber: '001085012345',
    birthDate: '15/03/1985',
    household: 'HK-001',
    householdAddress: '25 Nguyễn Trãi, Phường Đống Đa',
    relation: 'Chủ hộ',
    phone: '0912345678',
    email: 'nguyenvanan@example.com',
    residenceStatus: 'Thường trú',
  };

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/leader/residents')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3">
            Xóa Nhân khẩu
          </h1>
          <p className="text-[#212121]">
            Xác nhận xóa thông tin nhân khẩu: {residentData.name}
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
                    Cảnh báo: Xóa Nhân khẩu
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#212121] mb-4">
                  <strong>BẠN SẮP XÓA THÔNG TIN NHÂN KHẨU KHỎI HỆ THỐNG!</strong>
                </p>
                <p className="text-[#212121] mb-4">
                  Hành động này sẽ gây ra những hậu quả sau:
                </p>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      Thông tin cá nhân của <strong>{residentData.name}</strong> (CCCD: {residentData.idNumber}) sẽ bị xóa hoàn toàn
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      Người này sẽ bị loại khỏi hộ khẩu <strong>{residentData.household}</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      Lịch sử và dữ liệu liên quan sẽ bị xóa
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      Hành động này <strong>KHÔNG THỂ HOÀN TÁC</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      {residentData.relation === 'Chủ hộ' && (
                        <strong className="text-[#B71C1C]">
                          LƯU Ý ĐẶC BIỆT: Người này là CHỦ HỘ. Bạn cần chỉ định chủ hộ mới trước khi xóa!
                        </strong>
                      )}
                      {residentData.relation !== 'Chủ hộ' && (
                        <span>Cần có lý do chính đáng để xóa nhân khẩu</span>
                      )}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Special Warning for Head of Household */}
            {residentData.relation === 'Chủ hộ' && (
              <Card className="border-2 border-[#B71C1C]/40 shadow-lg bg-[#B71C1C]/5">
                <CardHeader>
                  <CardTitle className="text-[#B71C1C]">
                    ⚠️ Cảnh báo Đặc biệt: Xóa Chủ hộ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#212121] mb-4">
                    Người này là <strong>CHỦ HỘ</strong> của hộ khẩu {residentData.household}. 
                    Trước khi xóa, bạn <strong>BẮT BUỘC PHẢI</strong>:
                  </p>
                  <ul className="space-y-3 text-[#212121]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#B71C1C] mt-1">1.</span>
                      <span>Chỉ định một thành viên khác làm chủ hộ mới</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B71C1C] mt-1">2.</span>
                      <span>Có giấy tờ xác nhận từ cấp trên (Cán bộ Phường/Xã)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B71C1C] mt-1">3.</span>
                      <span>Thông báo cho tất cả thành viên trong hộ khẩu</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-[#B71C1C]/10 rounded-lg">
                    <p className="text-[#B71C1C]">
                      <strong>Khuyến nghị:</strong> Hãy chuyển quyền chủ hộ cho người khác trước, 
                      sau đó mới xóa người này khỏi hộ khẩu.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reason Required */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Lý do Xóa Nhân khẩu <span className="text-[#B71C1C]">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-[#0D47A1]/5 border-2 border-[#0D47A1]/20 rounded-lg">
                  <p className="text-[#212121]">
                    <strong>BẮT BUỘC:</strong> Bạn phải cung cấp lý do chính đáng để xóa nhân khẩu
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="reason" className="text-[#212121]">
                    Mô tả chi tiết lý do <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="VD: Người này đã chuyển đi nơi khác / Đã qua đời / Nhập nhầm dữ liệu / Chuyển hộ khẩu..."
                    className="min-h-[150px] border-2 border-[#212121]/20"
                  />
                </div>

                {residentData.relation === 'Chủ hộ' && (
                  <div className="space-y-3">
                    <Label htmlFor="new-owner" className="text-[#212121]">
                      Chủ hộ mới (nếu có) <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="new-owner"
                      placeholder="VD: Trần Thị Bình (vợ)"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                    <p className="text-sm text-[#212121]">
                      Bắt buộc nếu xóa chủ hộ và còn thành viên khác trong hộ
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Label htmlFor="supporting-docs" className="text-[#212121]">
                    Giấy tờ hỗ trợ
                  </Label>
                  <Textarea
                    id="supporting-docs"
                    placeholder="VD: Giấy xác nhận chuyển đi từ Công an Phường / Giấy chứng tử / Giấy xác nhận từ cán bộ phường..."
                    className="min-h-[100px] border-2 border-[#212121]/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="approved-by" className="text-[#212121]">
                    Người phê duyệt <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="approved-by"
                    placeholder="VD: Cán bộ Phường Nguyễn Văn X"
                    className="h-12 border-2 border-[#212121]/20"
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
                    <strong>Tôi hiểu rằng thông tin nhân khẩu sẽ bị xóa vĩnh viễn</strong>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm-household"
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="confirm-household" className="text-[#212121] cursor-pointer">
                    <strong>Tôi hiểu rằng người này sẽ bị loại khỏi hộ khẩu {residentData.household}</strong>
                  </label>
                </div>

                {residentData.relation === 'Chủ hộ' && (
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="confirm-new-owner"
                      className="w-5 h-5 mt-1"
                    />
                    <label htmlFor="confirm-new-owner" className="text-[#B71C1C] cursor-pointer">
                      <strong>Tôi đã chỉ định chủ hộ mới hoặc hộ khẩu sẽ bị giải thể</strong>
                    </label>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm-reason"
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="confirm-reason" className="text-[#212121] cursor-pointer">
                    <strong>Tôi đã có lý do chính đáng và sự phê duyệt từ cấp trên</strong>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm-backup"
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="confirm-backup" className="text-[#212121] cursor-pointer">
                    <strong>Tôi đã sao lưu hoặc lưu trữ thông tin cần thiết</strong>
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
                      <strong>TÔI CHẮC CHẮN MUỐN XÓA NHÂN KHẨU "{residentData.name.toUpperCase()}"</strong>
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
                  Xóa Nhân khẩu Vĩnh viễn
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/leader/residents')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                >
                  Hủy và Quay lại
                </Button>
              </CardContent>
            </Card>

            {/* Resident Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <User className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Nhân khẩu
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Họ và tên:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.name}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Số CCCD/CMND:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.idNumber}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Ngày sinh:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.birthDate}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Số điện thoại:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.phone}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Email:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Household Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                    <Home className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Hộ khẩu
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Số hộ khẩu:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.household}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Địa chỉ:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.householdAddress}
                  </p>
                </div>

                <div className={`p-3 rounded-lg ${
                  residentData.relation === 'Chủ hộ' 
                    ? 'bg-[#B71C1C]/10 border border-[#B71C1C]/20' 
                    : 'bg-[#F5F5F5]'
                }`}>
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Quan hệ:</strong>
                  </p>
                  <span className={`inline-block px-3 py-1 rounded ${
                    residentData.relation === 'Chủ hộ'
                      ? 'bg-[#B71C1C] text-white'
                      : 'bg-[#0D47A1]/10 text-[#0D47A1]'
                  }`}>
                    {residentData.relation}
                  </span>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Tình trạng cư trú:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.residenceStatus}
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
                  onClick={() => navigate(`/leader/residents/${id}/edit`)}
                >
                  Chỉnh sửa Thông tin
                </Button>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm text-[#212121]">
                    Đổi tình trạng cư trú sang "Tạm vắng" thay vì xóa
                  </p>
                </div>
                <div className="pt-3 border-t border-[#212121]/10">
                  <p className="text-sm text-[#212121]">
                    <strong>Khuyến nghị:</strong> Hãy cân nhắc kỹ trước khi xóa vĩnh viễn
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LeaderLayout>
  );
}
