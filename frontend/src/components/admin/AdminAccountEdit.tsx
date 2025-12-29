import { AlertCircle, ArrowLeft, CheckCircle2, Key, Loader2, Save, Trash2, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService, User, UserUpdateData } from '../../services/auth-service';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import AdminLayout from './AdminLayout';

interface AdminAccountEditProps {
  onLogout: () => void;
}

export default function AdminAccountEdit({ onLogout }: AdminAccountEditProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    role: '',
    scope_id: '',
  });

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.getUserById(id!);
      setUserData(data);
      setFormData({
        username: data.username || '',
        role: data.role || '',
        scope_id: data.scope_id || '',
      });
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Không thể tải thông tin tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData: UserUpdateData = {
        username: formData.username || undefined,
        role: formData.role || undefined,
        scope_id: formData.scope_id || undefined,
      };

      await authService.updateUser(id, updateData);
      setSuccess('Cập nhật tài khoản thành công!');
      
      // Reload to show updated data
      await loadUser();
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.detail || 'Không thể cập nhật tài khoản');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?');
    if (!confirmed) return;

    try {
      setSaving(true);
      setError(null);
      await authService.deleteUser(id);
      navigate('/admin', { state: { message: 'Xóa tài khoản thành công!' } });
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.detail || 'Không thể xóa tài khoản');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!id || !userData) return;

    try {
      setSaving(true);
      setError(null);

      if (userData.active) {
        await authService.lockUser(id);
      } else {
        await authService.unlockUser(id);
      }

      setSuccess(`${userData.active ? 'Khóa' : 'Mở khóa'} tài khoản thành công!`);
      await loadUser();
    } catch (err: any) {
      console.error('Error toggling user status:', err);
      setError(err.response?.data?.detail || 'Không thể thay đổi trạng thái tài khoản');
    } finally {
      setSaving(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': 'Quản trị viên',
      'to_truong': 'Tổ trưởng',
      'can_bo_phuong': 'Cán bộ phường',
      'nguoi_dan': 'Người dân',
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
          <span className="ml-2 text-[#212121]">Đang tải...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!userData) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="p-6">
          <Card className="border-2 border-[#B71C1C]/20">
            <CardContent className="pt-6">
              <p className="text-[#B71C1C]">Không tìm thấy tài khoản</p>
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="mt-4"
              >
                Quay lại danh sách
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[#212121] mb-3 text-2xl font-bold">
                Chỉnh sửa Tài khoản
              </h1>
              <p className="text-[#212121]">
                {userData.username}
              </p>
            </div>
            <Badge className={userData.active ? "bg-[#1B5E20] h-10 px-4" : "bg-[#B71C1C] h-10 px-4"}>
              {userData.active ? 'Đang hoạt động' : 'Đã khóa'}
            </Badge>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <Card className="mb-6 border-2 border-[#B71C1C]/40 bg-[#B71C1C]/10">
            <CardContent className="pt-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#B71C1C]" />
              <p className="text-[#B71C1C]">{error}</p>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-6 border-2 border-[#1B5E20]/40 bg-[#1B5E20]/10">
            <CardContent className="pt-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#1B5E20]" />
              <p className="text-[#1B5E20]">{success}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <UserCog className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Tài khoản
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="username" className="text-[#212121]">
                    Tên đăng nhập <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="h-12 border-2 border-[#212121]/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="role" className="text-[#212121]">
                    Vai trò <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Select 
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                  >
                    <SelectTrigger id="role" className="h-12 border-2 border-[#212121]/20">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                      <SelectItem value="can_bo_phuong">Cán bộ phường</SelectItem>
                      <SelectItem value="to_truong">Tổ trưởng</SelectItem>
                      <SelectItem value="nguoi_dan">Người dân</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="scope_id" className="text-[#212121]">
                    Scope ID (Phạm vi quản lý)
                  </Label>
                  <Input
                    id="scope_id"
                    value={formData.scope_id}
                    onChange={(e) => handleInputChange('scope_id', e.target.value)}
                    className="h-12 border-2 border-[#212121]/20"
                    placeholder="ID tổ dân phố hoặc ID nhân khẩu"
                  />
                  <p className="text-sm text-[#212121]/70">
                    Với Tổ trưởng: ID tổ dân phố. Với Người dân: ID nhân khẩu.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin Hệ thống
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121]">
                    <strong>ID:</strong> {userData.id}
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121]">
                    <strong>Vai trò hiện tại:</strong> {getRoleLabel(userData.role)}
                  </p>
                </div>
                {userData.created_at && (
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <p className="text-[#212121]">
                      <strong>Ngày tạo:</strong> {new Date(userData.created_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                )}
                {userData.updated_at && (
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <p className="text-[#212121]">
                      <strong>Cập nhật lần cuối:</strong> {new Date(userData.updated_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                )}
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
                  className="w-full h-14 border-2 border-[#0D47A1]/30 text-[#0D47A1]"
                  onClick={() => navigate(`/admin/accounts/${id}/reset-password`)}
                >
                  <Key className="w-5 h-5 mr-2" />
                  Đặt lại Mật khẩu
                </Button>

                <Button
                  variant="outline"
                  className={`w-full h-14 border-2 ${userData.active ? 'border-[#FBC02D]/30 text-[#FBC02D]' : 'border-[#1B5E20]/30 text-[#1B5E20]'}`}
                  onClick={handleToggleActive}
                  disabled={saving}
                >
                  {userData.active ? 'Khóa Tài khoản' : 'Mở khóa Tài khoản'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                  disabled={saving}
                >
                  Hủy
                </Button>

                <div className="pt-3 border-t border-[#212121]/10">
                  <Button
                    variant="outline"
                    className="w-full h-14 border-2 border-[#B71C1C]/30 text-[#B71C1C] hover:bg-[#B71C1C]/10"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Xóa Tài khoản
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
