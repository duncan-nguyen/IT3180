import { ArrowLeft, CheckCircle, Home, Loader2, User, Users, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Household, householdsService } from '../../services/households-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import OfficialLayout from './OfficialLayout';

interface OfficialHouseholdDetailProps {
  onLogout: () => void;
}

export default function OfficialHouseholdDetail({ onLogout }: OfficialHouseholdDetailProps) {
  const { id } = useParams();
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingVerify, setProcessingVerify] = useState(false);

  useEffect(() => {
    if (id) {
      fetchHouseholdDetail(id);
    }
  }, [id]);

  const fetchHouseholdDetail = async (householdId: string) => {
    try {
      setLoading(true);
      const data = await householdsService.getHouseholdById(householdId);
      setHousehold(data);
    } catch (err: any) {
      console.error('Error fetching household detail:', err);
      setError('Không thể tải thông tin hộ khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!id) return;
    try {
      setProcessingVerify(true);
      await householdsService.verifyHousehold(id);
      setHousehold(prev => prev ? { ...prev, is_verified: true } : prev);
    } catch (err: any) {
      console.error('Error verifying household:', err);
      alert('Xác minh thất bại: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessingVerify(false);
    }
  };

  const handleUnverify = async () => {
    if (!id) return;
    try {
      setProcessingVerify(true);
      await householdsService.unverifyHousehold(id);
      setHousehold(prev => prev ? { ...prev, is_verified: false } : prev);
    } catch (err: any) {
      console.error('Error unverifying household:', err);
      alert('Hủy xác minh thất bại: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessingVerify(false);
    }
  };

  if (loading) {
    return (
      <OfficialLayout onLogout={onLogout}>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
        </div>
      </OfficialLayout>
    );
  }

  if (!household) {
    return (
      <OfficialLayout onLogout={onLogout}>
        <div className="p-6">
          <div className="text-red-500">
            {error || 'Không tìm thấy hộ khẩu.'}
          </div>
          <Link to="/official/households">
            <Button className="mt-4">Quay lại</Button>
          </Link>
        </div>
      </OfficialLayout>
    );
  }

  return (
    <OfficialLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/official/households">
              <Button
                variant="outline"
                className="h-14 px-6 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
              >
                <ArrowLeft className="w-6 h-6 mr-3" />
                Quay lại
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-[#212121] flex items-center gap-3">
              <Home className="w-8 h-8 text-[#0D47A1]" />
              Chi tiết Hộ khẩu
            </h1>
          </div>

          {/* Verify/Unverify Button */}
          {household.is_verified ? (
            <Button
              onClick={handleUnverify}
              disabled={processingVerify}
              className="h-14 px-6 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {processingVerify ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <XCircle className="w-6 h-6 mr-3" />
              )}
              Hủy xác minh
            </Button>
          ) : (
            <Button
              onClick={handleVerify}
              disabled={processingVerify}
              className="h-14 px-6 bg-green-600 hover:bg-green-700 text-white"
            >
              {processingVerify ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-6 h-6 mr-3" />
              )}
              Xác minh hộ khẩu
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Household Info Card */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121] flex items-center gap-2">
                  <Home className="w-5 h-5 text-[#0D47A1]" />
                  Thông tin Hộ khẩu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Số Hộ khẩu</p>
                    <p className="text-lg font-semibold text-[#0D47A1]">
                      {household.household_number || 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Trạng thái xác minh</p>
                    {household.is_verified ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Đã xác minh
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
                        <XCircle className="w-4 h-4" />
                        Chưa xác minh
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Địa chỉ</p>
                  <p className="text-[#212121] font-medium">{household.address}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Phường/Xã</p>
                    <p className="text-[#212121]">{household.ward || household.phuong_xa || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Quận/Huyện</p>
                    <p className="text-[#212121]">{household.quan_huyen || 'N/A'}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Chủ hộ</p>
                  <p className="text-[#212121] font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0D47A1]" />
                    {household.head_of_household?.full_name || household.head_name || 'Chưa xác định'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Members Card */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0D47A1]" />
                  Danh sách Nhân khẩu ({household.nhan_khau?.length || 0} người)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {household.nhan_khau && household.nhan_khau.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-[#212121]/10">
                          <th className="text-left p-3 font-semibold text-[#212121]">STT</th>
                          <th className="text-left p-3 font-semibold text-[#212121]">Họ và tên</th>
                          <th className="text-left p-3 font-semibold text-[#212121]">Ngày sinh</th>
                          <th className="text-left p-3 font-semibold text-[#212121]">Quan hệ với chủ hộ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {household.nhan_khau.map((member, index) => (
                          <tr key={member.id} className="border-b border-[#212121]/5 hover:bg-[#F5F5F5]">
                            <td className="p-3 text-[#212121]">{index + 1}</td>
                            <td className="p-3 text-[#212121] font-medium">{member.full_name}</td>
                            <td className="p-3 text-[#212121]">
                              {member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString('vi-VN') : 'N/A'}
                            </td>
                            <td className="p-3 text-[#212121]">{member.relationship_to_head || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Chưa có nhân khẩu nào trong hộ khẩu này.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-[#212121]/10 shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-[#212121]">Tóm tắt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-600 mb-1">Tổng số nhân khẩu</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {household.nhan_khau?.length || 0}
                  </p>
                </div>

                <div className={`p-4 rounded-lg text-center ${household.is_verified ? 'bg-green-50' : 'bg-orange-50'}`}>
                  <p className={`text-sm mb-1 ${household.is_verified ? 'text-green-600' : 'text-orange-600'}`}>
                    Trạng thái
                  </p>
                  <p className={`text-lg font-bold ${household.is_verified ? 'text-green-700' : 'text-orange-700'}`}>
                    {household.is_verified ? 'Đã xác minh' : 'Chưa xác minh'}
                  </p>
                </div>

                {household.created_at && (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-1">Ngày tạo</p>
                    <p className="text-[#212121] font-medium">
                      {new Date(household.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </OfficialLayout>
  );
}
