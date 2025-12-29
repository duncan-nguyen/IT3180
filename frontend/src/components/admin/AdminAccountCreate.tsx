import { AlertCircle, ArrowLeft, CheckCircle2, Save, Search, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth-service';
import { Resident, residentsService } from '../../services/residents-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import AdminLayout from './AdminLayout';

interface AdminAccountCreateProps {
  onLogout: () => void;
}

export default function AdminAccountCreate({ onLogout }: AdminAccountCreateProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    cccd: '',
    role: '',
    area: '',
    password: '',
    confirmPassword: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [residentFound, setResidentFound] = useState<Resident | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
    setResidentFound(null);
    setFormData(prev => ({ ...prev, fullname: '', address: '', cccd: '' }));
  };

  const handleAreaChange = (value: string) => {
    setFormData(prev => ({ ...prev, area: value }));
  };

  const handleSearchResident = async () => {
    if (!formData.cccd) return;
    setSearchLoading(true);
    setError('');
    setResidentFound(null);

    try {
      const results = await residentsService.search(formData.cccd);
      // Filter strictly by CCCD as search might be fuzzy
      const match = results.find(r => r.cccd_number === formData.cccd);

      if (match) {
        setResidentFound(match);
        setFormData(prev => ({
          ...prev,
          fullname: match.full_name,
          address: match.household?.address || ''
        }));
      } else {
        setError('Không tìm thấy nhân khẩu với số CCCD này.');
      }
    } catch (err: any) {
      setError('Lỗi khi tìm kiếm nhân khẩu: ' + (err.message || 'Unknown error'));
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!formData.fullname || !formData.email || !formData.password || !formData.role) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (formData.role === 'citizen') {
      if (!residentFound) {
        setError('Đối với tài khoản Người dân, vui lòng nhập số CCCD và tìm kiếm nhân khẩu trước.');
        return;
      }
    }

    if (formData.role === 'leader' && !formData.area) {
      setError('Đối với tài khoản Tổ trưởng, vui lòng chọn Tổ dân phố.');
      return;
    }

    setLoading(true);

    try {
      let scopeId = '';
      if (formData.role === 'citizen') {
        scopeId = residentFound!.id;
      } else if (formData.role === 'leader') {
        scopeId = formData.area;
      }

      // Map frontend role to backend Enum
      const roleMapping: Record<string, string> = {
        'admin': 'admin',
        'citizen': 'nguoi_dan',
        'leader': 'to_truong',
        'official': 'can_bo_phuong'
      };
      const backendRole = roleMapping[formData.role] || formData.role;

      await authService.createUser({
        username: formData.email, // Using email as username per plan
        password: formData.password,
        role: backendRole,
        scope_id: scopeId
      });

      setSuccess('Tạo tài khoản thành công!');
      // Reset form or navigate away
      setTimeout(() => {
        navigate('/admin');
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setError('Tạo tài khoản thất bại: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3">
            Tạo Tài khoản Mới
          </h1>
          <p className="text-[#212121]">
            Thêm người dùng mới vào hệ thống
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <UserPlus className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Tài khoản
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Messages */}
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {success}
                  </div>
                )}

                {/* Role and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="role" className="text-[#212121]">
                      Vai trò <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger id="role" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">Người dân</SelectItem>
                        <SelectItem value="leader">Tổ trưởng</SelectItem>
                        <SelectItem value="official">Cán bộ Phường/Xã</SelectItem>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="area" className="text-[#212121]">
                      Tổ dân phố (nếu là Tổ trưởng)
                    </Label>
                    <Select
                      value={formData.area}
                      onValueChange={handleAreaChange}
                      disabled={formData.role !== 'leader'}
                    >
                      <SelectTrigger id="area" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue placeholder="Chọn tổ" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                          <SelectItem key={num} value={num.toString()}>Tổ {num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* CCCD Search for Citizen */}
                {formData.role === 'citizen' && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <Label className="text-[#0D47A1] mb-2 block">Tìm kiếm công dân (Bắt buộc cho tài khoản Người dân)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="cccd"
                        placeholder="Nhập số CCCD"
                        className="h-12 border-2 border-[#0D47A1]/20 flex-1"
                        value={formData.cccd}
                        onChange={handleInputChange}
                      />
                      <Button
                        onClick={handleSearchResident}
                        disabled={searchLoading || !formData.cccd}
                        className="h-12 bg-[#0D47A1] hover:bg-[#0D47A1]/90"
                      >
                        {searchLoading ? 'Đang tìm...' : <Search className="w-5 h-5" />}
                      </Button>
                    </div>
                    {residentFound && (
                      <div className="mt-2 text-green-600 flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Đã tìm thấy: {residentFound.full_name}
                      </div>
                    )}
                  </div>
                )}

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="fullname" className="text-[#212121]">
                      Họ và Tên <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="fullname"
                      placeholder="Nguyễn Văn A"
                      className="h-12 border-2 border-[#212121]/20"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      readOnly={formData.role === 'citizen' && !!residentFound} // Read only if linked
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[#212121]">
                      Email (Tên đăng nhập) <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nguyenvana@example.com"
                      className="h-12 border-2 border-[#212121]/20"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-[#212121]">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      placeholder="0912345678"
                      className="h-12 border-2 border-[#212121]/20"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="cccd_display" className="text-[#212121]">
                      Số CCCD
                    </Label>
                    <Input
                      id="cccd_display"
                      placeholder="001234567890"
                      className="h-12 border-2 border-[#212121]/20"
                      value={formData.cccd}
                      onChange={(e) => setFormData(p => ({ ...p, cccd: e.target.value }))} // Update cccd manually for non-citizen roles
                      readOnly={formData.role === 'citizen'} // Citizen uses the search field above
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-[#212121]">
                      Mật khẩu <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Tối thiểu 8 ký tự"
                      className="h-12 border-2 border-[#212121]/20"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-[#212121]">
                      Xác nhận Mật khẩu <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      className="h-12 border-2 border-[#212121]/20"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <Label htmlFor="address" className="text-[#212121]">
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    placeholder="15 Nguyễn Lương Bằng, Phường Đống Đa"
                    className="h-12 border-2 border-[#212121]/20"
                    value={formData.address}
                    onChange={handleInputChange}
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
                  className="w-full h-14 bg-[#1B5E20] hover:bg-[#1B5E20]/90"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {loading ? 'Đang tạo...' : 'Tạo Tài khoản'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                >
                  Hủy
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hướng dẫn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Đối với <strong>Người dân</strong>, bạn phải nhập số CCCD để liên kết với dữ liệu nhân khẩu có sẵn.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Email sẽ được sử dụng làm <strong>Tên đăng nhập</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Mật khẩu phải có tối thiểu 8 ký tự.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
