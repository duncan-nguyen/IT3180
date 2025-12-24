import { Edit, Key, Plus, Unlock, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUsers, lockUser, unlockUser, type UserInfor } from '../api_caller/port8017';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import AdminLayout from './AdminLayout';

interface AdminAccountsProps {
  userName: string;
  onLogout: () => void;
}

export default function AdminAccounts({ userName, onLogout }: AdminAccountsProps) {
  const [users, setUsers] = useState<UserInfor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('access_token') || '';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUsers(token);
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLockUser = async (userId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await lockUser(token, userId);
      } else {
        await unlockUser(token, userId);
      }
      await fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error toggling user lock:', err);
      setError('Không thể thực hiện thao tác. Vui lòng thử lại.');
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': 'Quản trị viên',
      'to_truong': 'Tổ trưởng',
      'can_bo_phuong': 'Cán bộ Phường',
      'nguoi_dan': 'Người dân',
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role: string) => {
    if (role === 'can_bo_phuong') return 'bg-[#0D47A1] text-white';
    if (role === 'to_truong') return 'bg-[#1B5E20] text-white';
    if (role === 'admin') return 'bg-[#B71C1C] text-white';
    return 'bg-[#212121]/20 text-[#212121]';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-[#1B5E20] text-white'
      : 'bg-[#B71C1C] text-white';
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
              <Button className="h-14 px-6 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white">
                <Plus className="w-6 h-6 mr-3" />
                Tạo Tài khoản Mới
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Data Table */}
        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Danh sách Người dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-16 flex-1" />
                    <Skeleton className="h-16 w-32" />
                    <Skeleton className="h-16 w-32" />
                    <Skeleton className="h-16 w-48" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-[#212121]/10">
                    <TableHead className="text-[#212121] h-14">Tên đăng nhập</TableHead>
                    <TableHead className="text-[#212121] h-14">ID Phạm vi</TableHead>
                    <TableHead className="text-[#212121] h-14">Vai trò</TableHead>
                    <TableHead className="text-[#212121] h-14">Trạng thái</TableHead>
                    <TableHead className="text-[#212121] h-14">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-[#212121]/50">
                        Không có người dùng nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="border-b border-[#212121]/10">
                        <TableCell className="text-[#212121] h-16">
                          <strong>{user.username}</strong>
                        </TableCell>
                        <TableCell className="text-[#212121] h-16">{user.scope_id}</TableCell>
                        <TableCell className="h-16">
                          <span className={`px-4 py-2 rounded ${getRoleColor(user.role)}`}>
                            {getRoleDisplayName(user.role)}
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
                            >
                              <Edit className="w-5 h-5 mr-2" />
                              Sửa
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-12 px-4 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
                            >
                              <Key className="w-5 h-5 mr-2" />
                              Đặt lại MK
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleLockUser(user.id, user.active)}
                              className={`h-12 px-4 border-2 ${
                                user.active
                                  ? 'border-[#B71C1C]/30 text-[#B71C1C] hover:bg-[#B71C1C]/10'
                                  : 'border-[#1B5E20]/30 text-[#1B5E20] hover:bg-[#1B5E20]/10'
                              }`}
                            >
                              {user.active ? (
                                <>
                                  <UserX className="w-5 h-5 mr-2" />
                                  Khóa
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-5 h-5 mr-2" />
                                  Mở khóa
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}