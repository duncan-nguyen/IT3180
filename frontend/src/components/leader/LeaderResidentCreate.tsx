import { AlertCircle, ArrowLeft, Loader2, Save, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { residentsService } from '../../services/residents-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import LeaderLayout from './LeaderLayout';

interface LeaderResidentCreateProps {
  onLogout: () => void;
}

export default function LeaderResidentCreate({ onLogout }: LeaderResidentCreateProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [cccdNumber, setCccdNumber] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ethnic, setEthnic] = useState('');
  const [religion, setReligion] = useState('');
  const [occupation, setOccupation] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [relationshipToHead, setRelationshipToHead] = useState('');
  const [householdId, setHouseholdId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !dateOfBirth || !cccdNumber) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await residentsService.create({
        full_name: fullName,
        date_of_birth: dateOfBirth,
        cccd_number: cccdNumber,
        gender: gender || undefined,
        phone_number: phoneNumber || undefined,
        ethnic: ethnic || undefined,
        religion: religion || undefined,
        occupation: occupation || undefined,
        education_level: educationLevel || undefined,
        relationship_to_head: relationshipToHead || undefined,
        household_id: householdId || undefined,
      });

      alert('Tạo nhân khẩu thành công!');
      navigate('/leader/residents');
    } catch (err: any) {
      console.error('Error creating resident:', err);
      setError(err.response?.data?.detail?.message || 'Không thể tạo nhân khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/leader/residents')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3">Thêm Nhân khẩu Mới</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-[#212121]/10 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                      <User className="w-6 h-6 text-[#0D47A1]" />
                    </div>
                    <CardTitle className="text-[#212121]">Thông tin Cá nhân</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="full-name" className="text-[#212121]">
                      Họ và tên <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="full-name"
                      placeholder="VD: Nguyễn Văn An"
                      className="h-12 border-2 border-[#212121]/20"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="gender" className="text-[#212121]">Giới tính</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger id="gender" className="h-12 border-2 border-[#212121]/20">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="Nữ">Nữ</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="birth-date" className="text-[#212121]">
                        Ngày sinh <span className="text-[#B71C1C]">*</span>
                      </Label>
                      <input
                        id="birth-date"
                        type="date"
                        className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="cccd" className="text-[#212121]">
                        Số CCCD/CMND <span className="text-[#B71C1C]">*</span>
                      </Label>
                      <Input
                        id="cccd"
                        placeholder="VD: 001088012345"
                        className="h-12 border-2 border-[#212121]/20"
                        value={cccdNumber}
                        onChange={(e) => setCccdNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-[#212121]">Số điện thoại</Label>
                      <Input
                        id="phone"
                        placeholder="VD: 0912345678"
                        className="h-12 border-2 border-[#212121]/20"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="ethnic" className="text-[#212121]">Dân tộc</Label>
                      <Input
                        id="ethnic"
                        placeholder="VD: Kinh"
                        className="h-12 border-2 border-[#212121]/20"
                        value={ethnic}
                        onChange={(e) => setEthnic(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="religion" className="text-[#212121]">Tôn giáo</Label>
                      <Input
                        id="religion"
                        placeholder="VD: Không"
                        className="h-12 border-2 border-[#212121]/20"
                        value={religion}
                        onChange={(e) => setReligion(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="occupation" className="text-[#212121]">Nghề nghiệp</Label>
                      <Input
                        id="occupation"
                        placeholder="VD: Kỹ sư"
                        className="h-12 border-2 border-[#212121]/20"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="education" className="text-[#212121]">Trình độ học vấn</Label>
                      <Input
                        id="education"
                        placeholder="VD: Đại học"
                        className="h-12 border-2 border-[#212121]/20"
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="household" className="text-[#212121]">ID Hộ khẩu</Label>
                      <Input
                        id="household"
                        placeholder="Nhập ID hộ khẩu"
                        className="h-12 border-2 border-[#212121]/20"
                        value={householdId}
                        onChange={(e) => setHouseholdId(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="relationship" className="text-[#212121]">Quan hệ với chủ hộ</Label>
                      <Select value={relationshipToHead} onValueChange={setRelationshipToHead}>
                        <SelectTrigger id="relationship" className="h-12 border-2 border-[#212121]/20">
                          <SelectValue placeholder="Chọn quan hệ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chủ hộ">Chủ hộ</SelectItem>
                          <SelectItem value="Vợ/Chồng">Vợ/Chồng</SelectItem>
                          <SelectItem value="Con">Con</SelectItem>
                          <SelectItem value="Bố/Mẹ">Bố/Mẹ</SelectItem>
                          <SelectItem value="Anh/Chị/Em">Anh/Chị/Em</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-2 border-[#212121]/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#212121]">Hành động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-[#1B5E20] hover:bg-[#1B5E20]/90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Lưu Nhân khẩu
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/leader/residents')}
                    className="w-full h-14 border-2 border-[#212121]/20"
                  >
                    Hủy
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-[#0D47A1]" />
                    <CardTitle className="text-[#212121]">Hướng dẫn</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-[#212121]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#0D47A1] mt-1">•</span>
                      <span>Trường có dấu <span className="text-[#B71C1C]">*</span> là bắt buộc</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0D47A1] mt-1">•</span>
                      <span>Số CCCD phải duy nhất trong hệ thống</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </LeaderLayout>
  );
}
