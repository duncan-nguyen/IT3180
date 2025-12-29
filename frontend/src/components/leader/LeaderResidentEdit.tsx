import { AlertCircle, ArrowLeft, Briefcase, Home, Loader2, MapPin, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Resident, residentsService, ResidentUpdateData } from '../../services/residents-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import LeaderLayout from './LeaderLayout';

interface LeaderResidentEditProps {
  onLogout: () => void;
}

export default function LeaderResidentEdit({ onLogout }: LeaderResidentEditProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [residentData, setResidentData] = useState<Resident | null>(null);

  // Form state - matching backend schema
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    cccd_number: '',
    place_of_birth: '',
    hometown: '',
    ethnicity: '',
    occupation: '',
    workplace: '',
    cccd_issue_date: '',
    cccd_issue_place: '',
    residence_registration_date: '',
    relationship_to_head: '',
  });

  useEffect(() => {
    if (id) {
      loadResident();
    }
  }, [id]);

  const loadResident = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await residentsService.getById(id!);
      setResidentData(data);
      setFormData({
        full_name: data.full_name || '',
        date_of_birth: data.date_of_birth || '',
        cccd_number: data.cccd_number || '',
        place_of_birth: data.place_of_birth || '',
        hometown: data.hometown || '',
        ethnicity: data.ethnicity || '',
        occupation: data.occupation || '',
        workplace: data.workplace || '',
        cccd_issue_date: data.cccd_issue_date || '',
        cccd_issue_place: data.cccd_issue_place || '',
        residence_registration_date: data.residence_registration_date || '',
        relationship_to_head: data.relationship_to_head || '',
      });
    } catch (err) {
      console.error('Error loading resident:', err);
      setError('Không thể tải thông tin nhân khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!id) return;

    // Validate required fields
    if (!formData.full_name.trim()) {
      setError('Vui lòng nhập họ và tên');
      return;
    }
    if (!formData.date_of_birth) {
      setError('Vui lòng nhập ngày sinh');
      return;
    }
    if (!formData.cccd_number.trim()) {
      setError('Vui lòng nhập số CCCD/CMND');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Only send non-empty fields
      const updateData: ResidentUpdateData = {
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        cccd_number: formData.cccd_number,
      };

      // Add optional fields only if they have values
      if (formData.place_of_birth) updateData.place_of_birth = formData.place_of_birth;
      if (formData.hometown) updateData.hometown = formData.hometown;
      if (formData.ethnicity) updateData.ethnicity = formData.ethnicity;
      if (formData.occupation) updateData.occupation = formData.occupation;
      if (formData.workplace) updateData.workplace = formData.workplace;
      if (formData.cccd_issue_date) updateData.cccd_issue_date = formData.cccd_issue_date;
      if (formData.cccd_issue_place) updateData.cccd_issue_place = formData.cccd_issue_place;
      if (formData.residence_registration_date) updateData.residence_registration_date = formData.residence_registration_date;
      if (formData.relationship_to_head) updateData.relationship_to_head = formData.relationship_to_head;

      await residentsService.update(id, updateData);
      setSuccessMessage('Cập nhật nhân khẩu thành công!');
      
      // Navigate back after 1.5s
      setTimeout(() => {
        navigate('/leader/residents');
      }, 1500);
    } catch (err: any) {
      console.error('Error updating resident:', err);
      setError(err.response?.data?.detail?.error?.message || err.response?.data?.detail || 'Không thể cập nhật nhân khẩu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LeaderLayout onLogout={onLogout}>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />
          <span className="ml-2 text-[#212121]">Đang tải...</span>
        </div>
      </LeaderLayout>
    );
  }

  if (!residentData) {
    return (
      <LeaderLayout onLogout={onLogout}>
        <div className="p-6">
          <Card className="border-2 border-[#B71C1C]/20">
            <CardContent className="pt-6">
              <p className="text-[#B71C1C]">Không tìm thấy nhân khẩu</p>
              <Button
                variant="outline"
                onClick={() => navigate('/leader/residents')}
                className="mt-4"
              >
                Quay lại danh sách
              </Button>
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
          <Button
            variant="outline"
            onClick={() => navigate('/leader/residents')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3 text-2xl font-bold">
            Chỉnh sửa Nhân khẩu
          </h1>
          <p className="text-[#212121]">
            Cập nhật thông tin nhân khẩu: {residentData.full_name}
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Card className="mb-6 border-2 border-[#B71C1C]/40 bg-[#B71C1C]/10">
            <CardContent className="pt-4">
              <p className="text-[#B71C1C]">{error}</p>
            </CardContent>
          </Card>
        )}

        {successMessage && (
          <Card className="mb-6 border-2 border-[#1B5E20]/40 bg-[#1B5E20]/10">
            <CardContent className="pt-4">
              <p className="text-[#1B5E20]">{successMessage}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <User className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Cá nhân
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="full-name" className="text-[#212121]">
                    Họ và tên <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="full-name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="h-12 border-2 border-[#212121]/20"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="birth-date" className="text-[#212121]">
                      Ngày sinh <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <input
                      id="birth-date"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="ethnicity" className="text-[#212121]">
                      Dân tộc
                    </Label>
                    <Input
                      id="ethnicity"
                      value={formData.ethnicity}
                      onChange={(e) => handleInputChange('ethnicity', e.target.value)}
                      className="h-12 border-2 border-[#212121]/20"
                      placeholder="Nhập dân tộc"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="id-number" className="text-[#212121]">
                    Số CCCD/CMND <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Input
                    id="id-number"
                    value={formData.cccd_number}
                    onChange={(e) => handleInputChange('cccd_number', e.target.value)}
                    className="h-12 border-2 border-[#212121]/20"
                    placeholder="Nhập số CCCD/CMND"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="cccd-issue-date" className="text-[#212121]">
                      Ngày cấp CCCD
                    </Label>
                    <input
                      id="cccd-issue-date"
                      type="date"
                      value={formData.cccd_issue_date}
                      onChange={(e) => handleInputChange('cccd_issue_date', e.target.value)}
                      className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="cccd-issue-place" className="text-[#212121]">
                      Nơi cấp CCCD
                    </Label>
                    <Input
                      id="cccd-issue-place"
                      value={formData.cccd_issue_place}
                      onChange={(e) => handleInputChange('cccd_issue_place', e.target.value)}
                      className="h-12 border-2 border-[#212121]/20"
                      placeholder="Nhập nơi cấp"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Origin Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                    <MapPin className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Quê quán
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="place-of-birth" className="text-[#212121]">
                    Nơi sinh
                  </Label>
                  <Input
                    id="place-of-birth"
                    value={formData.place_of_birth}
                    onChange={(e) => handleInputChange('place_of_birth', e.target.value)}
                    className="h-12 border-2 border-[#212121]/20"
                    placeholder="Nhập nơi sinh"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="hometown" className="text-[#212121]">
                    Nguyên quán
                  </Label>
                  <Input
                    id="hometown"
                    value={formData.hometown}
                    onChange={(e) => handleInputChange('hometown', e.target.value)}
                    className="h-12 border-2 border-[#212121]/20"
                    placeholder="Nhập nguyên quán"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Household Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                    <Home className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Hộ khẩu
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="household" className="text-[#212121]">
                    Hộ khẩu hiện tại
                  </Label>
                  <Input
                    id="household"
                    value={residentData.household?.address || 'Chưa có hộ khẩu'}
                    className="h-12 border-2 border-[#212121]/20 bg-gray-100"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="relation" className="text-[#212121]">
                      Quan hệ với chủ hộ
                    </Label>
                    <Select 
                      value={formData.relationship_to_head}
                      onValueChange={(value) => handleInputChange('relationship_to_head', value)}
                    >
                      <SelectTrigger id="relation" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue placeholder="Chọn quan hệ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chủ hộ">Chủ hộ</SelectItem>
                        <SelectItem value="Vợ">Vợ</SelectItem>
                        <SelectItem value="Chồng">Chồng</SelectItem>
                        <SelectItem value="Con">Con</SelectItem>
                        <SelectItem value="Bố">Bố</SelectItem>
                        <SelectItem value="Mẹ">Mẹ</SelectItem>
                        <SelectItem value="Anh/Chị/Em">Anh/Chị/Em</SelectItem>
                        <SelectItem value="Ông/Bà">Ông/Bà</SelectItem>
                        <SelectItem value="Cháu">Cháu</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="registration-date" className="text-[#212121]">
                      Ngày đăng ký thường trú
                    </Label>
                    <input
                      id="registration-date"
                      type="date"
                      value={formData.residence_registration_date}
                      onChange={(e) => handleInputChange('residence_registration_date', e.target.value)}
                      className="h-12 w-full px-3 border-2 border-[#212121]/20 rounded-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <Briefcase className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Nghề nghiệp
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="occupation" className="text-[#212121]">
                    Nghề nghiệp
                  </Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    className="h-12 border-2 border-[#212121]/20"
                    placeholder="Nhập nghề nghiệp"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="workplace" className="text-[#212121]">
                    Nơi làm việc
                  </Label>
                  <Input
                    id="workplace"
                    value={formData.workplace}
                    onChange={(e) => handleInputChange('workplace', e.target.value)}
                    className="h-12 border-2 border-[#212121]/20"
                    placeholder="Nhập nơi làm việc"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hành động
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Lưu Thay đổi
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/leader/residents')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                  disabled={saving}
                >
                  Hủy
                </Button>
              </CardContent>
            </Card>

            {/* Current Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Thông tin Hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Họ và tên</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.full_name}
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Số CCCD/CMND</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.cccd_number}
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Hộ khẩu</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.household?.address || 'Chưa có'}
                  </p>
                </div>
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Quan hệ</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.relationship_to_head || 'Chưa xác định'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <CardTitle className="text-[#212121] flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#0D47A1]" />
                  Lưu ý
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[#212121]">
                  <li>• Mọi thay đổi sẽ được ghi vào nhật ký</li>
                  <li>• Thông tin bắt buộc được đánh dấu *</li>
                  <li>• Thay đổi hộ khẩu sẽ được ghi nhận</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LeaderLayout>
  );
}
