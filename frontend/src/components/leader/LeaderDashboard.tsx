import LeaderLayout from './LeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, UserCircle, MessageSquare } from 'lucide-react';

interface LeaderDashboardProps {
  userName: string;
  onLogout: () => void;
}

export default function LeaderDashboard({ userName, onLogout }: LeaderDashboardProps) {
  const stats = [
    {
      icon: Users,
      label: 'Tổng số Hộ khẩu',
      value: '156',
      color: 'text-[#0D47A1]',
      bgColor: 'bg-[#0D47A1]/10',
    },
    {
      icon: UserCircle,
      label: 'Tổng số Nhân khẩu',
      value: '542',
      color: 'text-[#0D47A1]',
      bgColor: 'bg-[#0D47A1]/10',
    },
    {
      icon: MessageSquare,
      label: 'Kiến nghị Mới (chưa xử lý)',
      value: '12',
      color: 'text-[#FBC02D]',
      bgColor: 'bg-[#FBC02D]/10',
    },
  ];

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-3">
            Trang chủ
          </h1>
          <p className="text-[#212121]">
            Chào mừng {userName}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-2 border-[#212121]/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <div className={`p-4 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <span className="text-[#212121]">{stat.label}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-5xl text-[#212121] ml-20">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Info */}
        <div className="mt-8">
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#212121]">
                Thông tin nhanh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121]">
                    <strong>Tổ dân phố:</strong> Tổ 5, Phường Đống Đa
                  </p>
                </div>
                <div className="p-6 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121]">
                    <strong>Ngày cập nhật cuối:</strong> 03/11/2025
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LeaderLayout>
  );
}
