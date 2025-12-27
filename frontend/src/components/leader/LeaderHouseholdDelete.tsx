import LeaderLayout from './LeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { ArrowLeft, Trash2, AlertTriangle, Home, Users, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface LeaderHouseholdDeleteProps {
  onLogout: () => void;
}

export default function LeaderHouseholdDelete({ onLogout }: LeaderHouseholdDeleteProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - would come from API
  const householdData = {
    id: 'HK-001',
    owner: 'Nguyễn Văn An',
    address: '25 Nguyễn Trãi, Phường Đống Đa',
    members: 4,
    status: 'Đã xác minh',
    registrationDate: '15/01/2025',
  };

  const membersList = [
    { name: 'Nguyễn Văn An', relation: 'Chủ hộ', idNumber: '001088012345' },
    { name: 'Trần Thị Bình', relation: 'Vợ/chồng', idNumber: '001088012346' },
    { name: 'Nguyễn Văn Cường', relation: 'Con', idNumber: '001088012347' },
    { name: 'Nguyễn Thị Dung', relation: 'Con', idNumber: '001088012348' },
  ];

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/leader/households')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3">
            Xóa Hộ khẩu
          </h1>
          <p className="text-[#212121]">
            Xác nhận xóa hộ khẩu: {householdData.id}
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
                    Cảnh báo: Xóa Hộ khẩu
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#212121] mb-4">
                  <strong>BẠN SẮP XÓA HỘ KHẨU VÀ TẤT CẢ THÔNG TIN LIÊN QUAN!</strong>
                </p>
                <p className="text-[#212121] mb-4">
                  Hành động này sẽ gây ra những hậu quả sau:
                </p>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      <strong>Hộ khẩu {householdData.id}</strong> sẽ bị xóa hoàn toàn khỏi hệ thống
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      Thông tin của <strong>{householdData.members} thành viên</strong> trong hộ khẩu sẽ bị ảnh hưởng
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      Lịch sử và dữ liệu liên quan đến hộ khẩu sẽ bị xóa
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
                      Bạn cần có lý do chính đáng và sự phê duyệt từ cấp trên
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Members Affected */}
            <Card className="border-2 border-[#B71C1C]/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-[#B71C1C]" />
                  <CardTitle className="text-[#212121]">
                    Thành viên bị Ảnh hưởng ({householdData.members})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#212121] mb-4">
                  Những người sau sẽ <strong>MẤT THÔNG TIN HỘ KHẨU</strong> khi bạn xóa:
                </p>
                <div className="space-y-2">
                  {membersList.map((member, index) => (
                    <div
                      key={index}
                      className="p-4 bg-[#B71C1C]/5 border border-[#B71C1C]/20 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[#212121]">
                            <strong>{member.name}</strong>
                          </p>
                          <p className="text-sm text-[#212121] mt-1">
                            Quan hệ: {member.relation}
                          </p>
                          <p className="text-sm text-[#212121]">
                            CCCD/CMND: {member.idNumber}
                          </p>
                        </div>
                        {member.relation === 'Chủ hộ' && (
                          <span className="px-3 py-1 rounded bg-[#B71C1C]/20 text-[#B71C1C] text-sm">
                            Chủ hộ
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reason Required */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Lý do Xóa Hộ khẩu <span className="text-[#B71C1C]">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-[#0D47A1]/5 border-2 border-[#0D47A1]/20 rounded-lg">
                  <p className="text-[#212121]">
                    <strong>BẮT BUỘC:</strong> Bạn phải cung cấp lý do chính đáng để xóa hộ khẩu
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="reason" className="text-[#212121]">
                    Mô tả chi tiết lý do <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="VD: Hộ khẩu đã chuyển đi nơi khác / Nhập nhầm dữ liệu / Hộ đã giải thể..."
                    className="min-h-[150px] border-2 border-[#212121]/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="alternative-action" className="text-[#212121]">
                    Hành động đã thực hiện trước khi xóa
                  </Label>
                  <Textarea
                    id="alternative-action"
                    placeholder="VD: Đã thông báo cho chủ hộ / Đã lưu trữ bản sao giấy tờ / Đã báo cáo cấp trên..."
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
                    id="confirm-members"
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="confirm-members" className="text-[#212121] cursor-pointer">
                    <strong>Tôi hiểu rằng {householdData.members} thành viên sẽ mất thông tin hộ khẩu</strong>
                  </label>
                </div>

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
                      <strong>TÔI CHẮC CHẮN MUỐN XÓA HỘ KHẨU "{householdData.id}"</strong>
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
                  Xóa Hộ khẩu Vĩnh viễn
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/leader/households')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                >
                  Hủy và Quay lại
                </Button>
              </CardContent>
            </Card>

            {/* Household Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <Home className="w-6 h-6 text-[#0D47A1]" />
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
                    {householdData.id}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Chủ hộ:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {householdData.owner}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Địa chỉ:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {householdData.address}
                  </p>
                </div>

                <div className="p-3 bg-[#B71C1C]/10 border border-[#B71C1C]/20 rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Số thành viên:</strong>
                  </p>
                  <p className="text-2xl text-[#B71C1C]">
                    {householdData.members} người
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Trạng thái:</strong>
                  </p>
                  <span className="inline-block px-3 py-1 rounded bg-[#1B5E20] text-white">
                    {householdData.status}
                  </span>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Ngày đăng ký:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {householdData.registrationDate}
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
                  onClick={() => navigate(`/leader/households/${id}/edit`)}
                >
                  Chỉnh sửa Thông tin
                </Button>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm text-[#212121]">
                    Đặt trạng thái "Tạm ngừng" thay vì xóa hoàn toàn
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
