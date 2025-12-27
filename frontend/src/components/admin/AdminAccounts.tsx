import AdminLayout from './AdminLayout';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Edit, Key, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminAccountsProps {
  userName: string;
  onLogout: () => void;
}

const mockUsers = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@example.com',
    role: 'Người dân',
    status: 'Đang hoạt động',
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    email: 'tranthibinh@example.com',
    role: 'Tổ trưởng',
    status: 'Đang hoạt động',
  },
  {
    id: 3,
    name: 'Lê Văn Cường',
    email: 'levancuong@example.com',
    role: 'Cán bộ Phường',
    status: 'Đang hoạt động',
  },
  {
    id: 4,
    name: 'Phạm Thị Dung',
    email: 'phamthidung@example.com',
    role: 'Người dân',
    status: 'Tạm khóa',
  },
  {
    id: 5,
    name: 'Hoàng Văn Em',
    email: 'hoangvanem@example.com',
    role: 'Tổ trưởng',
    status: 'Đang hoạt động',
  },
];

export default function AdminAccounts({ userName, onLogout }: AdminAccountsProps) {
  const navigate = useNavigate();

  const getRoleColor = (role: string) => {
    if (role === 'Cán bộ Phường') return 'bg-[#0D47A1] text-white';
    if (role === 'Tổ trưởng') return 'bg-[#1B5E20] text-white';
    return 'bg-[#212121]/20 text-[#212121]';
  };

  const getStatusColor = (status: string) => {
    return status === 'Đang hoạt động'
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
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-[#212121]/10">
                  <TableHead className="text-[#212121] h-14">Họ và tên</TableHead>
                  <TableHead className="text-[#212121] h-14">Email</TableHead>
                  <TableHead className="text-[#212121] h-14">Vai trò</TableHead>
                  <TableHead className="text-[#212121] h-14">Trạng thái</TableHead>
                  <TableHead className="text-[#212121] h-14">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id} className="border-b border-[#212121]/10">
                    <TableCell className="text-[#212121] h-16">
                      <strong>{user.name}</strong>
                    </TableCell>
                    <TableCell className="text-[#212121] h-16">{user.email}</TableCell>
                    <TableCell className="h-16">
                      <span className={`px-4 py-2 rounded ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="h-16">
                      <span className={`px-4 py-2 rounded ${getStatusColor(user.status)}`}>
                        {user.status}
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}