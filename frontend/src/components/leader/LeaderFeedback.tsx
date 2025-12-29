import { Combine, Eye, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { feedbackService } from '../../services/feedback-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import LeaderLayout from './LeaderLayout';

interface LeaderFeedbackProps {
  onLogout: () => void;
}

interface FeedbackItem {
  id: string;
  content: string;
  category: string;
  status: string;
  created_at: string;
  nguoi_phan_anh?: {
    full_name?: string;
  };
}

// Map backend status to display
const STATUS_DISPLAY: Record<string, string> = {
  'MOI_GHI_NHAN': 'Mới',
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

export default function LeaderFeedback({ onLogout }: LeaderFeedbackProps) {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [merging, setMerging] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        if (categoryFilter !== 'all') params.category = categoryFilter;

        const response = await feedbackService.getAllFeedbacks(params);
        // API returns [{ stt_feedback: string, data: FeedbackItem }]
        const fbList = response.map((item: any) => item.data);
        setFeedbacks(fbList);
        setError(null);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setError('Không thể tải danh sách kiến nghị');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [statusFilter, categoryFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(feedbacks.map((f) => f.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleMerge = async () => {
    if (selectedIds.length < 2) return;
    
    // Dùng phần tử đầu tiên làm parent, các phần tử còn lại là sub
    const [parentId, ...subIds] = selectedIds;
    
    try {
      setMerging(true);
      await feedbackService.mergeFeedbacks({
        parent_id: parentId,
        sub_id: subIds
      });
      alert(`Đã gộp ${selectedIds.length} kiến nghị thành công!`);
      setSelectedIds([]);
      // Reload danh sách
      const params: Record<string, string> = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      const response = await feedbackService.getAllFeedbacks(params);
      const fbList = response.map((item: any) => item.data);
      setFeedbacks(fbList);
    } catch (err: any) {
      console.error('Error merging feedbacks:', err);
      alert('Gộp kiến nghị thất bại: ' + (err.response?.data?.detail || err.message));
    } finally {
      setMerging(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toUpperCase();
    if (s === 'DA_GIAI_QUYET') return 'bg-[#1B5E20] text-white';
    if (s === 'DANG_XU_LY') return 'bg-[#0D47A1] text-white';
    if (s === 'DONG') return 'bg-[#B71C1C] text-white';
    return 'bg-[#FBC02D] text-[#212121]';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-6">
            Quản lý Phản ánh, Kiến nghị
          </h1>

          {/* Toolbar */}
          <Card className="border-2 border-[#212121]/10">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* First Row: Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    className="h-14 px-6 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white"
                    onClick={() => navigate('/leader/feedback/create')}
                  >
                    <Plus className="w-6 h-6 mr-3" />
                    Ghi nhận Kiến nghị Mới
                  </Button>

                  <Button
                    onClick={handleMerge}
                    disabled={selectedIds.length < 2 || merging}
                    className="h-14 px-6 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {merging ? (
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    ) : (
                      <Combine className="w-6 h-6 mr-3" />
                    )}
                    {merging ? 'Đang gộp...' : `Gộp các mục đã chọn (${selectedIds.length})`}
                  </Button>
                </div>

                {/* Second Row: Filters */}
                <div className="flex flex-wrap gap-4">
                  <div className="min-w-[250px]">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]">
                        <SelectValue placeholder="Lọc theo Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="MOI_GHI_NHAN">Mới</SelectItem>
                        <SelectItem value="DANG_XU_LY">Đang xử lý</SelectItem>
                        <SelectItem value="DA_GIAI_QUYET">Đã giải quyết</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="min-w-[250px]">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]">
                        <SelectValue placeholder="Lọc theo Phân loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả phân loại</SelectItem>
                        <SelectItem value="HA_TANG">Hạ tầng</SelectItem>
                        <SelectItem value="AN_NINH">An ninh</SelectItem>
                        <SelectItem value="MOI_TRUONG">Môi trường</SelectItem>
                        <SelectItem value="KHAC">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Danh sách Kiến nghị
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
                <span className="ml-3 text-[#212121]">Đang tải...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-[#B71C1C]">{error}</div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-12 text-[#212121]">Chưa có kiến nghị nào</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-[#212121]/10">
                    <TableHead className="w-16 h-14">
                      <Checkbox
                        checked={selectedIds.length === feedbacks.length && feedbacks.length > 0}
                        onCheckedChange={handleSelectAll}
                        className="w-6 h-6"
                      />
                    </TableHead>
                    <TableHead className="text-[#212121] h-14">Nội dung</TableHead>
                    <TableHead className="text-[#212121] h-14">Phân loại</TableHead>
                    <TableHead className="text-[#212121] h-14">Người phản ánh</TableHead>
                    <TableHead className="text-[#212121] h-14">Trạng thái</TableHead>
                    <TableHead className="text-[#212121] h-14">Ngày gửi</TableHead>
                    <TableHead className="text-[#212121] h-14 text-center">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id} className="border-b border-[#212121]/10">
                      <TableCell className="h-16">
                        <Checkbox
                          checked={selectedIds.includes(feedback.id)}
                          onCheckedChange={(checked) => handleSelectOne(feedback.id, checked as boolean)}
                          className="w-6 h-6"
                        />
                      </TableCell>
                      <TableCell className="text-[#212121] h-16 max-w-md">
                        {feedback.content}
                      </TableCell>
                      <TableCell className="text-[#212121] h-16">
                        {CATEGORY_DISPLAY[feedback.category] || feedback.category}
                      </TableCell>
                      <TableCell className="text-[#212121] h-16">
                        {feedback.nguoi_phan_anh?.full_name || 'N/A'}
                      </TableCell>
                      <TableCell className="h-16">
                        <span className={`px-4 py-2 rounded ${getStatusColor(feedback.status)}`}>
                          {STATUS_DISPLAY[feedback.status] || feedback.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-[#212121] h-16">
                        {formatDate(feedback.created_at)}
                      </TableCell>
                      <TableCell className="h-16 text-center">
                        <Link to={`/leader/feedback/${feedback.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#0D47A1] text-[#0D47A1] hover:bg-[#0D47A1]/10"
                          >
                            <Eye className="w-4 h-4 mr-1" />
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
    </LeaderLayout>
  );
}