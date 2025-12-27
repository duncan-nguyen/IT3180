import { Link } from 'react-router-dom';
import OfficialLayout from './OfficialLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';

interface OfficialFeedbackListProps {
  userName: string;
  onLogout: () => void;
}

const mockMergedFeedbacks = [
  {
    id: 1,
    title: 'Vấn đề chiếu sáng công cộng khu vực Tổ 5',
    submittedBy: 'Tổ trưởng Tổ 5 - Trần Thị Bình',
    totalReports: 2,
    status: 'Chờ phản hồi',
    date: '02/11/2025',
    category: 'Hạ tầng',
  },
  {
    id: 2,
    title: 'Vệ sinh môi trường khu chợ',
    submittedBy: 'Tổ trưởng Tổ 3 - Nguyễn Văn Hùng',
    totalReports: 1,
    status: 'Đã phản hồi',
    date: '01/11/2025',
    category: 'Môi trường',
  },
  {
    id: 3,
    title: 'Vi phạm trật tự công cộng - Karaoke',
    submittedBy: 'Tổ trưởng Tổ 7 - Lê Thị Mai',
    totalReports: 1,
    status: 'Đang xử lý',
    date: '30/10/2025',
    category: 'An ninh',
  },
];

export default function OfficialFeedbackList({ userName, onLogout }: OfficialFeedbackListProps) {
  const getStatusColor = (status: string) => {
    if (status === 'Đã phản hồi') return 'bg-[#1B5E20] text-white';
    if (status === 'Đang xử lý') return 'bg-[#0D47A1] text-white';
    return 'bg-[#FBC02D] text-[#212121]';
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
              Kiến nghị đã được Tổ trưởng gộp và gửi lên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-[#212121]/10">
                  <TableHead className="text-[#212121] h-14">Tiêu đề</TableHead>
                  <TableHead className="text-[#212121] h-14">Phân loại</TableHead>
                  <TableHead className="text-[#212121] h-14">Người gửi</TableHead>
                  <TableHead className="text-[#212121] h-14">Số báo cáo gộp</TableHead>
                  <TableHead className="text-[#212121] h-14">Trạng thái</TableHead>
                  <TableHead className="text-[#212121] h-14">Ngày gửi</TableHead>
                  <TableHead className="text-[#212121] h-14">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMergedFeedbacks.map((feedback) => (
                  <TableRow key={feedback.id} className="border-b border-[#212121]/10">
                    <TableCell className="text-[#212121] h-16 max-w-md">
                      <strong>{feedback.title}</strong>
                    </TableCell>
                    <TableCell className="text-[#212121] h-16">
                      {feedback.category}
                    </TableCell>
                    <TableCell className="text-[#212121] h-16">
                      {feedback.submittedBy}
                    </TableCell>
                    <TableCell className="text-[#212121] h-16 text-center">
                      {feedback.totalReports}
                    </TableCell>
                    <TableCell className="h-16">
                      <span className={`px-4 py-2 rounded ${getStatusColor(feedback.status)}`}>
                        {feedback.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#212121] h-16">
                      {feedback.date}
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </OfficialLayout>
  );
}
