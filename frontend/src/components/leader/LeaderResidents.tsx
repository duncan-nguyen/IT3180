import { Edit, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Resident, residentsService } from '../../services/residents-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import LeaderLayout from './LeaderLayout';

interface LeaderResidentsProps {
  onLogout: () => void;
}

export default function LeaderResidents({ onLogout }: LeaderResidentsProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        setLoading(true);
        const response = await residentsService.getAll({ q: searchTerm || undefined });
        setResidents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching residents:', err);
        setError('Không thể tải danh sách nhân khẩu');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchResidents, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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
                      placeholder="Tìm kiếm theo họ tên, số CCCD..."
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
        {searchTerm && !loading && (
          <div className="mb-4">
            <p className="text-[#212121]">
              Tìm thấy <strong>{residents.length}</strong> kết quả cho "{searchTerm}"
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
                <span className="ml-3 text-[#212121]">Đang tải...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-[#B71C1C]">{error}</div>
            ) : residents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-[#212121]/10">
                    <TableHead className="text-[#212121] h-14">Họ và tên</TableHead>
                    <TableHead className="text-[#212121] h-14">Số CCCD</TableHead>
                    <TableHead className="text-[#212121] h-14">Ngày sinh</TableHead>
                    <TableHead className="text-[#212121] h-14">Địa chỉ</TableHead>
                    <TableHead className="text-[#212121] h-14">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {residents.map((resident) => (
                    <TableRow key={resident.id} className="border-b border-[#212121]/10">
                      <TableCell className="text-[#212121] h-16">
                        <strong>{resident.full_name}</strong>
                      </TableCell>
                      <TableCell className="text-[#212121] h-16">{resident.cccd_number}</TableCell>
                      <TableCell className="text-[#212121] h-16">{formatDate(resident.date_of_birth)}</TableCell>
                      <TableCell className="text-[#212121] h-16">{resident.household?.address || 'Chưa có'}</TableCell>
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