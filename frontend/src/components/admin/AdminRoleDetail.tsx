import { ArrowLeft, Loader2, Save, Shield, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoleDetail, rolesService } from '../../services/roles-service';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import AdminLayout from './AdminLayout';

interface AdminRoleDetailProps {
  onLogout: () => void;
}

export default function AdminRoleDetail({ onLogout }: AdminRoleDetailProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [roleDetail, setRoleDetail] = useState<RoleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadRoleDetail();
    }
  }, [id]);

  const loadRoleDetail = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await rolesService.getRoleDetail(id);
      setRoleDetail(data);
    } catch (err) {
      setError('Không thể tải thông tin vai trò. Vui lòng thử lại.');
      console.error('Error loading role detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !roleDetail) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="p-6">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/roles')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error || 'Không tìm thấy vai trò'}
          </div>
          <Button onClick={loadRoleDetail} className="mt-4">
            Thử lại
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const totalPermissions = roleDetail.permissions.reduce(
    (sum, category) => sum + category.items.length,
    0
  );
  const enabledPermissions = roleDetail.permissions.reduce(
    (sum, category) => sum + category.items.filter(p => p.enabled).length,
    0
  );
  const disabledPermissions = totalPermissions - enabledPermissions;

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/roles')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[#212121] mb-3">
                Chi tiết Vai trò: {roleDetail.name}
              </h1>
              <p className="text-[#212121]">
                {roleDetail.description}
              </p>
            </div>
            <Badge
              variant="outline"
              className="h-10 px-4 border-2 text-[#212121]"
            >
              {roleDetail.code}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Permissions List */}
          <div className="lg:col-span-2 space-y-6">
            {roleDetail.permissions.map((category, index) => (
              <Card key={index} className="border-2 border-[#212121]/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#212121]">
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.items.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg"
                    >
                      <div>
                        <p className="text-[#212121]">
                          {permission.name}
                        </p>
                      </div>
                      <Switch defaultChecked={permission.enabled} disabled />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Role Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${roleDetail.color}20` }}
                  >
                    <Shield className="w-6 h-6" style={{ color: roleDetail.color }} />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Vai trò
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">Tên vai trò</p>
                  <p className="text-[#212121]">
                    {roleDetail.name}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">Mã vai trò</p>
                  <p className="text-[#212121]">
                    {roleDetail.code}
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                  <Users className="w-6 h-6 text-[#0D47A1]" />
                  <div>
                    <p className="text-sm text-[#212121]">Số người dùng</p>
                    <p className="text-xl text-[#212121]">
                      {roleDetail.user_count} tài khoản
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  disabled
                >
                  <Save className="w-5 h-5 mr-2" />
                  Lưu Quyền hạn
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/roles')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                >
                  Quay lại
                </Button>
              </CardContent>
            </Card>

            {/* Permission Summary */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Tóm tắt Quyền hạn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="text-[#212121]">Tổng quyền:</span>
                  <span className="text-[#212121]">{totalPermissions}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="text-[#212121]">Đã bật:</span>
                  <span className="text-[#1B5E20]">{enabledPermissions}</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span className="text-[#212121]">Đã tắt:</span>
                  <span className="text-[#B71C1C]">{disabledPermissions}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
