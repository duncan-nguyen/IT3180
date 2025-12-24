import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeedbackList, type Category, type Status } from '../api_caller/port8019';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import OfficialLayout from './OfficialLayout';

interface OfficialFeedbackListProps {
  userName: string;
  onLogout: () => void;
}

interface Feedback {
  id: string;
  noi_dung: string;
  phan_loai: Category;
  trang_thai: Status;
  created_at?: string;
  nguoi_phan_anh?: {
    ho_ten?: string;
  };
  [key: string]: any;
}

export default function OfficialFeedbackList({ userName, onLogout }: OfficialFeedbackListProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('access_token') || '';

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getFeedbackList(token);
      
      if (Array.isArray(data)) {
        setFeedbacks(data);
      } else if (data.items && Array.isArray(data.items)) {
        setFeedbacks(data.items);
      } else {
        setFeedbacks([]);
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Không thể tải danh sách kiến nghị. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplayName = (status: Status) => {
    const statusMap: Record<Status, string> = {
      'MOI_GHI_NHAN': 'Chờ phản hồi',
      'DANG_XU_LY': 'Đang xử lý',
      'DA_GIAI_QUYET': 'Đã phản hồi',
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

  const getStatusColor = (status: Status) => {
    if (status === 'DA_GIAI_QUYET') return 'bg-[#1B5E20] text-white';
    if (status === 'DANG_XU_LY') return 'bg-[#0D47A1] text-white';
    if (status === 'DONG') return 'bg-[#212121] text-white';
    return 'bg-[#FBC02D] text-[#212121]';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '--';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Data Table */}
        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Kiến nghị đã gửi lên
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-16 flex-1" />
                    <Skeleton className="h-16 w-32" />
                    <Skeleton className="h-16 w-32" />
                    <Skeleton className="h-16 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-[#212121]/10">
                    <TableHead className="text-[#212121] h-14">Nội dung</TableHead>
                    <TableHead className="text-[#212121] h-14">Phân loại</TableHead>
                    <TableHead className="text-[#212121] h-14">Người gửi</TableHead>
                    <TableHead className="text-[#212121] h-14">Trạng thái</TableHead>
                    <TableHead className="text-[#212121] h-14">Ngày gửi</TableHead>
                    <TableHead className="text-[#212121] h-14">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-[#212121]/50">
                        Không có kiến nghị nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    feedbacks.map((feedback) => (
                      <TableRow key={feedback.id} className="border-b border-[#212121]/10">
                        <TableCell className="text-[#212121] h-16 max-w-md">
                          <strong>{truncateText(feedback.noi_dung)}</strong>
                        </TableCell>
                        <TableCell className="text-[#212121] h-16">
                          {getCategoryDisplayName(feedback.phan_loai)}
                        </TableCell>
                        <TableCell className="text-[#212121] h-16">
                          {feedback.nguoi_phan_anh?.ho_ten || <em className="text-[#212121]/50">Ẩn danh</em>}
                        </TableCell>
                        <TableCell className="h-16">
                          <span className={`px-4 py-2 rounded ${getStatusColor(feedback.trang_thai)}`}>
                            {getStatusDisplayName(feedback.trang_thai)}
                          </span>
                        </TableCell>
                        <TableCell className="text-[#212121] h-16">
                          {formatDate(feedback.created_at)}
                        </TableCell>
                        <TableCell className="h-16">
                          <Link to={`/official/feedback/${feedback.id}`}>
                            <Button
                              size="sm"
                              className="h-12 px-4 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white"
                            >
                              <Eye className="w-5 h-5 mr-2" />
                              Xem chi tiết
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </OfficialLayout>
  );
}