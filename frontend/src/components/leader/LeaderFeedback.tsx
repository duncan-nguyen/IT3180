import { useState } from 'react';
import LeaderLayout from './LeaderLayout';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Combine } from 'lucide-react';

interface LeaderFeedbackProps {
  onLogout: () => void;
}

const mockFeedbacks = [
  {
    id: 1,
    content: 'Đèn đường khu vực ngõ 25 bị hỏng, tối tăm vào ban đêm',
    reporter: 'Nguyễn Văn An',
    status: 'Mới',
    date: '01/11/2025',
    category: 'Hạ tầng',
  },
  {
    id: 2,
    content: 'Đèn công cộng khu vực ngã tư chợ không sáng',
    reporter: 'Trần Thị Bình',
    status: 'Mới',
    date: '01/11/2025',
    category: 'Hạ tầng',
  },
  {
    id: 3,
    content: 'Rác thải tồn đọng ở khu vực chợ, mùi hôi thối',
    reporter: 'Lê Văn Cường',
    status: 'Đang xử lý',
    date: '30/10/2025',
    category: 'Môi trường',
  },
  {
    id: 4,
    content: 'Xe máy đậu lấn chiếm vỉa hè, gây cản trở giao thông',
    reporter: 'Phạm Thị Dung',
    status: 'Đã giải quyết',
    date: '28/10/2025',
    category: 'An ninh',
  },
  {
    id: 5,
    content: 'Tiếng ồn từ quán karaoke vào ban đêm',
    reporter: 'Hoàng Văn Em',
    status: 'Đang xử lý',
    date: '29/10/2025',
    category: 'An ninh',
  },
];

export default function LeaderFeedback({ onLogout }: LeaderFeedbackProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(mockFeedbacks.map((f) => f.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleMerge = () => {
    if (selectedIds.length >= 2) {
      alert(`Đã gộp ${selectedIds.length} kiến nghị thành một!`);
      setSelectedIds([]);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Đã giải quyết') return 'bg-[#1B5E20] text-white';
    if (status === 'Đang xử lý') return 'bg-[#0D47A1] text-white';
    return 'bg-[#FBC02D] text-[#212121]';
  };

  const filteredFeedbacks = mockFeedbacks.filter((feedback) => {
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || feedback.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

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
                  <Button className="h-14 px-6 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white">
                    <Plus className="w-6 h-6 mr-3" />
                    Ghi nhận Kiến nghị Mới
                  </Button>

                  <Button
                    onClick={handleMerge}
                    disabled={selectedIds.length < 2}
                    className="h-14 px-6 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Combine className="w-6 h-6 mr-3" />
                    Gộp các mục đã chọn ({selectedIds.length})
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
                        <SelectItem value="Mới">Mới</SelectItem>
                        <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                        <SelectItem value="Đã giải quyết">Đã giải quyết</SelectItem>
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
                        <SelectItem value="Hạ tầng">Hạ tầng</SelectItem>
                        <SelectItem value="An ninh">An ninh</SelectItem>
                        <SelectItem value="Môi trường">Môi trường</SelectItem>
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
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-[#212121]/10">
                  <TableHead className="w-16 h-14">
                    <Checkbox
                      checked={selectedIds.length === filteredFeedbacks.length && filteredFeedbacks.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="w-6 h-6"
                    />
                  </TableHead>
                  <TableHead className="text-[#212121] h-14">Nội dung</TableHead>
                  <TableHead className="text-[#212121] h-14">Phân loại</TableHead>
                  <TableHead className="text-[#212121] h-14">Người phản ánh</TableHead>
                  <TableHead className="text-[#212121] h-14">Trạng thái</TableHead>
                  <TableHead className="text-[#212121] h-14">Ngày gửi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map((feedback) => (
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
                      {feedback.category}
                    </TableCell>
                    <TableCell className="text-[#212121] h-16">
                      {feedback.reporter}
                    </TableCell>
                    <TableCell className="h-16">
                      <span className={`px-4 py-2 rounded ${getStatusColor(feedback.status)}`}>
                        {feedback.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#212121] h-16">
                      {feedback.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LeaderLayout>
  );
}
