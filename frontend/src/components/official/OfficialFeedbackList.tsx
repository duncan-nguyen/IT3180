import { Eye, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Feedback, feedbackService } from '../../services/feedback-service';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import OfficialLayout from './OfficialLayout';

interface OfficialFeedbackListProps {
  userName: string;
  onLogout: () => void;
}

export default function OfficialFeedbackList({ userName, onLogout }: OfficialFeedbackListProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await feedbackService.getAllFeedbacks();
      // API returns { stt_feedback: string, data: Feedback }[]
      // @ts-ignore
      const extractedFeedbacks = data.map((item: any) => item.data);
      setFeedbacks(extractedFeedbacks);
    } catch (err: any) {
      console.error('Error fetching feedbacks:', err);
      setError('Không thể tải danh sách kiến nghị.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    // Map status string to color
    // Values from enum: 'chua_xu_ly', 'dang_xu_ly', 'da_xu_ly', 'tu_choi', 'da_phan_hoi'
    if (status === 'da_phan_hoi' || status === 'da_xu_ly') return 'bg-[#1B5E20] text-white'; // Green
    if (status === 'dang_xu_ly') return 'bg-[#0D47A1] text-white'; // Blue
    if (status === 'moi_ghi_nhan' || status === 'chua_xu_ly') return 'bg-[#FBC02D] text-[#212121]'; // Yellow
    if (status === 'tu_choi') return 'bg-red-600 text-white';
    return 'bg-gray-200 text-black';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'moi_ghi_nhan': 'Mới ghi nhận',
      'chua_xu_ly': 'Chờ phản hồi', // Mapping to UI term
      'dang_xu_ly': 'Đang xử lý',
      'da_xu_ly': 'Đã xử lý',
      'da_phan_hoi': 'Đã phản hồi',
      'tu_choi': 'Từ chối'
    };
    return labels[status] || status;
  };

  return (
    <OfficialLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-3">
            Danh sách Kiến nghị
          </h1>
          <p className="text-[#212121]">
            Chào mừng {userName}
          </p>
        </div>

        {/* Data Table */}
        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Kiến nghị từ Người dân và Tổ trưởng
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 bg-red-50 rounded-lg">
                {error}
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                Chưa có kiến nghị nào.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-[#212121]/10">
                    <TableHead className="text-[#212121] h-14 w-[100px]">STT</TableHead>
                    <TableHead className="text-[#212121] h-14">Nội dung (Tóm tắt)</TableHead>
                    <TableHead className="text-[#212121] h-14">Phân loại</TableHead>
                    <TableHead className="text-[#212121] h-14">Trạng thái</TableHead>
                    <TableHead className="text-[#212121] h-14">Ngày gửi</TableHead>
                    <TableHead className="text-[#212121] h-14">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback, index) => (
                    <TableRow key={feedback.id} className="border-b border-[#212121]/10">
                      <TableCell className="text-[#212121] h-16">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-[#212121] h-16 max-w-md truncate">
                        {/* Use content as title, truncate if long */}
                        <div className="truncate max-w-[300px]" title={feedback.content}>
                          {feedback.content}
                        </div>
                      </TableCell>
                      <TableCell className="text-[#212121] h-16">
                        {feedback.category}
                      </TableCell>
                      <TableCell className="h-16">
                        <Badge className={`px-3 py-1 font-normal ${getStatusColor(feedback.status)} hover:${getStatusColor(feedback.status)}`}>
                          {getStatusLabel(feedback.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#212121] h-16">
                        {new Date(feedback.created_at).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="h-16">
                        <Link to={`/official/feedback/${feedback.id}`}>
                          <Button
                            size="sm"
                            className="h-9 px-4 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Chi tiết
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </OfficialLayout>
  );
}
