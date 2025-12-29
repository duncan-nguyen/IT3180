import { AlertCircle, ArrowLeft, CheckCircle2, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CitizenSelfUpdateData, residentsService } from '../../services/residents-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface CitizenProfileProps {
  onLogout: () => void;
}

export default function CitizenProfile({ onLogout }: CitizenProfileProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Citizen info - read only
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [cccdNumber, setCccdNumber] = useState('');
  const [cccdIssueDate, setCccdIssueDate] = useState('');
  const [cccdIssuePlace, setCccdIssuePlace] = useState('');
  const [relationshipToHead, setRelationshipToHead] = useState('');
  const [residenceRegistrationDate, setResidenceRegistrationDate] = useState('');
  
  // Editable fields
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [hometown, setHometown] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [workplace, setWorkplace] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await residentsService.getMyInfo();
        
        // Read-only fields
        setFullName(data.full_name || '');
        setDateOfBirth(data.date_of_birth || '');
        setCccdNumber(data.cccd_number || '');
        setCccdIssueDate(data.cccd_issue_date || '');
        setCccdIssuePlace(data.cccd_issue_place || '');
        setRelationshipToHead(data.relationship_to_head || '');
        setResidenceRegistrationDate(data.residence_registration_date || '');
        
        // Editable fields
        setPlaceOfBirth(data.place_of_birth || '');
        setHometown(data.hometown || '');
        setEthnicity(data.ethnicity || '');
        setOccupation(data.occupation || '');
        setWorkplace(data.workplace || '');
      } catch (err: any) {
        console.error('Error fetching citizen info:', err);
        setError('Không thể tải thông tin cá nhân. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData: CitizenSelfUpdateData = {};
      
      // Only include fields that have values
      if (placeOfBirth) updateData.place_of_birth = placeOfBirth;
      if (hometown) updateData.hometown = hometown;
      if (ethnicity) updateData.ethnicity = ethnicity;
      if (occupation) updateData.occupation = occupation;
      if (workplace) updateData.workplace = workplace;

      await residentsService.updateMyInfo(updateData);
      setSuccess('Cập nhật thông tin thành công!');
    } catch (err: any) {
      console.error('Error updating citizen info:', err);
      const errorMessage = err.response?.data?.detail?.error?.message 
        || err.response?.data?.detail 
        || 'Không thể cập nhật thông tin. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#212121]/10 p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/citizen">
              <Button variant="outline" className="h-10 px-4 border-2 border-[#212121]/20">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại
              </Button>
            </Link>
            <h1 className="text-[#212121] text-xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Thông tin cá nhân
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-10">Đang tải dữ liệu...</div>
        ) : (
          <div className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-green-700">{success}</span>
              </div>
            )}

            {/* Read-only Information Card */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">Thông tin không thể chỉnh sửa</CardTitle>
                <p className="text-sm text-gray-500">
                  Các thông tin dưới đây chỉ được cập nhật bởi cơ quan có thẩm quyền
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Họ và tên</Label>
                    <div className="p-3 bg-gray-100 rounded-lg text-[#212121] font-medium">
                      {fullName || '-'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Ngày sinh</Label>
                    <div className="p-3 bg-gray-100 rounded-lg text-[#212121]">
                      {formatDate(dateOfBirth) || '-'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Số CCCD</Label>
                    <div className="p-3 bg-gray-100 rounded-lg text-[#212121] font-mono">
                      {cccdNumber || '-'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Ngày cấp CCCD</Label>
                    <div className="p-3 bg-gray-100 rounded-lg text-[#212121]">
                      {formatDate(cccdIssueDate) || '-'}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-500">Nơi cấp CCCD</Label>
                    <div className="p-3 bg-gray-100 rounded-lg text-[#212121]">
                      {cccdIssuePlace || '-'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Quan hệ với chủ hộ</Label>
                    <div className="p-3 bg-gray-100 rounded-lg text-[#212121]">
                      {relationshipToHead || '-'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Ngày đăng ký thường trú</Label>
                    <div className="p-3 bg-gray-100 rounded-lg text-[#212121]">
                      {formatDate(residenceRegistrationDate) || '-'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Editable Information Card */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0D47A1]">Thông tin có thể chỉnh sửa</CardTitle>
                <p className="text-sm text-gray-500">
                  Bạn có thể tự cập nhật các thông tin dưới đây
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="placeOfBirth">Nơi sinh</Label>
                    <Input
                      id="placeOfBirth"
                      value={placeOfBirth}
                      onChange={(e) => setPlaceOfBirth(e.target.value)}
                      placeholder="VD: Bệnh viện Bạch Mai, Hà Nội"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hometown">Nguyên quán</Label>
                    <Input
                      id="hometown"
                      value={hometown}
                      onChange={(e) => setHometown(e.target.value)}
                      placeholder="VD: Xã ABC, Huyện XYZ, Tỉnh..."
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ethnicity">Dân tộc</Label>
                    <Input
                      id="ethnicity"
                      value={ethnicity}
                      onChange={(e) => setEthnicity(e.target.value)}
                      placeholder="VD: Kinh"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="occupation">Nghề nghiệp</Label>
                    <Input
                      id="occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="VD: Kỹ sư phần mềm"
                      className="h-12"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="workplace">Nơi làm việc</Label>
                    <Input
                      id="workplace"
                      value={workplace}
                      onChange={(e) => setWorkplace(e.target.value)}
                      placeholder="VD: Công ty ABC, 123 Đường XYZ, Quận..."
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-12 px-6 bg-[#0D47A1] hover:bg-[#0D47A1]/90"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Change Password Link */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[#212121] font-medium">Đổi mật khẩu</h3>
                    <p className="text-sm text-gray-500">
                      Bảo mật tài khoản bằng cách thay đổi mật khẩu định kỳ
                    </p>
                  </div>
                  <Link to="/citizen/change-password">
                    <Button variant="outline" className="h-12 px-6 border-2 border-[#212121]/20">
                      Đổi mật khẩu
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
