import LeaderLayout from './LeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCircle, MessageSquare, TrendingUp } from 'lucide-react';

interface LeaderReportsProps {
  onLogout: () => void;
}

const householdData = [
  { month: 'Tháng 7', count: 148 },
  { month: 'Tháng 8', count: 152 },
  { month: 'Tháng 9', count: 154 },
  { month: 'Tháng 10', count: 155 },
  { month: 'Tháng 11', count: 156 },
];

const feedbackCategoryData = [
  { name: 'Hạ tầng', value: 35 },
  { name: 'Môi trường', value: 28 },
  { name: 'An ninh', value: 22 },
  { name: 'Y tế', value: 10 },
  { name: 'Khác', value: 5 },
];

const COLORS = ['#0D47A1', '#1B5E20', '#FBC02D', '#B71C1C', '#212121'];

export default function LeaderReports({ onLogout }: LeaderReportsProps) {
  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-3">
            Báo cáo Thống kê
          </h1>
          <p className="text-[#212121]">
            Tổng quan số liệu Tổ 5, Phường Đống Đa
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-[#0D47A1]/10">
                  <Users className="w-8 h-8 text-[#0D47A1]" />
                </div>
                <div>
                  <p className="text-[#212121] mb-1">Tổng Hộ khẩu</p>
                  <p className="text-3xl text-[#212121]">156</p>
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
                  <p className="text-3xl text-[#212121]">542</p>
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
                  <p className="text-3xl text-[#212121]">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-[#1B5E20]/10">
                  <TrendingUp className="w-8 h-8 text-[#1B5E20]" />
                </div>
                <div>
                  <p className="text-[#212121] mb-1">Tỷ lệ giải quyết</p>
                  <p className="text-3xl text-[#212121]">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Household Growth Chart */}
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#212121]">
                Biến động Hộ khẩu 5 tháng gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={householdData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" style={{ fontSize: '14px' }} />
                  <YAxis style={{ fontSize: '14px' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#0D47A1" name="Số hộ khẩu" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Feedback Category Pie Chart */}
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#212121]">
                Phân loại Kiến nghị theo Lĩnh vực
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={feedbackCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {feedbackCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics */}
        <div className="mt-8">
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#212121]">
                Thống kê chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-[#212121]">Theo Độ tuổi</h3>
                  <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                    <p className="text-[#212121]">
                      <strong>0-15 tuổi:</strong> 98 người (18%)
                    </p>
                    <p className="text-[#212121]">
                      <strong>16-60 tuổi:</strong> 356 người (66%)
                    </p>
                    <p className="text-[#212121]">
                      <strong>Trên 60 tuổi:</strong> 88 người (16%)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[#212121]">Theo Giới tính</h3>
                  <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                    <p className="text-[#212121]">
                      <strong>Nam:</strong> 268 người (49%)
                    </p>
                    <p className="text-[#212121]">
                      <strong>Nữ:</strong> 274 người (51%)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[#212121]">Tình trạng Kiến nghị</h3>
                  <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                    <p className="text-[#212121]">
                      <strong>Đã giải quyết:</strong> 87 kiến nghị (87%)
                    </p>
                    <p className="text-[#212121]">
                      <strong>Đang xử lý:</strong> 10 kiến nghị (10%)
                    </p>
                    <p className="text-[#212121]">
                      <strong>Mới gửi:</strong> 3 kiến nghị (3%)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[#212121]">Thời gian xử lý trung bình</h3>
                  <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                    <p className="text-[#212121]">
                      <strong>Hạ tầng:</strong> 7 ngày
                    </p>
                    <p className="text-[#212121]">
                      <strong>Môi trường:</strong> 5 ngày
                    </p>
                    <p className="text-[#212121]">
                      <strong>An ninh:</strong> 3 ngày
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LeaderLayout>
  );
}
