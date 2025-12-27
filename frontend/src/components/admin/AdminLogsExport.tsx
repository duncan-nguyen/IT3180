import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Download, FileText, AlertCircle, Calendar, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminLogsExportProps {
  onLogout: () => void;
}

export default function AdminLogsExport({ onLogout }: AdminLogsExportProps) {
  const navigate = useNavigate();

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/logs')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3">
            Xuất File Nhật ký
          </h1>
          <p className="text-[#212121]">
            Tải xuống nhật ký hoạt động hệ thống theo các tiêu chí lọc
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Export Format */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <FileText className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Định dạng File
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="format" className="text-[#212121]">
                    Chọn định dạng xuất <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Select defaultValue="excel">
                    <SelectTrigger id="format" className="h-12 border-2 border-[#212121]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel (.xlsx) - Khuyến nghị</SelectItem>
                      <SelectItem value="csv">CSV (.csv) - Văn bản phân cách</SelectItem>
                      <SelectItem value="pdf">PDF (.pdf) - Chỉ đọc</SelectItem>
                      <SelectItem value="json">JSON (.json) - Dữ liệu thô</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-[#212121]">
                    Định dạng Excel được khuyến nghị cho dễ đọc và phân tích
                  </p>
                </div>

                <div className="p-4 bg-[#0D47A1]/5 border-2 border-[#0D47A1]/20 rounded-lg">
                  <div className="flex gap-3">
                    <FileText className="w-6 h-6 text-[#0D47A1] flex-shrink-0 mt-1" />
                    <div className="space-y-2">
                      <p className="text-[#212121]">
                        <strong>Nội dung File bao gồm:</strong>
                      </p>
                      <ul className="space-y-2 text-[#212121]">
                        <li className="flex items-start gap-2">
                          <span className="text-[#0D47A1] mt-1">•</span>
                          <span>Thời gian thực hiện hành động</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#0D47A1] mt-1">•</span>
                          <span>Thông tin người dùng (email, vai trò)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#0D47A1] mt-1">•</span>
                          <span>Loại hành động và chi tiết</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#0D47A1] mt-1">•</span>
                          <span>Trạng thái thực hiện (thành công/lỗi)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#0D47A1] mt-1">•</span>
                          <span>IP Address và thông tin kỹ thuật</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date Range */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                    <Calendar className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Khoảng Thời gian
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="date-range" className="text-[#212121]">
                    Chọn khoảng thời gian
                  </Label>
                  <Select defaultValue="today">
                    <SelectTrigger id="date-range" className="h-12 border-2 border-[#212121]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hôm nay</SelectItem>
                      <SelectItem value="yesterday">Hôm qua</SelectItem>
                      <SelectItem value="7days">7 ngày qua</SelectItem>
                      <SelectItem value="30days">30 ngày qua</SelectItem>
                      <SelectItem value="thismonth">Tháng này</SelectItem>
                      <SelectItem value="lastmonth">Tháng trước</SelectItem>
                      <SelectItem value="custom">Tùy chỉnh...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="from-date" className="text-[#212121]">
                      Từ ngày
                    </Label>
                    <input
                      id="from-date"
                      type="date"
                      defaultValue="2025-11-03"
                      className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="to-date" className="text-[#212121]">
                      Đến ngày
                    </Label>
                    <input
                      id="to-date"
                      type="date"
                      defaultValue="2025-11-03"
                      className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <Filter className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Bộ lọc Nâng cao
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="filter-type" className="text-[#212121]">
                      Loại hoạt động
                    </Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="filter-type" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="account">Tài khoản</SelectItem>
                        <SelectItem value="feedback">Kiến nghị</SelectItem>
                        <SelectItem value="household">Hộ khẩu</SelectItem>
                        <SelectItem value="security">Bảo mật</SelectItem>
                        <SelectItem value="database">Cơ sở dữ liệu</SelectItem>
                        <SelectItem value="settings">Cấu hình</SelectItem>
                        <SelectItem value="permission">Phân quyền</SelectItem>
                        <SelectItem value="report">Báo cáo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="filter-role" className="text-[#212121]">
                      Vai trò người dùng
                    </Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="filter-role" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                        <SelectItem value="official">Cán bộ Phường/Xã</SelectItem>
                        <SelectItem value="leader">Tổ trưởng</SelectItem>
                        <SelectItem value="citizen">Người dân</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="filter-status" className="text-[#212121]">
                      Trạng thái
                    </Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="filter-status" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="success">Thành công</SelectItem>
                        <SelectItem value="error">Lỗi</SelectItem>
                        <SelectItem value="warning">Cảnh báo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="filter-limit" className="text-[#212121]">
                      Giới hạn số lượng
                    </Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="filter-limit" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="100">100 nhật ký mới nhất</SelectItem>
                        <SelectItem value="500">500 nhật ký mới nhất</SelectItem>
                        <SelectItem value="1000">1,000 nhật ký mới nhất</SelectItem>
                        <SelectItem value="5000">5,000 nhật ký mới nhất</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="include-system"
                      className="w-5 h-5 mt-1"
                      defaultChecked
                    />
                    <div>
                      <label htmlFor="include-system" className="text-[#212121] cursor-pointer">
                        <strong>Bao gồm nhật ký hệ thống</strong>
                      </label>
                      <p className="text-sm text-[#212121] mt-1">
                        Bao gồm các hoạt động tự động của hệ thống (sao lưu, bảo trì...)
                      </p>
                    </div>
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
                <Button className="w-full h-14 bg-[#1B5E20] hover:bg-[#1B5E20]/90">
                  <Download className="w-5 h-5 mr-2" />
                  Tải xuống File
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/logs')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                >
                  Hủy
                </Button>
              </CardContent>
            </Card>

            {/* Preview Stats */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Xem trước
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Số lượng nhật ký
                  </p>
                  <p className="text-2xl text-[#212121]">
                    247 bản ghi
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Kích thước ước tính
                  </p>
                  <p className="text-2xl text-[#212121]">
                    ~156 KB
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Khoảng thời gian
                  </p>
                  <p className="text-[#212121]">
                    03/11/2025
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    Định dạng
                  </p>
                  <p className="text-[#212121]">
                    Excel (.xlsx)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Information */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-[#0D47A1]" />
                  <CardTitle className="text-[#212121]">
                    Lưu ý
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>File xuất sẽ chứa thông tin nhạy cảm, hãy bảo mật cẩn thận</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Thời gian xuất file phụ thuộc vào số lượng nhật ký</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>File có thể được mở bằng Excel, Google Sheets hoặc các ứng dụng tương tự</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Hành động xuất file sẽ được ghi vào nhật ký</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Khuyến nghị xuất nhật ký định kỳ để lưu trữ và kiểm toán</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
