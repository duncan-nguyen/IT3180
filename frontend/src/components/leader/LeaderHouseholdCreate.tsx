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

  // Form state
  const [address, setAddress] = useState('');
  const [phuongXa, setPhuongXa] = useState('');
  const [quanHuyen, setQuanHuyen] = useState('');
  const [tinhThanh, setTinhThanh] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      setError('Vui lòng nhập địa chỉ');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await householdsService.createHousehold({
        address,
        phuong_xa: phuongXa || undefined,
        quan_huyen: quanHuyen || undefined,
        tinh_thanh: tinhThanh || undefined,
      });

      alert('Tạo hộ khẩu thành công!');
      navigate('/leader/households');
    } catch (err: any) {
      console.error('Error creating household:', err);
      setError(err.response?.data?.detail?.message || 'Không thể tạo hộ khẩu');
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
          <h1 className="text-[#212121] mb-3">
            Thêm Hộ khẩu Mới
          </h1>
          <p className="text-[#212121]">
            Tạo mới hộ khẩu trong khu vực quản lý của bạn
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
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
                    <Label htmlFor="street-address" className="text-[#212121]">
                      Số nhà, tên đường <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="street-address"
                      placeholder="VD: 25 Nguyễn Trãi"
                      className="h-12 border-2 border-[#212121]/20"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="ward" className="text-[#212121]">
                        Phường/Xã
                      </Label>
                      <Input
                        id="ward"
                        placeholder="VD: Phường Đống Đa"
                        className="h-12 border-2 border-[#212121]/20"
                        value={phuongXa}
                        onChange={(e) => setPhuongXa(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="district" className="text-[#212121]">
                        Quận/Huyện
                      </Label>
                      <Input
                        id="district"
                        placeholder="VD: Quận Đống Đa"
                        className="h-12 border-2 border-[#212121]/20"
                        value={quanHuyen}
                        onChange={(e) => setQuanHuyen(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-[#212121]">
                      Tỉnh/Thành phố
                    </Label>
                    <Input
                      id="city"
                      placeholder="VD: Hà Nội"
                      className="h-12 border-2 border-[#212121]/20"
                      value={tinhThanh}
                      onChange={(e) => setTinhThanh(e.target.value)}
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
                    disabled={loading}
                    className="w-full h-14 bg-[#1B5E20] hover:bg-[#1B5E20]/90"
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
                  >
                    Hủy
                  </Button>
                </CardContent>
              </Card>

              {/* Guidelines */}
              <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-[#0D47A1]" />
                    <CardTitle className="text-[#212121]">
                      Hướng dẫn
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-[#212121]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#0D47A1] mt-1">•</span>
                      <span>Kiểm tra kỹ thông tin trước khi lưu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0D47A1] mt-1">•</span>
                      <span>Địa chỉ là bắt buộc</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0D47A1] mt-1">•</span>
                      <span>Sau khi tạo có thể thêm chủ hộ và thành viên</span>
                    </li>
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
