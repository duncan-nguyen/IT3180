import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { deleteResident, searchResidents } from '../api_caller/port8018';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import LeaderLayout from './LeaderLayout';

interface LeaderResidentsProps {
  onLogout: () => void;
}

interface Resident {
  id: string;
  full_name: string;
  date_of_birth: string;
  cccd_number: string;
  household_id: string;
  relationship_to_head?: string;
  [key: string]: any;
}

export default function LeaderResidents({ onLogout }: LeaderResidentsProps) {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const token = localStorage.getItem('access_token') || '';

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async (query?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If query is provided, use search; otherwise, get all residents (you may need to adjust based on API)
      const data = await searchResidents(token, query || '');
      
      if (Array.isArray(data)) {
        setResidents(data);
      } else if (data.items && Array.isArray(data.items)) {
        setResidents(data.items);
      } else {
        setResidents([]);
      }
    } catch (err) {
      console.error('Error fetching residents:', err);
      setError('Không thể tải danh sách nhân khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResidents(searchQuery);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân khẩu này?')) {
      return;
    }

    try {
      await deleteResident(token, id);
      setSuccessMessage('Xóa nhân khẩu thành công');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchResidents(searchQuery);
    } catch (err) {
      console.error('Error deleting resident:', err);
      setError('Không thể xóa nhân khẩu. Vui lòng thử lại.');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
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
                <Button className="h-14 px-6 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white">
                  <Plus className="w-6 h-6 mr-3" />
                  Thêm Nhân khẩu Mới
                </Button>
                
                <form onSubmit={handleSearch} className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#212121]/50" />
                    <Input
                      placeholder="Tìm kiếm theo tên hoặc CCCD..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-14 pl-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                    />
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
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
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Data Table */}
        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Danh sách Nhân khẩu
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
                    <Skeleton className="h-16 w-48" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-[#212121]/10">
                    <TableHead className="text-[#212121] h-14">Họ và tên</TableHead>
                    <TableHead className="text-[#212121] h-14">Ngày sinh</TableHead>
                    <TableHead className="text-[#212121] h-14">Số CCCD</TableHead>
                    <TableHead className="text-[#212121] h-14">Quan hệ với chủ hộ</TableHead>
                    <TableHead className="text-[#212121] h-14">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {residents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-[#212121]/50">
                        {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Không có nhân khẩu nào'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    residents.map((resident) => (
                      <TableRow key={resident.id} className="border-b border-[#212121]/10">
                        <TableCell className="text-[#212121] h-16">
                          <strong>{resident.full_name}</strong>
                        </TableCell>
                        <TableCell className="text-[#212121] h-16">
                          {formatDate(resident.date_of_birth)}
                        </TableCell>
                        <TableCell className="text-[#212121] h-16">
                          {resident.cccd_number || <em className="text-[#212121]/50">Chưa có</em>}
                        </TableCell>
                        <TableCell className="text-[#212121] h-16">
                          {resident.relationship_to_head || <em className="text-[#212121]/50">Chưa xác định</em>}
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
                              onClick={() => handleDelete(resident.id)}
                              className="h-12 px-4 border-2 border-[#B71C1C]/30 text-[#B71C1C] hover:bg-[#B71C1C]/10"
                            >
                              <Trash2 className="w-5 h-5 mr-2" />
                              Xóa
                            </Button>
                          </div>
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
    </LeaderLayout>
  );
}