import { CheckCircle, ChevronLeft, ChevronRight, Eye, Home, Loader2, Search, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Household, householdsService } from '../../services/households-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import OfficialLayout from './OfficialLayout';

interface OfficialHouseholdsProps {
  onLogout: () => void;
}

export default function OfficialHouseholds({ onLogout }: OfficialHouseholdsProps) {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHouseholds();
  }, [page, searchQuery]);

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      const response = await householdsService.getHouseholdsList({
        q: searchQuery || undefined,
        page,
        limit: 10,
      });
      setHouseholds(response.data);
      setTotalPages(Math.ceil(response.pagination.count / response.pagination.limit));
    } catch (err: any) {
      console.error('Error fetching households:', err);
      setError('Không thể tải danh sách hộ khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      setProcessingId(id);
      await householdsService.verifyHousehold(id);
      // Update local state
      setHouseholds(prev =>
        prev.map(h => (h.id === id ? { ...h, is_verified: true } : h))
      );
    } catch (err: any) {
      console.error('Error verifying household:', err);
      alert('Xác minh thất bại: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnverify = async (id: string) => {
    try {
      setProcessingId(id);
      await householdsService.unverifyHousehold(id);
      // Update local state
      setHouseholds(prev =>
        prev.map(h => (h.id === id ? { ...h, is_verified: false } : h))
      );
    } catch (err: any) {
      console.error('Error unverifying household:', err);
      alert('Hủy xác minh thất bại: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const filteredHouseholds = households.filter(h => {
    if (verificationFilter === 'verified') return h.is_verified === true;
    if (verificationFilter === 'unverified') return h.is_verified !== true;
    return true;
  });

  const stats = {
    total: households.length,
    verified: households.filter(h => h.is_verified === true).length,
    unverified: households.filter(h => h.is_verified !== true).length,
  };

  return (
    <OfficialLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#212121] flex items-center gap-3">
            <Home className="w-8 h-8 text-[#0D47A1]" />
            Xác minh Hộ khẩu
          </h1>
          <p className="text-gray-600 mt-2">
            Xem và xác minh thông tin hộ khẩu trong phường
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-2 border-[#212121]/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng số hộ khẩu</p>
                  <p className="text-2xl font-bold text-[#212121]">{stats.total}</p>
                </div>
                <Home className="w-10 h-10 text-[#0D47A1]" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Đã xác minh</p>
                  <p className="text-2xl font-bold text-green-700">{stats.verified}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700">Chưa xác minh</p>
                  <p className="text-2xl font-bold text-orange-700">{stats.unverified}</p>
                </div>
                <XCircle className="w-10 h-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2 border-[#212121]/10 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo địa chỉ, số hộ khẩu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-2 border-[#212121]/20 focus:border-[#0D47A1]"
                />
              </div>

              {/* Verification Filter */}
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger className="w-[200px] h-12 border-2 border-[#212121]/20">
                  <SelectValue placeholder="Trạng thái xác minh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="verified">Đã xác minh</SelectItem>
                  <SelectItem value="unverified">Chưa xác minh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Households Table */}
        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Danh sách Hộ khẩu ({filteredHouseholds.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
              </div>
            ) : filteredHouseholds.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Không có hộ khẩu nào.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#212121]/10">
                      <th className="text-left p-4 font-semibold text-[#212121]">Số Hộ khẩu</th>
                      <th className="text-left p-4 font-semibold text-[#212121]">Địa chỉ</th>
                      <th className="text-left p-4 font-semibold text-[#212121]">Chủ hộ</th>
                      <th className="text-left p-4 font-semibold text-[#212121]">Số nhân khẩu</th>
                      <th className="text-center p-4 font-semibold text-[#212121]">Trạng thái</th>
                      <th className="text-center p-4 font-semibold text-[#212121]">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHouseholds.map((household) => (
                      <tr key={household.id} className="border-b border-[#212121]/5 hover:bg-[#F5F5F5]">
                        <td className="p-4 font-medium text-[#0D47A1]">
                          {household.household_number || 'N/A'}
                        </td>
                        <td className="p-4 text-[#212121]">
                          {household.address}
                        </td>
                        <td className="p-4 text-[#212121]">
                          {household.head_of_household?.full_name || household.head_name || 'Chưa có'}
                        </td>
                        <td className="p-4 text-[#212121]">
                          {household.nhan_khau?.length || 0} người
                        </td>
                        <td className="p-4 text-center">
                          {household.is_verified ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              Đã xác minh
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                              <X className="w-4 h-4" />
                              Chưa xác minh
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <Link to={`/official/households/${household.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#0D47A1] text-[#0D47A1] hover:bg-[#0D47A1]/10"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Chi tiết
                              </Button>
                            </Link>
                            {household.is_verified ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnverify(household.id)}
                                disabled={processingId === household.id}
                                className="border-orange-500 text-orange-600 hover:bg-orange-50"
                              >
                                {processingId === household.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Hủy xác minh
                                  </>
                                )}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerify(household.id)}
                                disabled={processingId === household.id}
                                className="border-green-500 text-green-600 hover:bg-green-50"
                              >
                                {processingId === household.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Xác minh
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-[#212121]/10">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-[#212121]/20"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </Button>
                <span className="text-[#212121]">
                  Trang {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-[#212121]/20"
                >
                  Sau
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </OfficialLayout>
  );
}
