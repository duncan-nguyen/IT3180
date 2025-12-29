import { AlertCircle, Building2, Loader2, MessageSquare, UserCircle, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import statisticsService, {
    FeedbackByAgencyItem,
    FeedbackByAreaItem,
    FeedbackTrendItem,
    WardEfficiencyStats,
    WardOverviewStats,
} from '../../services/statistics-service';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import OfficialLayout from './OfficialLayout';

interface OfficialReportsProps {
  userName: string;
  onLogout: () => void;
}

export default function OfficialReports({ userName, onLogout }: OfficialReportsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats data
  const [overview, setOverview] = useState<WardOverviewStats | null>(null);
  const [feedbackTrend, setFeedbackTrend] = useState<FeedbackTrendItem[]>([]);
  const [feedbackByArea, setFeedbackByArea] = useState<{ data: FeedbackByAreaItem[]; month: number } | null>(null);
  const [feedbackByAgency, setFeedbackByAgency] = useState<FeedbackByAgencyItem[]>([]);
  const [efficiency, setEfficiency] = useState<WardEfficiencyStats | null>(null);

  useEffect(() => {
    loadAllStatistics();
  }, []);

  const loadAllStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all statistics in parallel
      const [overviewData, trendData, areaData, agencyData, efficiencyData] = await Promise.all([
        statisticsService.getWardOverview(),
        statisticsService.getWardFeedbackTrend(5),
        statisticsService.getWardFeedbackByArea(),
        statisticsService.getWardFeedbackByAgency(),
        statisticsService.getWardEfficiency(),
      ]);

      setOverview(overviewData);
      setFeedbackTrend(trendData);
      setFeedbackByArea(areaData);
      setFeedbackByAgency(agencyData);
      setEfficiency(efficiencyData);
    } catch (err: any) {
      console.error('Error loading statistics:', err);
      setError(err.response?.data?.detail?.error?.message || 'Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <OfficialLayout onLogout={onLogout}>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
          <span className="ml-2 text-[#212121]">Đang tải dữ liệu thống kê...</span>
        </div>
      </OfficialLayout>
    );
  }

  if (error) {
    return (
      <OfficialLayout onLogout={onLogout}>
        <div className="p-6">
          <Card className="border-2 border-[#B71C1C]/20 bg-[#B71C1C]/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-[#B71C1C]">
                <AlertCircle className="w-6 h-6" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </OfficialLayout>
    );
  }

  return (
    <OfficialLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-3">Báo cáo Toàn phường</h1>
          <p className="text-[#212121]">Tổng quan số liệu Phường Đống Đa - Chào mừng {userName}</p>
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
                  <p className="text-3xl text-[#212121]">{overview?.total_groups || 0}</p>
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
                  <p className="text-3xl text-[#212121]">
                    {overview?.total_households?.toLocaleString() || 0}
                  </p>
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
                  <p className="text-3xl text-[#212121]">
                    {overview?.total_residents?.toLocaleString() || 0}
                  </p>
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
                  <p className="text-3xl text-[#212121]">{overview?.feedback_this_month || 0}</p>
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
              <CardTitle className="text-[#212121]">Xu hướng Kiến nghị 5 tháng gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={feedbackTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" style={{ fontSize: '14px' }} />
                  <YAxis style={{ fontSize: '14px' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#0D47A1"
                    strokeWidth={2}
                    name="Tổng kiến nghị"
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#1B5E20"
                    strokeWidth={2}
                    name="Đã giải quyết"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Feedback by Area Chart */}
          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#212121]">
                Kiến nghị theo Tổ dân phố (Tháng {feedbackByArea?.month || new Date().getMonth() + 1})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={feedbackByArea?.data || []}>
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
              <CardTitle className="text-[#212121]">Thống kê theo Cơ quan phản hồi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackByAgency.length > 0 ? (
                  feedbackByAgency.map((item, index) => (
                    <div key={index} className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                      <p className="text-[#212121]">
                        <strong>{item.agency}:</strong> {item.total} kiến nghị
                      </p>
                      <p className="text-[#212121] text-sm">
                        Đã phản hồi: {item.resolved} | Chờ phản hồi: {item.pending}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 bg-[#F5F5F5] rounded-lg">
                    <p className="text-[#212121]">Chưa có dữ liệu</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#212121]">Hiệu quả xử lý</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Tổng kiến nghị năm {efficiency?.year || new Date().getFullYear()}:</strong>{' '}
                    {efficiency?.total_year || 0}
                  </p>
                </div>

                <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Đã giải quyết:</strong> {efficiency?.resolved.count || 0} (
                    {efficiency?.resolved.percentage || 0}%)
                  </p>
                </div>

                <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Đang xử lý:</strong> {efficiency?.in_progress.count || 0} (
                    {efficiency?.in_progress.percentage || 0}%)
                  </p>
                </div>

                <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Chưa xử lý:</strong> {efficiency?.pending.count || 0} (
                    {efficiency?.pending.percentage || 0}%)
                  </p>
                </div>

                <div className="p-6 bg-[#1B5E20]/10 rounded-lg space-y-2">
                  <p className="text-[#212121]">
                    <strong>Thời gian phản hồi trung bình:</strong> {efficiency?.avg_response_days || 0} ngày
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
