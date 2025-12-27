import LeaderLayout from './LeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Save, MessageSquare, User, MapPin, AlertCircle, FileText, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LeaderFeedbackCreateProps {
  onLogout: () => void;
}

export default function LeaderFeedbackCreate({ onLogout }: LeaderFeedbackCreateProps) {
  const navigate = useNavigate();

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/leader/feedback')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3">
            Ghi nhận Kiến nghị Mới
          </h1>
          <p className="text-[#212121]">
            Ghi nhận kiến nghị từ người dân trong khu vực quản lý
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reporter Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <User className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Người phản ánh
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-[#0D47A1]/5 border-2 border-[#0D47A1]/20 rounded-lg">
                  <p className="text-[#212121] mb-3">
                    Chọn người phản ánh từ danh sách nhân khẩu hoặc nhập thủ công
                  </p>
                  <div className="space-y-3">
                    <Label htmlFor="select-resident" className="text-[#212121]">
                      Chọn từ danh sách Nhân khẩu
                    </Label>
                    <Select>
                      <SelectTrigger id="select-resident" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue placeholder="Chọn người phản ánh..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">--- Nhập thủ công ---</SelectItem>
                        <SelectItem value="1">Nguyễn Văn An (HK-001) - 0912345678</SelectItem>
                        <SelectItem value="2">Trần Thị Bình (HK-001) - 0923456789</SelectItem>
                        <SelectItem value="3">Lê Văn Cường (HK-002) - 0934567890</SelectItem>
                        <SelectItem value="4">Phạm Thị Dung (HK-003) - 0945678901</SelectItem>
                        <SelectItem value="5">Hoàng Văn Em (HK-004) - 0956789012</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="reporter-name" className="text-[#212121]">
                    Họ và tên <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="reporter-name"
                    placeholder="VD: Nguyễn Văn An"
                    className="h-12 border-2 border-[#212121]/20"
                  />
                  <p className="text-sm text-[#212121]">
                    Tự động điền nếu chọn từ danh sách nhân khẩu
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="reporter-phone" className="text-[#212121]">
                      Số điện thoại <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="reporter-phone"
                      placeholder="VD: 0912345678"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="reporter-household" className="text-[#212121]">
                      Số hộ khẩu
                    </Label>
                    <Input
                      id="reporter-household"
                      placeholder="VD: HK-001"
                      className="h-12 border-2 border-[#212121]/20"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="reporter-address" className="text-[#212121]">
                    Địa chỉ
                  </Label>
                  <Input
                    id="reporter-address"
                    placeholder="VD: 25 Nguyễn Trãi, Phường Đống Đa"
                    className="h-12 border-2 border-[#212121]/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="contact-method" className="text-[#212121]">
                    Hình thức tiếp nhận <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Select defaultValue="in-person">
                    <SelectTrigger id="contact-method" className="h-12 border-2 border-[#212121]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">Gặp trực tiếp</SelectItem>
                      <SelectItem value="phone">Qua điện thoại</SelectItem>
                      <SelectItem value="visit">Thăm hộ gia đình</SelectItem>
                      <SelectItem value="meeting">Tại cuộc họp</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Content */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                    <MessageSquare className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Nội dung Kiến nghị
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-[#212121]">
                    Tiêu đề <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="VD: Đèn đường khu vực ngõ 25 bị hỏng"
                    className="h-12 border-2 border-[#212121]/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="content" className="text-[#212121]">
                    Mô tả chi tiết <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Mô tả chi tiết về vấn đề, thời gian xảy ra, mức độ ảnh hưởng..."
                    className="min-h-[200px] border-2 border-[#212121]/20"
                  />
                  <p className="text-sm text-[#212121]">
                    Ghi chép đầy đủ thông tin từ người phản ánh
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-[#212121]">
                      Phân loại <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger id="category" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue placeholder="Chọn phân loại..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="infrastructure">Hạ tầng</SelectItem>
                        <SelectItem value="environment">Môi trường</SelectItem>
                        <SelectItem value="security">An ninh trật tự</SelectItem>
                        <SelectItem value="traffic">Giao thông</SelectItem>
                        <SelectItem value="education">Giáo dục</SelectItem>
                        <SelectItem value="health">Y tế</SelectItem>
                        <SelectItem value="social">Phúc lợi xã hội</SelectItem>
                        <SelectItem value="administrative">Thủ tục hành chính</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="priority" className="text-[#212121]">
                      Mức độ ưu tiên <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="priority" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Khẩn cấp (Cần xử lý ngay)</SelectItem>
                        <SelectItem value="high">Cao (Trong vòng 1 tuần)</SelectItem>
                        <SelectItem value="medium">Trung bình (Trong vòng 1 tháng)</SelectItem>
                        <SelectItem value="low">Thấp (Theo kế hoạch)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="deadline-request" className="text-[#212121]">
                    Thời hạn mong muốn
                  </Label>
                  <input
                    id="deadline-request"
                    type="date"
                    className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                  />
                  <p className="text-sm text-[#212121]">
                    Thời hạn người dân mong muốn vấn đề được giải quyết
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <MapPin className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Vị trí Sự việc
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="location-detail" className="text-[#212121]">
                    Địa điểm cụ thể <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="location-detail"
                    placeholder="VD: Ngõ 25 Nguyễn Trãi, đối diện số nhà 30"
                    className="h-12 border-2 border-[#212121]/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="location-note" className="text-[#212121]">
                    Mô tả thêm về vị trí
                  </Label>
                  <Textarea
                    id="location-note"
                    placeholder="VD: Gần cây đa, cạnh cổng trường tiểu học..."
                    className="min-h-[100px] border-2 border-[#212121]/20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <Upload className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    File đính kèm
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="attachments" className="text-[#212121]">
                    Hình ảnh hoặc tài liệu liên quan
                  </Label>
                  <div className="border-2 border-dashed border-[#212121]/20 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-[#212121]/50" />
                    <p className="text-[#212121] mb-2">
                      Kéo thả file vào đây hoặc nhấn để chọn
                    </p>
                    <p className="text-sm text-[#212121]">
                      Hỗ trợ: JPG, PNG, PDF (tối đa 10MB mỗi file)
                    </p>
                    <Button
                      variant="outline"
                      className="h-12 mt-4 border-2 border-[#212121]/20"
                    >
                      Chọn File
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[#212121]">
                    File đã chọn
                  </Label>
                  <div className="p-4 bg-[#F5F5F5] rounded-lg text-center text-sm text-[#212121]">
                    Chưa có file nào được chọn
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leader Notes */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <FileText className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Ghi chú của Tổ trưởng
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="leader-note" className="text-[#212121]">
                    Nhận xét ban đầu
                  </Label>
                  <Textarea
                    id="leader-note"
                    placeholder="VD: Đã kiểm tra hiện trường, vấn đề đúng như phản ánh. Cần báo cáo lên cấp trên để xử lý..."
                    className="min-h-[150px] border-2 border-[#212121]/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="suggested-action" className="text-[#212121]">
                    Đề xuất hướng xử lý
                  </Label>
                  <Textarea
                    id="suggested-action"
                    placeholder="VD: Đề xuất báo cáo lên Phòng Quản lý đô thị để sửa chữa đèn đường..."
                    className="min-h-[100px] border-2 border-[#212121]/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="initial-status" className="text-[#212121]">
                    Trạng thái ban đầu <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Select defaultValue="new">
                    <SelectTrigger id="initial-status" className="h-12 border-2 border-[#212121]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Mới - Chờ xử lý</SelectItem>
                      <SelectItem value="processing">Đang xử lý - Đã báo cáo lên cấp trên</SelectItem>
                      <SelectItem value="need-info">Cần bổ sung thông tin</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Button className="w-full h-14 bg-[#1B5E20] hover:bg-[#1B5E20]/90">
                  <Save className="w-5 h-5 mr-2" />
                  Lưu Kiến nghị
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/leader/feedback')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                >
                  Hủy
                </Button>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin Nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Ngày ghi nhận
                  </p>
                  <p className="text-[#212121]">
                    <strong>03/11/2025</strong>
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Tổ trưởng ghi nhận
                  </p>
                  <p className="text-[#212121]">
                    <strong>Nguyễn Văn Tổ</strong>
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Khu vực quản lý
                  </p>
                  <p className="text-[#212121]">
                    Tổ 5, Phường Đống Đa
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-[#0D47A1]" />
                  <CardTitle className="text-[#212121]">
                    Hướng dẫn
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Ưu tiên chọn người phản ánh từ danh sách nhân khẩu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Ghi chép đầy đủ và chính xác thông tin từ người dân</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Chụp ảnh hiện trường nếu có thể</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Đánh giá mức độ ưu tiên phù hợp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Thêm nhận xét và đề xuất của bạn</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Trường có dấu <span className="text-[#B71C1C]">*</span> là bắt buộc</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Priority Levels */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hướng dẫn Mức độ Ưu tiên
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-[#212121]">
                  <li className="p-3 bg-[#B71C1C]/10 rounded-lg border border-[#B71C1C]/20">
                    <strong className="text-[#B71C1C]">Khẩn cấp:</strong>
                    <p className="text-sm mt-1">
                      Nguy hiểm, ảnh hưởng nghiêm trọng đến an toàn
                    </p>
                  </li>
                  <li className="p-3 bg-[#FBC02D]/10 rounded-lg border border-[#FBC02D]/30">
                    <strong className="text-[#212121]">Cao:</strong>
                    <p className="text-sm mt-1">
                      Ảnh hưởng nhiều người, cần giải quyết sớm
                    </p>
                  </li>
                  <li className="p-3 bg-[#0D47A1]/10 rounded-lg border border-[#0D47A1]/20">
                    <strong className="text-[#0D47A1]">Trung bình:</strong>
                    <p className="text-sm mt-1">
                      Vấn đề thông thường, giải quyết theo kế hoạch
                    </p>
                  </li>
                  <li className="p-3 bg-[#F5F5F5] rounded-lg">
                    <strong>Thấp:</strong>
                    <p className="text-sm mt-1">
                      Không gấp, có thể lên kế hoạch dài hạn
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* After Submission */}
            <Card className="border-2 border-[#1B5E20]/20 shadow-lg bg-[#1B5E20]/5">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Sau khi Lưu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#1B5E20] mt-1">1.</span>
                    <span>Thông báo cho người phản ánh đã tiếp nhận</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1B5E20] mt-1">2.</span>
                    <span>Chuyển tiếp lên Cán bộ Phường nếu cần</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1B5E20] mt-1">3.</span>
                    <span>Theo dõi tiến độ xử lý</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1B5E20] mt-1">4.</span>
                    <span>Cập nhật người dân về kết quả</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LeaderLayout>
  );
}
