import { AlertCircle, ArrowLeft, Loader2, MapPin, Save, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Household, householdsService, HouseholdUpdateData } from '../../services/households-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import LeaderLayout from './LeaderLayout';

interface LeaderHouseholdEditProps {
  onLogout: () => void;
}

export default function LeaderHouseholdEdit({ onLogout }: LeaderHouseholdEditProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [householdData, setHouseholdData] = useState<Household | null>(null);

  // Form state - matching backend schema
  const [formData, setFormData] = useState({
    household_number: '',
    address: '',
    ward: '',
  });

  useEffect(() => {
    if (id) {
      loadHousehold();
    }
  }, [id]);

  const loadHousehold = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await householdsService.getHouseholdById(id!);
      setHouseholdData(data);
      setFormData({
        household_number: data.household_number || '',
        address: data.address || '',
        ward: (data as any).ward || '',
      });
    } catch (err) {
      console.error('Error loading household:', err);
      setError('Không thể tải thông tin hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!id) return;

    if (!formData.address.trim()) {
      setError('Vui lòng nhập địa chỉ');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const updateData: HouseholdUpdateData = {
        address: formData.address,
        ward: formData.ward || undefined,
        household_number: formData.household_number || undefined,
      };

      await householdsService.updateHousehold(id, updateData);
      setSuccessMessage('Cập nhật hộ khẩu thành công!');
      
      // Navigate back after 1.5s
      setTimeout(() => {
        navigate('/leader/households');
      }, 1500);
    } catch (err: any) {
      console.error('Error updating household:', err);
      setError(err.response?.data?.detail?.error?.message || err.response?.data?.detail || 'Không thể cập nhật hộ khẩu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LeaderLayout onLogout={onLogout}>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
          <span className="ml-2 text-[#212121]">Đang tải...</span>
        </div>
      </LeaderLayout>
    );
  }

  if (!householdData) {
    return (
      <LeaderLayout onLogout={onLogout}>
        <div className="p-6">
          <Card className="border-2 border-[#B71C1C]/20">
            <CardContent className="pt-6">
              <p className="text-[#B71C1C]">Không tìm thấy hộ khẩu</p>
              <Button
                variant="outline"
                onClick={() => navigate('/leader/households')}
                className="mt-4"
              >
                Quay lại danh sách
              </Button>
            </CardContent>
          </Card>
        </div>
      </LeaderLayout>
    );
  }

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/leader/households')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3 text-2xl font-bold">
            Chỉnh sửa Hộ khẩu
          </h1>
          <p className="text-[#212121]">
            Cập nhật thông tin hộ khẩu: {householdData.address}
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Card className="mb-6 border-2 border-[#B71C1C]/40 bg-[#B71C1C]/10">
            <CardContent className="pt-4">
              <p className="text-[#B71C1C]">{error}</p>
            </CardContent>
          </Card>
        )}

        {successMessage && (
          <Card className="mb-6 border-2 border-[#1B5E20]/40 bg-[#1B5E20]/10">
            <CardContent className="pt-4">
              <p className="text-[#1B5E20]">{successMessage}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                    <MapPin className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Địa chỉ Thường trú
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="household-number" className="text-[#212121]">
                    Số hộ khẩu
                  </Label>
                  <Input
                    id="household-number"
                    value={formData.household_number}
                    onChange={(e) => handleInputChange('household_number', e.target.value)}
                    className="h-12 border-2 border-[#212121]/20"
                    placeholder="Nhập số hộ khẩu"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="street-address" className="text-[#212121]">
                    Số nhà, tên đường <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="street-address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="h-12 border-2 border-[#212121]/20"
                    placeholder="Ví dụ: 123 Nguyễn Trãi"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="ward" className="text-[#212121]">
                    Phường/Xã
                  </Label>
                  <Input
                    id="ward"
                    value={formData.ward}
                    onChange={(e) => handleInputChange('ward', e.target.value)}
                    className="h-12 border-2 border-[#212121]/20"
                    placeholder="Nhập phường/xã"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Members List */}
            {householdData.nhan_khau && householdData.nhan_khau.length > 0 && (
              <Card className="border-2 border-[#212121]/10 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                      <Users className="w-6 h-6 text-[#0D47A1]" />
                    </div>
                    <CardTitle className="text-[#212121]">
                      Thành viên ({householdData.nhan_khau.length})
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {householdData.nhan_khau.map((member, index) => (
                      <div 
                        key={member.id || index} 
                        className="p-3 bg-[#F5F5F5] rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-[#212121]">{member.full_name}</p>
                          <p className="text-sm text-[#212121]/70">
                            {member.relationship_to_head || 'Thành viên'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hành động
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Lưu Thay đổi
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/leader/households')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                  disabled={saving}
                >
                  Hủy
                </Button>
              </CardContent>
            </Card>

            {/* Current Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin Hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Số hộ khẩu</strong>
                  </p>
                  <p className="text-[#212121]">
                    {householdData.household_number || 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Địa chỉ</strong>
                  </p>
                  <p className="text-[#212121]">
                    {householdData.address}
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Số thành viên</strong>
                  </p>
                  <p className="text-[#212121]">
                    {householdData.nhan_khau?.length || 0} người
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <CardTitle className="text-[#212121] flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#0D47A1]" />
                  Lưu ý
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[#212121]">
                  <li>• Mọi thay đổi sẽ được ghi vào nhật ký</li>
                  <li>• Thông tin bắt buộc được đánh dấu *</li>
                  <li>• Để thêm/xóa thành viên, vào mục Nhân khẩu</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LeaderLayout>
  );
}
