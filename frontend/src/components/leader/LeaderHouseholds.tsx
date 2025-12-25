import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { deleteHousehold, getHouseholdList, type HouseholdListParams } from '../../api_caller/port8018';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import LeaderLayout from './LeaderLayout';

interface LeaderHouseholdsProps {
  onLogout: () => void;
}

interface Household {
  id: string;
  household_number: string;
  address: string;
  ward: string;
  head_of_household_name?: string;
  member_count?: number;
  [key: string]: any;
}

export default function LeaderHouseholds({ onLogout }: LeaderHouseholdsProps) {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem('access_token') || '';

  useEffect(() => {
    fetchHouseholds();
  }, [currentPage]);

  const fetchHouseholds = async (query?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params: HouseholdListParams = {
        page: currentPage,
        limit: 20,
      };

      if (query) {
        params.q = query;
      }

      const data = await getHouseholdList(token, params);
      
      if (Array.isArray(data)) {
        setHouseholds(data);
      } else if (data.items && Array.isArray(data.items)) {
        setHouseholds(data.items);
        if (data.total && data.limit) {
          setTotalPages(Math.ceil(data.total / data.limit));
        }
      } else {
        setHouseholds([]);
      }
    } catch (err) {
      console.error('Error fetching households:', err);
      setError('Không thể tải danh sách hộ khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchHouseholds(searchQuery);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hộ khẩu này?')) {
      return;
    }

    try {
      await deleteHousehold(token, id);
      setSuccessMessage('Xóa hộ khẩu thành công');
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchHouseholds(searchQuery);
    } catch (err) {
      console.error('Error deleting household:', err);
      setError('Không thể xóa hộ khẩu. Vui lòng thử lại.');
    }
  };

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
                
                <form onSubmit={handleSearch} className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#212121]/50" />
                    <Input
                      placeholder="Tìm kiếm theo tên chủ hộ hoặc địa chỉ..."
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
              Danh sách Hộ khẩu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-16 flex-1" />
                    <Skeleton className="h-16 w-32" />
                    <Skeleton className="h-16 w-48" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-[#212121]/10">
                      <TableHead className="text-[#212121] h-14">Số hộ khẩu</TableHead>
                      <TableHead className="text-[#212121] h-14">Chủ hộ</TableHead>
                      <TableHead className="text-[#212121] h-14">Địa chỉ</TableHead>
                      <TableHead className="text-[#212121] h-14">Phường/Xã</TableHead>
                      <TableHead className="text-[#212121] h-14">Số thành viên</TableHead>
                      <TableHead className="text-[#212121] h-14">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {households.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-[#212121]/50">
                          {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Không có hộ khẩu nào'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      households.map((household) => (
                        <TableRow key={household.id} className="border-b border-[#212121]/10">
                          <TableCell className="text-[#212121] h-16">
                            <strong>{household.household_number}</strong>
                          </TableCell>
                          <TableCell className="text-[#212121] h-16">
                            {household.head_of_household_name || <em className="text-[#212121]/50">Chưa có</em>}
                          </TableCell>
                          <TableCell className="text-[#212121] h-16">
                            {household.address}
                          </TableCell>
                          <TableCell className="text-[#212121] h-16">
                            {household.ward}
                          </TableCell>
                          <TableCell className="text-[#212121] h-16 text-center">
                            {household.member_count || 0}
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
                                onClick={() => handleDelete(household.id)}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Trang trước
                    </Button>
                    <span className="flex items-center px-4">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Trang sau
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </LeaderLayout>
  );
}