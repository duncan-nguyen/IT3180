import { Edit, Key, Loader2, Plus, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, User } from '../../services/auth-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import AdminLayout from './AdminLayout';

interface AdminAccountsProps {
  userName: string;
  onLogout: () => void;
}

// Role mapping from backend to display
const ROLE_DISPLAY: Record<string, string> = {
  'admin': 'Quản trị viên',
  'to_truong': 'Tổ trưởng',
  'can_bo_phuong': 'Cán bộ Phường',
  'nguoi_dan': 'Người dân',
};

export default function AdminAccounts({ userName, onLogout }: AdminAccountsProps) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await authService.getUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Không thể tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRoleColor = (role: string) => {
    if (role === 'can_bo_phuong') return 'bg-[#0D47A1] text-white';
    if (role === 'to_truong') return 'bg-[#1B5E20] text-white';
    if (role === 'admin') return 'bg-[#B71C1C] text-white';
    return 'bg-[#212121]/20 text-[#212121]';
  };

  const getStatusColor = (active: boolean) => {
    return active
      ? 'bg-[#1B5E20] text-white'
      : 'bg-[#B71C1C] text-white';
  };

  const getRoleDisplay = (role: string) => {
    return ROLE_DISPLAY[role] || role;
  };

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-3">
            Quản lý Tài khoản
          </h1>
          <p className="text-[#212121]">
            Chào mừng {userName}
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-6">
          <Card className="border-2 border-[#212121]/10">
            <CardContent className="p-6">
              <Button
                className="h-14 px-6 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white"
                onClick={() => navigate('/admin/accounts/create')}
              >
                <Plus className="w-6 h-6 mr-3" />
                Tạo Tài khoản Mới
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Danh sách Người dùng
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
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-[#212121]">Chưa có tài khoản nào</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-[#212121]/10">
                    <TableHead className="text-[#212121] h-14">Tên đăng nhập</TableHead>
                    <TableHead className="text-[#212121] h-14">Vai trò</TableHead>
                    <TableHead className="text-[#212121] h-14">Trạng thái</TableHead>
                    <TableHead className="text-[#212121] h-14">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-b border-[#212121]/10">
                      <TableCell className="text-[#212121] h-16">
                        <strong>{user.username}</strong>
                      </TableCell>
                      <TableCell className="h-16">
                        <span className={`px-4 py-2 rounded ${getRoleColor(user.role)}`}>
                          {getRoleDisplay(user.role)}
                        </span>
                      </TableCell>
                      <TableCell className="h-16">
                        <span className={`px-4 py-2 rounded ${getStatusColor(user.active)}`}>
                          {user.active ? 'Đang hoạt động' : 'Tạm khóa'}
                        </span>
                      </TableCell>
                      <TableCell className="h-16">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-12 px-4 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
                            onClick={() => navigate(`/admin/accounts/${user.id}/edit`)}
                          >
                            <Edit className="w-5 h-5 mr-2" />
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-12 px-4 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
                            onClick={() => navigate(`/admin/accounts/${user.id}/reset-password`)}
                          >
                            <Key className="w-5 h-5 mr-2" />
                            Đặt lại MK
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-12 px-4 border-2 border-[#B71C1C]/30 text-[#B71C1C] hover:bg-[#B71C1C]/10"
                            onClick={() => navigate(`/admin/accounts/${user.id}/lock`)}
                          >
                            <UserX className="w-5 h-5 mr-2" />
                            Khóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}