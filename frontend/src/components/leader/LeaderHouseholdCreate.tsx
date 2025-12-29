import { AlertCircle, ArrowLeft, Loader2, MapPin, Save } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { householdsService } from '../../services/households-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import LeaderLayout from './LeaderLayout';

interface LeaderHouseholdCreateProps {
  onLogout: () => void;
}

export default function LeaderHouseholdCreate({ onLogout }: LeaderHouseholdCreateProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state - matching backend schema
  const [householdNumber, setHouseholdNumber] = useState('');
  const [address, setAddress] = useState('');
  const [ward, setWard] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!householdNumber) {
      setError('Vui lòng nhập số hộ khẩu');
      return;
    }
    if (!address) {
      setError('Vui lòng nhập địa chỉ');
      return;
    }
    if (!ward) {
      setError('Vui lòng nhập phường/xã');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await householdsService.createHousehold({
        household_number: householdNumber,
        address,
        ward,
      });

      alert('Tạo hộ khẩu thành công!');
      navigate('/leader/households');
    } catch (err: any) {
      console.error('Error creating household:', err);
      setError(err.response?.data?.detail?.error?.message || err.response?.data?.detail || 'Không thể tạo hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

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
            Thêm Hộ khẩu Mới
          </h1>
          <p className="text-[#212121]">
            Tạo mới hộ khẩu trong khu vực quản lý của bạn
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-2 border-[#B71C1C]/40 bg-[#B71C1C]/10">
            <CardContent className="pt-4">
              <p className="text-[#B71C1C]">{error}</p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
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
                      Số hộ khẩu <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="household-number"
                      value={householdNumber}
                      onChange={(e) => setHouseholdNumber(e.target.value)}
                      className="h-12 border-2 border-[#212121]/20"
                      placeholder="Nhập số hộ khẩu"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="street-address" className="text-[#212121]">
                      Số nhà, tên đường <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="street-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-12 border-2 border-[#212121]/20"
                      placeholder="Ví dụ: 123 Nguyễn Trãi"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="ward" className="text-[#212121]">
                      Phường/Xã <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="ward"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="h-12 border-2 border-[#212121]/20"
                      placeholder="Nhập phường/xã"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
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
                    type="submit"
                    className="w-full h-14 bg-[#1B5E20] hover:bg-[#1B5E20]/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Lưu Hộ khẩu
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/leader/households')}
                    className="w-full h-14 border-2 border-[#212121]/20"
                    disabled={loading}
                  >
                    Hủy
                  </Button>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
                <CardHeader>
                  <CardTitle className="text-[#212121] flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#0D47A1]" />
                    Hướng dẫn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-[#212121]">
                    <li>• Kiểm tra kỹ thông tin trước khi lưu</li>
                    <li>• Các trường có dấu * là bắt buộc</li>
                    <li>• Số hộ khẩu phải là duy nhất</li>
                    <li>• Sau khi tạo có thể thêm chủ hộ và thành viên</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </LeaderLayout>
  );
}
