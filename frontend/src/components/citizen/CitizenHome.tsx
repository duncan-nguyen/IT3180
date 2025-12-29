import { LogOut, MessageSquarePlus, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { feedbackClient, residentsClient } from '../../api/client';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface CitizenHomeProps {
  userName: string;
  onLogout: () => void;
}

interface HouseholdMember {
  id: string;
  full_name: string;
  date_of_birth: string;
  relationship_to_head: string;
}

interface FeedbackItem {
  id: string;
  content: string;
  status: string;
  created_at: string;
  category?: string;
}

export default function CitizenHome({ userName, onLogout }: CitizenHomeProps) {
  const navigate = useNavigate();
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [householdId, setHouseholdId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Household Info - handle error independently
      try {
        const householdRes = await residentsClient.get('/households/me/info');
        if (householdRes.data.data) {
          const hh = householdRes.data.data;
          setHouseholdId(hh.household_number || hh.id);
          setMembers(hh.nhan_khau || []);
        }
      } catch (error) {
        console.error("Error fetching household data:", error);
        // Continue to fetch feedback even if household fails
      }

      // Fetch Feedbacks - handle error independently
      try {
        const feedbackRes = await feedbackClient.get('/feedback');
        // Backend returns list directly: [{ stt_feedback: "1", data: {...} }]
        if (Array.isArray(feedbackRes.data)) {
          const fbList = feedbackRes.data.map((item: any) => item.data);
          setFeedbacks(fbList);
        }
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    const s = status?.toUpperCase();
    if (s === 'DA_GIAI_QUYET') return 'bg-[#1B5E20] text-white';
    if (s === 'DANG_XU_LY') return 'bg-[#0D47A1] text-white';
    return 'bg-[#FBC02D] text-[#212121]';
  };

  const getStatusDisplay = (status: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case 'MOI_GHI_NHAN': return 'Mới ghi nhận';
      case 'DANG_XU_LY': return 'Đang xử lý';
      case 'DA_GIAI_QUYET': return 'Đã giải quyết';
      case 'DONG': return 'Đã đóng';
      default: return status;
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#212121]/10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-[#212121] text-xl font-bold">
            Chào mừng {userName}
          </h1>
          <div className="flex items-center gap-3">
            <Link to="/citizen/profile">
              <Button
                variant="outline"
                className="h-14 px-6 border-2 border-[#0D47A1]/30 hover:bg-[#0D47A1]/5 text-[#0D47A1]"
              >
                <User className="w-6 h-6 mr-3" />
                Thông tin cá nhân
              </Button>
            </Link>
            <Button
              onClick={onLogout}
              variant="outline"
              className="h-14 px-6 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
            >
              <LogOut className="w-6 h-6 mr-3" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-10">Đang tải dữ liệu...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Household Information Card */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader className="space-y-4 pb-6">
                <div className="flex items-center gap-4">
                  <Users className="w-8 h-8 text-[#0D47A1]" />
                  <CardTitle className="text-[#212121]">
                    Gia đình của bạn
                  </CardTitle>
                </div>
                <p className="text-[#212121]">
                  Hộ khẩu số: <strong>{householdId}</strong>
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {members.length > 0 ? members.map((member) => (
                    <div
                      key={member.id}
                      className="p-6 bg-[#F5F5F5] rounded-lg space-y-2"
                    >
                      <p className="text-[#212121]">
                        <strong>Họ và tên:</strong> {member.full_name}
                      </p>
                      <p className="text-[#212121]">
                        <strong>Ngày sinh:</strong> {formatDate(member.date_of_birth)}
                      </p>
                      <p className="text-[#212121]">
                        <strong>Quan hệ với chủ hộ:</strong> {member.relationship_to_head}
                      </p>
                    </div>
                  )) : (
                    <p>Chưa có thông tin thành viên.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Card */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader className="space-y-4 pb-6">
                <div className="flex items-center gap-4">
                  <MessageSquarePlus className="w-8 h-8 text-[#0D47A1]" />
                  <CardTitle className="text-[#212121]">
                    Phản ánh, Kiến nghị
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Link to="/citizen/submit-feedback">
                  <Button className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white">
                    <MessageSquarePlus className="w-6 h-6 mr-3" />
                    Gửi Kiến nghị Mới
                  </Button>
                </Link>

                <div className="space-y-4">
                  <h3 className="text-[#212121]">
                    Kiến nghị đã gửi
                  </h3>
                  {feedbacks.length > 0 ? feedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="p-6 bg-[#F5F5F5] rounded-lg space-y-3"
                    >
                      <p className="text-[#212121] font-medium">
                        {feedback.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(feedback.status) + ' px-4 py-2'}>
                          {getStatusDisplay(feedback.status)}
                        </Badge>
                        <span className="text-[#212121] text-sm">{formatDate(feedback.created_at)}</span>
                      </div>
                    </div>
                  )) : (
                    <p>Bạn chưa gửi kiến nghị nào.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
