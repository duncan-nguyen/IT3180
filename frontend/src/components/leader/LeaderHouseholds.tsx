import LeaderLayout from './LeaderLayout';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';

interface LeaderHouseholdsProps {
  onLogout: () => void;
}

const mockHouseholds = [
  { id: 'HK-001', owner: 'Nguyễn Văn An', address: '25 Nguyễn Trãi', members: 4, status: 'Đã xác minh' },
  { id: 'HK-002', owner: 'Trần Thị Bình', address: '30 Lê Lợi', members: 3, status: 'Đã xác minh' },
  { id: 'HK-003', owner: 'Lê Văn Cường', address: '15 Hai Bà Trưng', members: 5, status: 'Chờ xác minh' },
  { id: 'HK-004', owner: 'Phạm Thị Dung', address: '42 Trần Hưng Đạo', members: 2, status: 'Đã xác minh' },
  { id: 'HK-005', owner: 'Hoàng Văn Em', address: '8 Lý Thường Kiệt', members: 6, status: 'Đã xác minh' },
];

export default function LeaderHouseholds({ onLogout }: LeaderHouseholdsProps) {
  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-6">
            Quản lý Hộ khẩu
          </h1>

          {/* Toolbar */}
          <Card className="border-2 border-[#212121]/10">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <Button className="h-14 px-6 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white">
                  <Plus className="w-6 h-6 mr-3" />
                  Thêm Hộ khẩu Mới
                </Button>
                
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#212121]/50" />
                    <Input
                      placeholder="Tìm kiếm theo số hộ khẩu, chủ hộ..."
                      className="h-14 pl-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                    />
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
              Danh sách Hộ khẩu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-[#212121]/10">
                  <TableHead className="text-[#212121] h-14">Số Hộ khẩu</TableHead>
                  <TableHead className="text-[#212121] h-14">Chủ hộ</TableHead>
                  <TableHead className="text-[#212121] h-14">Địa chỉ</TableHead>
                  <TableHead className="text-[#212121] h-14">Số thành viên</TableHead>
                  <TableHead className="text-[#212121] h-14">Trạng thái</TableHead>
                  <TableHead className="text-[#212121] h-14">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHouseholds.map((household) => (
                  <TableRow key={household.id} className="border-b border-[#212121]/10">
                    <TableCell className="text-[#212121] h-16">
                      <strong>{household.id}</strong>
                    </TableCell>
                    <TableCell className="text-[#212121] h-16">{household.owner}</TableCell>
                    <TableCell className="text-[#212121] h-16">{household.address}</TableCell>
                    <TableCell className="text-[#212121] h-16">{household.members}</TableCell>
                    <TableCell className="h-16">
                      <span
                        className={`px-4 py-2 rounded ${
                          household.status === 'Đã xác minh'
                            ? 'bg-[#1B5E20] text-white'
                            : 'bg-[#FBC02D] text-[#212121]'
                        }`}
                      >
                        {household.status}
                      </span>
                    </TableCell>
                    <TableCell className="h-16">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-12 px-4 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
                        >
                          <Edit className="w-5 h-5 mr-2" />
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-12 px-4 border-2 border-[#B71C1C]/30 text-[#B71C1C] hover:bg-[#B71C1C]/10"
                        >
                          <Trash2 className="w-5 h-5 mr-2" />
                          Xóa
                        </Button>
                      </div>
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
