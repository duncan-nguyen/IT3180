import { ArrowLeft, CheckCircle2, Loader2, MessageSquare, Save, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Feedback, feedbackService } from '../../services/feedback-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import LeaderLayout from './LeaderLayout';

interface LeaderFeedbackDetailProps {
  onLogout: () => void;
}

// Map backend status to display
const STATUS_DISPLAY: Record<string, string> = {
  'MOI_GHI_NHAN': 'Mới ghi nhận',
  'DANG_XU_LY': 'Đang xử lý',
  'DA_GIAI_QUYET': 'Đã giải quyết',
  'DONG': 'Đã đóng',
};

// Map backend category to display
const CATEGORY_DISPLAY: Record<string, string> = {
  'HA_TANG': 'Hạ tầng',
  'AN_NINH': 'An ninh',
  'MOI_TRUONG': 'Môi trường',
  'KHAC': 'Khác',
};

export default function LeaderFeedbackDetail({ onLogout }: LeaderFeedbackDetailProps) {
  const { id } = useParams();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status update
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFeedbackDetail(id);
    }
  }, [id]);

  const fetchFeedbackDetail = async (feedbackId: string) => {
    try {
      setLoading(true);
      const data = await feedbackService.getFeedbackById(feedbackId);
      setFeedback(data);
      setNewStatus(data.status);
    } catch (err: any) {
      console.error('Error fetching feedback detail:', err);
      setError('Không thể tải chi tiết kiến nghị.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!id || !newStatus) return;

    try {
      setUpdatingStatus(true);
      await feedbackService.updateFeedbackStatus(id, newStatus);
      setStatusUpdateSuccess(true);
      await fetchFeedbackDetail(id);
      setTimeout(() => setStatusUpdateSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert('Cập nhật trạng thái thất bại: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toUpperCase();
    if (s === 'DA_GIAI_QUYET') return 'bg-green-100 text-green-700';
    if (s === 'DANG_XU_LY') return 'bg-blue-100 text-blue-700';
    if (s === 'DONG') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  if (loading) {
    return (
      <LeaderLayout onLogout={onLogout}>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
        </div>
      </LeaderLayout>
    );
  }

  if (!feedback) {
    return (
      <LeaderLayout onLogout={onLogout}>
        <div className="p-6">
          <div className="text-red-500">
            {error || 'Không tìm thấy kiến nghị.'}
          </div>
          <Link to="/leader/feedback">
            <Button className="mt-4">Quay lại</Button>
          </Link>
        </div>
      </LeaderLayout>
    );
  }

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-6">
          <Link to="/leader/feedback">
            <Button
              variant="outline"
              className="h-14 px-6 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
            >
              <ArrowLeft className="w-6 h-6 mr-3" />
              Quay lại
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#212121] flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-[#0D47A1]" />
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
                  <p className="text-sm text-gray-600 mb-2">Nội dung kiến nghị</p>
                  <p className="text-[#212121]">{feedback.content}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Phân loại</p>
                    <p className="text-[#212121] font-medium">
                      {CATEGORY_DISPLAY[feedback.category] || feedback.category}
                    </p>
                  </div>
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(feedback.status)}`}>
                      {STATUS_DISPLAY[feedback.status] || feedback.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Ngày gửi</p>
                    <p className="text-[#212121]">
                      {new Date(feedback.created_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Số báo cáo gộp</p>
                    <p className="text-[#212121] font-medium flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {feedback.report_count} báo cáo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing Responses */}
            {feedback.feedback_responses && feedback.feedback_responses.length > 0 && (
              <Card className="border-2 border-[#212121]/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#212121]">
                    Các phản hồi từ cơ quan chức năng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {feedback.feedback_responses.map((resp) => (
                    <div key={resp.id} className="p-6 bg-blue-50 border border-blue-100 rounded-lg space-y-2">
                      <p className="text-[#0D47A1] font-semibold">
                        {resp.agency}
                      </p>
                      <p className="text-[#212121]">
                        {resp.content}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {new Date(resp.responded_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Status Update */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-[#212121]/10 shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Cập nhật trạng thái
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statusUpdateSuccess && (
                  <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Cập nhật trạng thái thành công!
                  </div>
                )}

                <div className="space-y-6">
                  {/* Status Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="status" className="text-[#212121]">
                      Chọn trạng thái mới
                    </Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger
                        id="status"
                        className="h-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                      >
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MOI_GHI_NHAN">Mới ghi nhận</SelectItem>
                        <SelectItem value="DANG_XU_LY">Đang xử lý</SelectItem>
                        <SelectItem value="DA_GIAI_QUYET">Đã giải quyết</SelectItem>
                        <SelectItem value="DONG">Đã đóng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={updatingStatus || newStatus === feedback.status}
                    className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white"
                  >
                    {updatingStatus ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <Save className="w-6 h-6 mr-3" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </div>

                {/* Summary Info */}
                <div className="mt-6 pt-6 border-t border-[#212121]/10 space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-blue-600 mb-1">Tổng phản hồi</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {feedback.feedback_responses?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LeaderLayout>
  );
}
