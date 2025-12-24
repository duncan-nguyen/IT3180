import OfficialLayout from './OfficialLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, UserCircle, MessageSquare, Building2 } from 'lucide-react';

interface OfficialReportsProps {
  userName: string;
  onLogout: () => void;
}

const feedbackTrendData = [
  { month: 'Tháng 7', total: 45, resolved: 38 },
  { month: 'Tháng 8', total: 52, resolved: 47 },
  { month: 'Tháng 9', total: 48, resolved: 43 },
  { month: 'Tháng 10', total: 56, resolved: 50 },
  { month: 'Tháng 11', total: 61, resolved: 53 },
];

const feedbackByAreaData = [
  { area: 'Tổ 1', count: 8 },
  { area: 'Tổ 2', count: 12 },
  { area: 'Tổ 3', count: 15 },
  { area: 'Tổ 4', count: 10 },
  { area: 'Tổ 5', count: 23 },
  { area: 'Tổ 6', count: 9 },
  { area: 'Tổ 7', count: 14 },
];

export default function OfficialReports({ userName, onLogout }: OfficialReportsProps) {
  return (
    <OfficialLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-3">
            Báo cáo Toàn phường
          </h1>
          <p className="text-[#212121]">
            Tổng quan số liệu Phường Đống Đa - Chào mừng {userName}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-[#0D47A1]/10">
                  <Building2 className="w-8 h-8 text-[#0D47A1]" />
                </div>
                <div>
                  <p className="text-[#212121] mb-1">Tổng số Tổ</p>
                  <p className="text-3xl text-[#212121]">7</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-[#0D47A1]/10">
                  <Users className="w-8 h-8 text-[#0D47A1]" />
                </div>
                <div>
                  <p className="text-[#212121] mb-1">Tổng Hộ khẩu</p>
                  <p className="text-3xl text-[#212121]">1,245</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-[#0D47A1]/10">
                  <UserCircle className="w-8 h-8 text-[#0D47A1]" />
                </div>
                <div>
                  <p className="text-[#212121] mb-1">Tổng Nhân khẩu</p>
                  <p className="text-3xl text-[#212121]">4,328</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-[#1B5E20]/10">
                  <MessageSquare className="w-8 h-8 text-[#1B5E20]" />
                </div>
                <div>
                  <p className="text-[#212121] mb-1">Kiến nghị tháng này</p>
                  <p className="text-3xl text-[#212121]">61</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Feedback Trend Chart */}
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#212121]">
                Xu hướng Kiến nghị 5 tháng gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={feedbackTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" style={{ fontSize: '14px' }} />
                  <YAxis style={{ fontSize: '14px' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#0D47A1" strokeWidth={2} name="Tổng kiến nghị" />
                  <Line type="monotone" dataKey="resolved" stroke="#1B5E20" strokeWidth={2} name="Đã giải quyết" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Feedback by Area Chart */}
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#212121]">
                Kiến nghị theo Tổ dân phố (Tháng 11)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={feedbackByAreaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" style={{ fontSize: '14px' }} />
                  <YAxis style={{ fontSize: '14px' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#0D47A1" name="Số kiến nghị" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#212121]">
                Thống kê theo Cơ quan phản hồi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Công an Phường:</strong> 22 kiến nghị
                  </p>
                  <p className="text-[#212121] text-sm">
                    Đã phản hồi: 20 | Chờ phản hồi: 2
                  </p>
                </div>

                <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Điện lực:</strong> 18 kiến nghị
                  </p>
                  <p className="text-[#212121] text-sm">
                    Đã phản hồi: 16 | Chờ phản hồi: 2
                  </p>
                </div>

                <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Môi trường & Đô thị:</strong> 15 kiến nghị
                  </p>
                  <p className="text-[#212121] text-sm">
                    Đã phản hồi: 13 | Chờ phản hồi: 2
                  </p>
                </div>

                <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Giao thông Vận tải:</strong> 6 kiến nghị
                  </p>
                  <p className="text-[#212121] text-sm">
                    Đã phản hồi: 4 | Chờ phản hồi: 2
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#212121]">
                Hiệu quả xử lý
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Tổng kiến nghị năm 2025:</strong> 542
                  </p>
                </div>

                <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Đã giải quyết:</strong> 487 (90%)
                  </p>
                </div>

                <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Đang xử lý:</strong> 47 (9%)
                  </p>
                </div>

                <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Chưa xử lý:</strong> 8 (1%)
                  </p>
                </div>

                <div className="p-6 bg-[#1B5E20]/10 rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Thời gian phản hồi trung bình:</strong> 4.5 ngày
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </OfficialLayout>
  );
}
