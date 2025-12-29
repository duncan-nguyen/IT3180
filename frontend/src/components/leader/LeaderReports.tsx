import { AlertCircle, Loader2, MessageSquare, TrendingUp, UserCircle, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import statisticsService, {
    DemographicsData,
    FeedbackCategoryItem,
    FeedbackStatusItem,
    HouseholdTrendItem,
    OverviewStats,
    ProcessingTimeItem,
} from '../../services/statistics-service';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import LeaderLayout from './LeaderLayout';

interface LeaderReportsProps {
  onLogout: () => void;
}

const COLORS = ['#0D47A1', '#1B5E20', '#FBC02D', '#B71C1C', '#212121'];

export default function LeaderReports({ onLogout }: LeaderReportsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats data
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [householdTrend, setHouseholdTrend] = useState<HouseholdTrendItem[]>([]);
  const [feedbackByCategory, setFeedbackByCategory] = useState<FeedbackCategoryItem[]>([]);
  const [feedbackByStatus, setFeedbackByStatus] = useState<{ data: FeedbackStatusItem[]; total: number } | null>(null);
  const [demographics, setDemographics] = useState<DemographicsData | null>(null);
  const [processingTime, setProcessingTime] = useState<ProcessingTimeItem[]>([]);

  useEffect(() => {
    loadAllStatistics();
  }, []);

  const loadAllStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all statistics in parallel
      const [
        overviewData,
        trendData,
        categoryData,
        statusData,
        demographicsData,
        processingTimeData,
      ] = await Promise.all([
        statisticsService.getOverview(),
        statisticsService.getHouseholdTrend(5),
        statisticsService.getFeedbackByCategory(),
        statisticsService.getFeedbackByStatus(),
        statisticsService.getResidentDemographics(),
        statisticsService.getFeedbackProcessingTime(),
      ]);

      setOverview(overviewData);
      setHouseholdTrend(trendData);
      setFeedbackByCategory(categoryData);
      setFeedbackByStatus(statusData);
      setDemographics(demographicsData);
      setProcessingTime(processingTimeData);
    } catch (err: any) {
      console.error('Error loading statistics:', err);
      setError(err.response?.data?.detail?.error?.message || 'Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LeaderLayout onLogout={onLogout}>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
          <span className="ml-2 text-[#212121]">Đang tải dữ liệu thống kê...</span>
        </div>
      </LeaderLayout>
    );
  }

  if (error) {
    return (
      <LeaderLayout onLogout={onLogout}>
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
      </LeaderLayout>
    );
  }

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#212121] mb-3">Báo cáo Thống kê</h1>
          <p className="text-[#212121]">Tổng quan số liệu Tổ 5, Phường Đống Đa</p>
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
                  <p className="text-3xl text-[#212121]">{overview?.total_households || 0}</p>
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
                  <p className="text-3xl text-[#212121]">{overview?.total_residents || 0}</p>
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

          <Card className="border-2 border-[#212121]/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-[#1B5E20]/10">
                  <TrendingUp className="w-8 h-8 text-[#1B5E20]" />
                </div>
                <div>
                  <p className="text-[#212121] mb-1">Tỷ lệ giải quyết</p>
                  <p className="text-3xl text-[#212121]">{overview?.resolution_rate || 0}%</p>
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
              <CardTitle className="text-[#212121]">Biến động Hộ khẩu 5 tháng gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={householdTrend}>
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
              <CardTitle className="text-[#212121]">Phân loại Kiến nghị theo Lĩnh vực</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={feedbackByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {feedbackByCategory.map((_entry, index) => (
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
              <CardTitle className="text-[#212121]">Thống kê chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age Distribution */}
                <div className="space-y-4">
                  <h3 className="text-[#212121]">Theo Độ tuổi</h3>
                  <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                    {demographics?.age_distribution.map((item, index) => (
                      <p key={index} className="text-[#212121]">
                        <strong>{item.group}:</strong> {item.count} người ({item.percentage}%)
                      </p>
                    ))}
                  </div>
                </div>

                {/* Gender Distribution */}
                <div className="space-y-4">
                  <h3 className="text-[#212121]">Theo Giới tính</h3>
                  <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                    {demographics?.gender_distribution.map((item, index) => (
                      <p key={index} className="text-[#212121]">
                        <strong>{item.gender}:</strong> {item.count} người ({item.percentage}%)
                      </p>
                    ))}
                  </div>
                </div>

                {/* Feedback Status */}
                <div className="space-y-4">
                  <h3 className="text-[#212121]">Tình trạng Kiến nghị</h3>
                  <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                    {feedbackByStatus?.data.map((item, index) => (
                      <p key={index} className="text-[#212121]">
                        <strong>{item.name}:</strong> {item.count} kiến nghị ({item.percentage}%)
                      </p>
                    ))}
                    {(!feedbackByStatus?.data || feedbackByStatus.data.length === 0) && (
                      <p className="text-[#212121]">Chưa có dữ liệu</p>
                    )}
                  </div>
                </div>

                {/* Processing Time */}
                <div className="space-y-4">
                  <h3 className="text-[#212121]">Thời gian xử lý trung bình</h3>
                  <div className="p-6 bg-[#F5F5F5] rounded-lg space-y-2">
                    {processingTime.map((item, index) => (
                      <p key={index} className="text-[#212121]">
                        <strong>{item.category}:</strong> {item.avg_days} ngày
                      </p>
                    ))}
                    {processingTime.length === 0 && (
                      <p className="text-[#212121]">Chưa có dữ liệu</p>
                    )}
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
