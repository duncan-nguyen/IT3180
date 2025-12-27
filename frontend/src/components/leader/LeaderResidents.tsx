import LeaderLayout from './LeaderLayout';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LeaderResidentsProps {
  onLogout: () => void;
}

const mockResidents = [
  { id: 1, name: 'Nguyễn Văn An', dob: '15/03/1985', cccd: '001085012345', household: 'HK-001', relation: 'Chủ hộ' },
  { id: 2, name: 'Trần Thị Bình', dob: '22/07/1987', cccd: '001087023456', household: 'HK-001', relation: 'Vợ' },
  { id: 3, name: 'Nguyễn Văn Cường', dob: '10/05/2010', cccd: '001010034567', household: 'HK-001', relation: 'Con trai' },
  { id: 4, name: 'Nguyễn Thị Dung', dob: '18/09/2015', cccd: '', household: 'HK-001', relation: 'Con gái' },
  { id: 5, name: 'Trần Văn Em', dob: '05/12/1990', cccd: '001090045678', household: 'HK-002', relation: 'Chủ hộ' },
  { id: 6, name: 'Lê Thị Hoa', dob: '30/04/1992', cccd: '001092056789', household: 'HK-002', relation: 'Vợ' },
];

export default function LeaderResidents({ onLogout }: LeaderResidentsProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter residents based on search term
  const filteredResidents = mockResidents.filter((resident) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      resident.name.toLowerCase().includes(searchLower) ||
      resident.cccd.toLowerCase().includes(searchLower) ||
      resident.household.toLowerCase().includes(searchLower)
    );
  });

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-6">
            Quản lý Nhân khẩu
          </h1>

          {/* Toolbar */}
          <Card className="border-2 border-[#212121]/10">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="h-14 px-6 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white"
                  onClick={() => navigate('/leader/residents/create')}
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Thêm Nhân khẩu Mới
                </Button>
                
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#212121]/50" />
                    <Input
                      placeholder="Tìm kiếm theo tên, CCCD, số hộ khẩu..."
                      className="h-14 pl-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-4">
            <p className="text-[#212121]">
              Tìm thấy <strong>{filteredResidents.length}</strong> kết quả cho "{searchTerm}"
            </p>
          </div>
        )}

        {/* Data Table */}
        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Danh sách Nhân khẩu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredResidents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-[#212121]/10">
                    <TableHead className="text-[#212121] h-14">Họ và tên</TableHead>
                    <TableHead className="text-[#212121] h-14">Ngày sinh</TableHead>
                    <TableHead className="text-[#212121] h-14">Số CCCD</TableHead>
                    <TableHead className="text-[#212121] h-14">Hộ khẩu</TableHead>
                    <TableHead className="text-[#212121] h-14">Quan hệ với chủ hộ</TableHead>
                    <TableHead className="text-[#212121] h-14">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResidents.map((resident) => (
                    <TableRow key={resident.id} className="border-b border-[#212121]/10">
                      <TableCell className="text-[#212121] h-16">
                        <strong>{resident.name}</strong>
                      </TableCell>
                      <TableCell className="text-[#212121] h-16">{resident.dob}</TableCell>
                      <TableCell className="text-[#212121] h-16">
                        {resident.cccd || <em className="text-[#212121]/50">Chưa có</em>}
                      </TableCell>
                      <TableCell className="text-[#212121] h-16">{resident.household}</TableCell>
                      <TableCell className="text-[#212121] h-16">{resident.relation}</TableCell>
                      <TableCell className="h-16">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-12 px-4 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
                            onClick={() => navigate(`/leader/residents/${resident.id}/edit`)}
                          >
                            <Edit className="w-5 h-5 mr-2" />
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-12 px-4 border-2 border-[#B71C1C]/30 text-[#B71C1C] hover:bg-[#B71C1C]/10"
                            onClick={() => navigate(`/leader/residents/${resident.id}/delete`)}
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
            ) : (
              <div className="p-12 text-center">
                <p className="text-[#212121] mb-2">
                  Không tìm thấy nhân khẩu nào
                </p>
                <p className="text-sm text-[#212121]">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </LeaderLayout>
  );
}