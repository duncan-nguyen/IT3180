import { Edit, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Household, householdsService } from '../../services/households-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import LeaderLayout from './LeaderLayout';

interface LeaderHouseholdsProps {
  onLogout: () => void;
}

export default function LeaderHouseholds({ onLogout }: LeaderHouseholdsProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        setLoading(true);
        const response = await householdsService.getHouseholdsList({ q: searchTerm || undefined });
        setHouseholds(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching households:', err);
        setError('Không thể tải danh sách hộ khẩu');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchHouseholds, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getStatusDisplay = (household: Household) => {
    // Can be customized based on actual status field from backend
    return (household.head_id || household.head_of_household) ? 'Đã xác minh' : 'Chờ xác minh';
  };

  const getHeadName = (household: Household) => {
    if (household.head_of_household?.full_name) {
      return household.head_of_household.full_name;
    }
    if (household.head_name) {
      return household.head_name;
    }
    return 'Chưa có';
  };

  const getMemberCount = (household: Household) => {
    return household.nhan_khau?.length || 0;
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
                <Button
                  className="h-14 px-6 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white"
                  onClick={() => navigate('/leader/households/create')}
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Thêm Hộ khẩu Mới
                </Button>

                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#212121]/50" />
                    <Input
                      placeholder="Tìm kiếm theo số hộ khẩu, chủ hộ..."
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
              Tìm thấy <strong>{households.length}</strong> kết quả cho "{searchTerm}"
            </p>
          </div>
        )}

        {/* Data Table */}
        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Danh sách Hộ khẩu
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
            ) : households.length > 0 ? (
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
                  {households.map((household) => (
                    <TableRow key={household.id} className="border-b border-[#212121]/10">
                      <TableCell className="text-[#212121] h-16">
                        <strong>{household.household_number || household.id.slice(0, 8)}</strong>
                      </TableCell>
                      <TableCell className="text-[#212121] h-16">{getHeadName(household)}</TableCell>
                      <TableCell className="text-[#212121] h-16">{household.address}</TableCell>
                      <TableCell className="text-[#212121] h-16">{getMemberCount(household)}</TableCell>
                      <TableCell className="h-16">
                        <span
                          className={`px-4 py-2 rounded ${getStatusDisplay(household) === 'Đã xác minh'
                              ? 'bg-[#1B5E20] text-white'
                              : 'bg-[#FBC02D] text-[#212121]'
                            }`}
                        >
                          {getStatusDisplay(household)}
                        </span>
                      </TableCell>
                      <TableCell className="h-16">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-12 px-4 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
                            onClick={() => navigate(`/leader/households/${household.id}/edit`)}
                          >
                            <Edit className="w-5 h-5 mr-2" />
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-12 px-4 border-2 border-[#B71C1C]/30 text-[#B71C1C] hover:bg-[#B71C1C]/10"
                            onClick={() => navigate(`/leader/households/${household.id}/delete`)}
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
                  Không tìm thấy hộ khẩu nào
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