import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, MessageSquarePlus, LogOut } from 'lucide-react';
import { Badge } from '../ui/badge';

interface CitizenHomeProps {
  userName: string;
  onLogout: () => void;
}

const mockHouseholdMembers = [
  { id: 1, name: 'Nguyễn Văn An', dob: '15/03/1985', relation: 'Chủ hộ' },
  { id: 2, name: 'Trần Thị Bình', dob: '22/07/1987', relation: 'Vợ' },
  { id: 3, name: 'Nguyễn Văn Cường', dob: '10/05/2010', relation: 'Con trai' },
  { id: 4, name: 'Nguyễn Thị Dung', dob: '18/09/2015', relation: 'Con gái' },
];

const mockFeedbacks = [
  { id: 1, title: 'Đèn đường hỏng', status: 'Đang xử lý', date: '01/11/2025' },
  { id: 2, title: 'Vệ sinh môi trường khu vực công cộng', status: 'Đã giải quyết', date: '25/10/2025' },
  { id: 3, title: 'Xe máy đậu lấn chiếm vỉa hè', status: 'Mới gửi', date: '28/10/2025' },
];

export default function CitizenHome({ userName, onLogout }: CitizenHomeProps) {
  const getStatusColor = (status: string) => {
    if (status === 'Đã giải quyết') return 'bg-[#1B5E20] text-white';
    if (status === 'Đang xử lý') return 'bg-[#0D47A1] text-white';
    return 'bg-[#FBC02D] text-[#212121]';
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#212121]/10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-[#212121]">
            Chào mừng {userName}
          </h1>
          <Button
            onClick={onLogout}
            variant="outline"
            className="h-14 px-6 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
          >
            <LogOut className="w-6 h-6 mr-3" />
            Đăng xuất
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
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
                Hộ khẩu số: <strong>HK-001</strong>
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockHouseholdMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-6 bg-[#F5F5F5] rounded-lg space-y-2"
                  >
                    <p className="text-[#212121]">
                      <strong>Họ và tên:</strong> {member.name}
                    </p>
                    <p className="text-[#212121]">
                      <strong>Ngày sinh:</strong> {member.dob}
                    </p>
                    <p className="text-[#212121]">
                      <strong>Quan hệ với chủ hộ:</strong> {member.relation}
                    </p>
                  </div>
                ))}
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
                {mockFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="p-6 bg-[#F5F5F5] rounded-lg space-y-3"
                  >
                    <p className="text-[#212121]">
                      <strong>{feedback.title}</strong>
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(feedback.status) + ' px-4 py-2'}>
                        {feedback.status}
                      </Badge>
                      <span className="text-[#212121]">{feedback.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
