import { ArrowLeft, CheckCircle, Clock, MapPin, Monitor, Shield, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuditLog, logsService } from '../../services/logs-service';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import AdminLayout from './AdminLayout';

interface AdminLogDetailProps {
  onLogout: () => void;
}

// Helper to format timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Helper to get Vietnamese role name
const getRoleDisplayName = (role: string | null): string => {
  if (!role) return 'Unknown';
  const roleMap: Record<string, string> = {
    'admin': 'Admin',
    'can_bo_phuong': 'Cán bộ',
    'to_truong': 'Tổ trưởng',
    'nguoi_dan': 'Người dân',
  };
  return roleMap[role] || role;
};

// Helper to get action type display name
const getActionTypeDisplay = (action: string): string => {
  const actionMap: Record<string, string> = {
    'CREATE_USER': 'Tạo tài khoản',
    'UPDATE_USER': 'Cập nhật tài khoản',
    'DELETE_USER': 'Xóa tài khoản',
    'LOCK': 'Khóa tài khoản',
    'UNLOCK': 'Mở khóa tài khoản',
    'LOGIN': 'Đăng nhập',
    'LOGOUT': 'Đăng xuất',
    'UPDATE_ROLE': 'Cập nhật vai trò',
  };
  return actionMap[action] || action;
};

// Helper to extract changes from before_state and after_state
const extractChanges = (beforeState: any, afterState: any): Array<{ field: string, oldValue: string, newValue: string }> => {
  const changes: Array<{ field: string, oldValue: string, newValue: string }> = [];

  if (!beforeState && afterState) {
    // New record created
    Object.keys(afterState).forEach(key => {
      if (key !== 'id' && key !== 'password_hash') {
        changes.push({
          field: key,
          oldValue: '-',
          newValue: String(afterState[key] || '-'),
        });
      }
    });
  } else if (beforeState && afterState) {
    // Record updated
    Object.keys(afterState).forEach(key => {
      if (key !== 'id' && key !== 'password_hash' && beforeState[key] !== afterState[key]) {
        changes.push({
          field: key,
          oldValue: String(beforeState[key] || '-'),
          newValue: String(afterState[key] || '-'),
        });
      }
    });
  }

  return changes;
};

export default function AdminLogDetail({ onLogout }: AdminLogDetailProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [log, setLog] = useState<AuditLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const logData = await logsService.getLogDetail(id);
        setLog(logData);
      } catch (error) {
        console.error('Failed to fetch log detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogDetail();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="p-6 flex justify-center items-center min-h-screen">
          <p className="text-[#212121]">Đang tải dữ liệu...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!log) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="p-6">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/logs')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <p className="text-[#212121]">Không tìm thấy nhật ký</p>
        </div>
      </AdminLayout>
    );
  }

  const changes = extractChanges(log.before_state, log.after_state);

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/logs')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[#212121] mb-3">
                Chi tiết Nhật ký #{log.id.substring(0, 8)}
              </h1>
              <p className="text-[#212121]">
                {getActionTypeDisplay(log.action)}
              </p>
            </div>
            <Badge className="bg-[#1B5E20] hover:bg-[#1B5E20]/90 h-10 px-4">
              Thành công
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Details */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin Hành động
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-[#212121] mb-2">Loại hành động</p>
                    <p className="text-[#212121]">
                      {getActionTypeDisplay(log.action)}
                    </p>
                  </div>

                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-[#212121] mb-2">Trạng thái</p>
                    <Badge className="bg-[#1B5E20]">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Thành công
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-2">Đối tượng</p>
                  <p className="text-[#212121]">
                    {log.entity_name}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Changes Made */}
            {changes.length > 0 && (
              <Card className="border-2 border-[#212121]/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#212121]">
                    Các Thay đổi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b-2 border-[#212121]/10">
                        <tr>
                          <th className="text-left p-4 text-[#212121]">Trường</th>
                          <th className="text-left p-4 text-[#212121]">Giá trị cũ</th>
                          <th className="text-left p-4 text-[#212121]">Giá trị mới</th>
                        </tr>
                      </thead>
                      <tbody>
                        {changes.map((change, index) => (
                          <tr key={index} className="border-b border-[#212121]/10">
                            <td className="p-4 text-[#212121]">
                              {change.field}
                            </td>
                            <td className="p-4 text-[#212121]">
                              <span className="text-[#B71C1C]">{change.oldValue}</span>
                            </td>
                            <td className="p-4 text-[#212121]">
                              <span className="text-[#1B5E20]">{change.newValue}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Technical Details */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin Kỹ thuật
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {log.ip_address && (
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-[#0D47A1]" />
                      <p className="text-sm text-[#212121]">Địa chỉ IP</p>
                    </div>
                    <p className="text-[#212121]">
                      {log.ip_address}
                    </p>
                  </div>
                )}

                {log.user_agent && (
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="w-5 h-5 text-[#0D47A1]" />
                      <p className="text-sm text-[#212121]">User Agent</p>
                    </div>
                    <p className="text-sm text-[#212121] break-all">
                      {log.user_agent}
                    </p>
                  </div>
                )}

                {!log.ip_address && !log.user_agent && (
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <p className="text-[#212121]">Không có thông tin kỹ thuật</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* User Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <User className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Người thực hiện
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">Username</p>
                  <p className="text-[#212121]">
                    {log.username || 'Unknown'}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-[#0D47A1]" />
                    <p className="text-sm text-[#212121]">Vai trò</p>
                  </div>
                  <p className="text-[#212121]">
                    {getRoleDisplayName(log.user_role)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Time Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                    <Clock className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thời gian
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">Ngày giờ</p>
                  <p className="text-[#212121]">
                    {formatTimestamp(log.timestamp)}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">Múi giờ</p>
                  <p className="text-[#212121]">
                    UTC+7 (Giờ Việt Nam)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hành động
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/logs')}
                  className="w-full h-12 border-2 border-[#212121]/20"
                >
                  Quay lại Danh sách
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}