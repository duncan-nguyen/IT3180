import { MessageSquare, UserCircle, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { countHouseholds, countResidents } from '../api_caller/port8018';
import { getFeedbackList } from '../api_caller/port8019';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import LeaderLayout from './LeaderLayout';

interface LeaderDashboardProps {
  userName: string;
  onLogout: () => void;
}

export default function LeaderDashboard({ userName, onLogout }: LeaderDashboardProps) {
  const [householdCount, setHouseholdCount] = useState<number | null>(null);
  const [residentCount, setResidentCount] = useState<number | null>(null);
  const [newFeedbackCount, setNewFeedbackCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('access_token') || '';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const scopeId = user.scope_id;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch counts in parallel
      const [households, residents, feedbacks] = await Promise.all([
        countHouseholds(token, { to_id: scopeId }),
        countResidents(token, { to_id: scopeId }),
        getFeedbackList(token, { status: 'MOI_GHI_NHAN' }),
      ]);

      setHouseholdCount(households.count || 0);
      setResidentCount(residents.count || 0);
      
      // Count new feedbacks
      if (Array.isArray(feedbacks)) {
        setNewFeedbackCount(feedbacks.length);
      } else if (feedbacks.count !== undefined) {
        setNewFeedbackCount(feedbacks.count);
      } else {
        setNewFeedbackCount(0);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Không thể tải dữ liệu tổng quan. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      icon: Users,
      label: 'Tổng số Hộ khẩu',
      value: householdCount !== null ? householdCount.toString() : '--',
      color: 'text-[#0D47A1]',
      bgColor: 'bg-[#0D47A1]/10',
    },
    {
      icon: UserCircle,
      label: 'Tổng số Nhân khẩu',
      value: residentCount !== null ? residentCount.toString() : '--',
      color: 'text-[#0D47A1]',
      bgColor: 'bg-[#0D47A1]/10',
    },
    {
      icon: MessageSquare,
      label: 'Kiến nghị Mới (chưa xử lý)',
      value: newFeedbackCount !== null ? newFeedbackCount.toString() : '--',
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

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                  {isLoading ? (
                    <Skeleton className="h-16 w-32 ml-20" />
                  ) : (
                    <p className="text-5xl text-[#212121] ml-20">
                      {stat.value}
                    </p>
                  )}
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
                    <strong>Phạm vi quản lý:</strong> {scopeId || 'Chưa xác định'}
                  </p>
                </div>
                <div className="p-6 bg-[#F5F5F5] rounded-lg">
                  <p className="text-[#212121]">
                    <strong>Ngày cập nhật cuối:</strong> {new Date().toLocaleDateString('vi-VN')}
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