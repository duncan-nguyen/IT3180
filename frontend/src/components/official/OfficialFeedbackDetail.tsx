import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  createFeedbackResponse,
  getFeedbackById,
  updateFeedback,
  type Category,
  type Status
} from '../../api_caller/port8019';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Textarea } from '../ui/textarea';
import OfficialLayout from './OfficialLayout';

interface OfficialFeedbackDetailProps {
  onLogout: () => void;
}

interface FeedbackDetail {
  id: string;
  noi_dung: string;
  phan_loai: Category;
  trang_thai: Status;
  created_at?: string;
  updated_at?: string;
  nguoi_phan_anh?: {
    ho_ten?: string;
    nhankhau_id?: string;
  };
  responses?: Array<{
    noi_dung: string;
    co_quan: string;
    created_at: string;
  }>;
  [key: string]: any;
}

export default function OfficialFeedbackDetail({ onLogout }: OfficialFeedbackDetailProps) {
  const { id } = useParams<{ id: string }>();
  const [feedback, setFeedback] = useState<FeedbackDetail | null>(null);
  const [responseContent, setResponseContent] = useState('');
  const [agency, setAgency] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [newStatus, setNewStatus] = useState<Status | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const token = localStorage.getItem('access_token') || '';

  useEffect(() => {
    if (id) {
      fetchFeedbackDetail();
    }
  }, [id]);

  const fetchFeedbackDetail = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getFeedbackById(token, id);
      setFeedback(data);
      setNewStatus(data.trang_thai);
    } catch (err) {
      console.error('Error fetching feedback detail:', err);
      setError('Không thể tải chi tiết kiến nghị. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!id || !newStatus) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await updateFeedback(token, id, { trang_thai: newStatus as Status });
      setSuccessMessage('Cập nhật trạng thái thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchFeedbackDetail();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !responseContent || !agency) {
      setError('Vui lòng điền đầy đủ thông tin phản hồi');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      await createFeedbackResponse(token, id, {
        noi_dung: responseContent,
        co_quan: agency,
        tep_dinh_kem_url: attachmentUrl || '',
      });

      setSuccessMessage('Phản hồi đã được gửi thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Clear form
      setResponseContent('');
      setAgency('');
      setAttachmentUrl('');
      
      // Refresh feedback data
      await fetchFeedbackDetail();
    } catch (err) {
      console.error('Error submitting response:', err);
      setError('Không thể gửi phản hồi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusDisplayName = (status: Status) => {
    const statusMap: Record<Status, string> = {
      'MOI_GHI_NHAN': 'Mới ghi nhận',
      'DANG_XU_LY': 'Đang xử lý',
      'DA_GIAI_QUYET': 'Đã giải quyết',
      'DONG': 'Đã đóng',
    };
    return statusMap[status] || status;
  };

  const getCategoryDisplayName = (category: Category) => {
    const categoryMap: Record<Category, string> = {
      'HA_TANG': 'Hạ tầng',
      'AN_NINH': 'An ninh',
      'MOI_TRUONG': 'Môi trường',
      'KHAC': 'Khác',
    };
    return categoryMap[category] || category;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '--';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: Status) => {
    if (status === 'DA_GIAI_QUYET') return 'bg-[#1B5E20] text-white';
    if (status === 'DANG_XU_LY') return 'bg-[#0D47A1] text-white';
    if (status === 'DONG') return 'bg-[#212121] text-white';
    return 'bg-[#FBC02D] text-[#212121]';
  };

  if (isLoading) {
    return (
      <OfficialLayout onLogout={onLogout}>
        <div className="p-6 space-y-6">
          <Skeleton className="h-14 w-64" />
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
      </OfficialLayout>
    );
  }

  if (!feedback) {
    return (
      <OfficialLayout onLogout={onLogout}>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Không tìm thấy kiến nghị</AlertDescription>
          </Alert>
        </div>
      </OfficialLayout>
    );
  }

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

        {/* Success Alert */}
        {successMessage && (
          <Alert className="mb-6 bg-[#1B5E20]/10 border-[#1B5E20]">
            <AlertDescription className="text-[#1B5E20]">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-[#212121] mb-2 block">
                    Phân loại
                  </Label>
                  <p className="text-[#212121]">
                    {getCategoryDisplayName(feedback.phan_loai)}
                  </p>
                </div>

                <div>
                  <Label className="text-[#212121] mb-2 block">
                    Người gửi
                  </Label>
                  <p className="text-[#212121]">
                    {feedback.nguoi_phan_anh?.ho_ten || 'Ẩn danh'}
                  </p>
                </div>

                <div>
                  <Label className="text-[#212121] mb-2 block">
                    Ngày gửi
                  </Label>
                  <p className="text-[#212121]">
                    {formatDate(feedback.created_at)}
                  </p>
                </div>

                <div>
                  <Label className="text-[#212121] mb-2 block">
                    Trạng thái hiện tại
                  </Label>
                  <span className={`px-4 py-2 rounded inline-block ${getStatusColor(feedback.trang_thai)}`}>
                    {getStatusDisplayName(feedback.trang_thai)}
                  </span>
                </div>

                <div>
                  <Label className="text-[#212121] mb-2 block">
                    Nội dung
                  </Label>
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-[#212121] whitespace-pre-wrap">
                      {feedback.noi_dung}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Previous Responses */}
            {feedback.responses && feedback.responses.length > 0 && (
              <Card className="border-2 border-[#212121]/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#212121]">
                    Lịch sử phản hồi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {feedback.responses.map((response, index) => (
                    <div key={index} className="p-4 bg-[#F5F5F5] rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-[#212121]">{response.co_quan}</span>
                        <span className="text-[#212121]/60">{formatDate(response.created_at)}</span>
                      </div>
                      <p className="text-[#212121] whitespace-pre-wrap">{response.noi_dung}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-6">
            {/* Update Status */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Cập nhật Trạng thái
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-[#212121]">
                    Trạng thái mới
                  </Label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Status)}>
                    <SelectTrigger
                      id="status"
                      className="h-14 border-2 border-[#212121]/20"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOI_GHI_NHAN">Mới ghi nhận</SelectItem>
                      <SelectItem value="DANG_XU_LY">Đang xử lý</SelectItem>
                      <SelectItem value="DA_GIAI_QUYET">Đã giải quyết</SelectItem>
                      <SelectItem value="DONG">Đóng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleStatusUpdate}
                  disabled={isSubmitting || newStatus === feedback.trang_thai}
                  className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white disabled:opacity-50"
                >
                  <Save className="w-6 h-6 mr-3" />
                  Cập nhật Trạng thái
                </Button>
              </CardContent>
            </Card>

            {/* Add Response */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Gửi Phản hồi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResponseSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="agency" className="text-[#212121]">
                      Cơ quan phản hồi
                    </Label>
                    <Input
                      id="agency"
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="h-14 border-2 border-[#212121]/20"
                      placeholder="VD: Phòng Quản lý đô thị"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="response" className="text-[#212121]">
                      Nội dung phản hồi
                    </Label>
                    <Textarea
                      id="response"
                      value={responseContent}
                      onChange={(e) => setResponseContent(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="min-h-[150px] border-2 border-[#212121]/20"
                      placeholder="Nhập nội dung phản hồi..."
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="attachment" className="text-[#212121]">
                      URL tệp đính kèm (tùy chọn)
                    </Label>
                    <Input
                      id="attachment"
                      type="url"
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      disabled={isSubmitting}
                      className="h-14 border-2 border-[#212121]/20"
                      placeholder="https://..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#1B5E20] hover:bg-[#1B5E20]/90 text-white disabled:opacity-50"
                  >
                    <Save className="w-6 h-6 mr-3" />
                    {isSubmitting ? 'Đang gửi...' : 'Gửi Phản hồi'}
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