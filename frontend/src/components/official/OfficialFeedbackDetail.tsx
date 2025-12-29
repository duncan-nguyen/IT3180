import { ArrowLeft, CheckCircle2, Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Feedback, feedbackService } from '../../services/feedback-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import OfficialLayout from './OfficialLayout';

interface OfficialFeedbackDetailProps {
  onLogout: () => void;
}

export default function OfficialFeedbackDetail({ onLogout }: OfficialFeedbackDetailProps) {
  const { id } = useParams();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Response form
  const [responseContent, setResponseContent] = useState('');
  const [agency, setAgency] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    } catch (err: any) {
      console.error('Error fetching feedback detail:', err);
      setError('Không thể tải chi tiết kiến nghị.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !agency || !responseContent) return;

    try {
      setSubmitting(true);
      const payload = {
        noi_dung: responseContent,
        co_quan: agency
      };
      console.log('[DEBUG] Submitting feedback response:', JSON.stringify(payload));
      console.log('[DEBUG] Feedback ID:', id);
      await feedbackService.respondToFeedback(id, payload);

      // Update local state or refetch
      setSubmitSuccess(true);
      // Also update status to 'dang_xu_ly' if needed, probably handled by backend or we call updateStatus
      if (feedback && feedback.status?.toUpperCase() !== 'DANG_XU_LY') {
        // Optional: explicit status update if not handled by response endpoint
        // But backend create_feedback_response logic doesn't seem to auto-update status in the snippet I saw?
        // I'll assume we might need to, but for now let's just create response.
        // Wait, actually I should update status to 'DANG_XU_LY'.
        // Let's call updateStatus just in case.
        await feedbackService.updateFeedbackStatus(id, 'DANG_XU_LY');
      }

      await fetchFeedbackDetail(id); // Reload to see the new response
      setResponseContent('');
      setAgency('');
    } catch (err: any) {
      console.error('Error submitting response:', err);
      alert('Gửi phản hồi thất bại: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <OfficialLayout onLogout={onLogout}>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
        </div>
      </OfficialLayout>
    );
  }

  if (!feedback) {
    return (
      <OfficialLayout onLogout={onLogout}>
        <div className="p-6">
          <div className="text-red-500">
            {error || 'Không tìm thấy kiến nghị.'}
          </div>
          <Link to="/official">
            <Button className="mt-4">Quay lại</Button>
          </Link>
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
                    <strong>Nội dung:</strong> {feedback.content}
                  </p>
                </div>
                <div className="p-6 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121] mb-2">
                    <strong>Phân loại:</strong> {feedback.category}
                  </p>
                </div>
                <div className="p-6 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121] mb-2">
                    <strong>Trạng thái:</strong> {feedback.status}
                  </p>
                </div>
                <div className="p-6 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121] mb-2">
                    <strong>Ngày gửi:</strong> {new Date(feedback.created_at).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div className="p-6 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121] mb-2">
                    <strong>Số báo cáo gộp:</strong> {feedback.report_count}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Existing Responses */}
            {feedback.feedback_responses && feedback.feedback_responses.length > 0 && (
              <Card className="border-2 border-[#212121]/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#212121]">
                    Các phản hồi đã gửi
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

            {/* Merged Reports (Placeholder/Not available in API yet) */}
            {/* 
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Các báo cáo đã gộp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-gray-500">Chức năng xem chi tiết các báo cáo con chưa khả dụng.</p>
              </CardContent>
            </Card> 
            */}
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
                {submitSuccess && (
                  <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Đã gửi phản hồi thành công!
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Agency Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="agency" className="text-[#212121]">
                      Cơ quan phản hồi
                    </Label>
                    <Select value={agency} onValueChange={setAgency} required disabled={submitting}>
                      <SelectTrigger
                        id="agency"
                        className="h-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                      >
                        <SelectValue placeholder="Chọn cơ quan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Công an Phường">Công an Phường</SelectItem>
                        <SelectItem value="Điện lực">Điện lực</SelectItem>
                        <SelectItem value="Môi trường & Đô thị">Môi trường & Đô thị</SelectItem>
                        <SelectItem value="Giao thông Vận tải">Giao thông Vận tải</SelectItem>
                        <SelectItem value="Khác">Cơ quan khác</SelectItem>
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
                      value={responseContent}
                      onChange={(e) => setResponseContent(e.target.value)}
                      required
                      disabled={submitting}
                      placeholder="Nhập nội dung phản hồi từ cơ quan chức năng..."
                      className="min-h-[250px] border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Save className="w-6 h-6 mr-3" />
                        Lưu Phản hồi
                      </>
                    )}
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
