import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import OfficialLayout from './OfficialLayout';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface OfficialFeedbackDetailProps {
  onLogout: () => void;
}

export default function OfficialFeedbackDetail({ onLogout }: OfficialFeedbackDetailProps) {
  const { id } = useParams();
  const [response, setResponse] = useState('');
  const [agency, setAgency] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Phản hồi đã được lưu thành công!');
  };

  // Mock data
  const feedbackDetail = {
    id: id,
    title: 'Vấn đề chiếu sáng công cộng khu vực Tổ 5',
    category: 'Hạ tầng',
    submittedBy: 'Tổ trưởng Tổ 5 - Trần Thị Bình',
    date: '02/11/2025',
    status: 'Chờ phản hồi',
    mergedReports: [
      {
        id: 1,
        reporter: 'Nguyễn Văn An',
        content: 'Đèn đường khu vực ngõ 25 bị hỏng, tối tăm vào ban đêm',
        date: '01/11/2025',
      },
      {
        id: 2,
        reporter: 'Trần Thị Bình',
        content: 'Đèn công cộng khu vực ngã tư chợ không sáng',
        date: '01/11/2025',
      },
    ],
    history: [
      {
        date: '02/11/2025 09:30',
        action: 'Tổ trưởng gộp 2 kiến nghị và gửi lên Cán bộ Phường',
        by: 'Trần Thị Bình',
      },
    ],
  };

  return (
    <OfficialLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-6">
          <Link to="/official">
            <Button
              variant="outline"
              className="h-14 px-6 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
            >
              <ArrowLeft className="w-6 h-6 mr-3" />
              Quay lại
            </Button>
          </Link>
          <h1 className="text-[#212121]">
            Chi tiết Kiến nghị
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Feedback Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121] mb-2">
                    <strong>Tiêu đề:</strong> {feedbackDetail.title}
                  </p>
                </div>
                <div className="p-6 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121] mb-2">
                    <strong>Phân loại:</strong> {feedbackDetail.category}
                  </p>
                </div>
                <div className="p-6 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121] mb-2">
                    <strong>Người gửi:</strong> {feedbackDetail.submittedBy}
                  </p>
                </div>
                <div className="p-6 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121] mb-2">
                    <strong>Ngày gửi:</strong> {feedbackDetail.date}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Merged Reports */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Các báo cáo đã gộp ({feedbackDetail.mergedReports.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedbackDetail.mergedReports.map((report) => (
                  <div key={report.id} className="p-6 bg-[#F5F5F5] rounded-lg space-y-3">
                    <p className="text-[#212121]">
                      <strong>Người phản ánh:</strong> {report.reporter}
                    </p>
                    <p className="text-[#212121]">
                      <strong>Nội dung:</strong> {report.content}
                    </p>
                    <p className="text-[#212121]">
                      <strong>Ngày gửi:</strong> {report.date}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* History */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Lịch sử xử lý
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedbackDetail.history.map((item, index) => (
                  <div key={index} className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                    <p className="text-[#212121]">
                      <strong>{item.date}</strong>
                    </p>
                    <p className="text-[#212121]">{item.action}</p>
                    <p className="text-[#212121]">
                      <em>Bởi: {item.by}</em>
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Response Form */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-[#212121]/10 shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Phản hồi của Cơ quan chức năng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Agency Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="agency" className="text-[#212121]">
                      Cơ quan phản hồi
                    </Label>
                    <Select value={agency} onValueChange={setAgency} required>
                      <SelectTrigger
                        id="agency"
                        className="h-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                      >
                        <SelectValue placeholder="Chọn cơ quan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="police">Công an Phường</SelectItem>
                        <SelectItem value="electric">Điện lực</SelectItem>
                        <SelectItem value="environment">Môi trường & Đô thị</SelectItem>
                        <SelectItem value="transport">Giao thông Vận tải</SelectItem>
                        <SelectItem value="other">Cơ quan khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Response Content */}
                  <div className="space-y-3">
                    <Label htmlFor="response" className="text-[#212121]">
                      Nội dung phản hồi
                    </Label>
                    <Textarea
                      id="response"
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      required
                      placeholder="Nhập nội dung phản hồi từ cơ quan chức năng..."
                      className="min-h-[250px] border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white"
                  >
                    <Save className="w-6 h-6 mr-3" />
                    Lưu Phản hồi
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </OfficialLayout>
  );
}
