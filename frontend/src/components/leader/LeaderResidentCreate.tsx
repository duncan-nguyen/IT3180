import { AlertCircle, ArrowLeft, Briefcase, Home, Loader2, MapPin, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Household, householdsService } from '../../services/households-service';
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
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loadingHouseholds, setLoadingHouseholds] = useState(true);

  // Form state - matching backend schema
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    cccd_number: '',
    household_id: '',
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
    loadHouseholds();
  }, []);

  const loadHouseholds = async () => {
    try {
      setLoadingHouseholds(true);
      const response = await householdsService.getHouseholdsList({ limit: 100 });
      setHouseholds(response.data);
    } catch (err) {
      console.error('Error loading households:', err);
    } finally {
      setLoadingHouseholds(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.date_of_birth || !formData.cccd_number || !formData.household_id) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (Họ tên, Ngày sinh, CCCD, Hộ khẩu)');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const createData: any = {
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        cccd_number: formData.cccd_number,
        household_id: formData.household_id,
      };

      // Add optional fields only if they have values
      if (formData.place_of_birth) createData.place_of_birth = formData.place_of_birth;
      if (formData.hometown) createData.hometown = formData.hometown;
      if (formData.ethnicity) createData.ethnicity = formData.ethnicity;
      if (formData.occupation) createData.occupation = formData.occupation;
      if (formData.workplace) createData.workplace = formData.workplace;
      if (formData.cccd_issue_date) createData.cccd_issue_date = formData.cccd_issue_date;
      if (formData.cccd_issue_place) createData.cccd_issue_place = formData.cccd_issue_place;
      if (formData.residence_registration_date) createData.residence_registration_date = formData.residence_registration_date;
      if (formData.relationship_to_head) createData.relationship_to_head = formData.relationship_to_head;

      await residentsService.create(createData);
      alert('Tạo nhân khẩu thành công!');
      navigate('/leader/residents');
    } catch (err: any) {
      console.error('Error creating resident:', err);
      setError(err.response?.data?.detail?.error?.message || err.response?.data?.detail || 'Không thể tạo nhân khẩu');
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
          <h1 className="text-[#212121] mb-3 text-2xl font-bold">Thêm Nhân khẩu Mới</h1>
          <p className="text-[#212121]">Thêm nhân khẩu mới vào hệ thống</p>
        </div>

        {error && (
          <Card className="mb-6 border-2 border-[#B71C1C]/40 bg-[#B71C1C]/10">
            <CardContent className="pt-4">
              <p className="text-[#B71C1C]">{error}</p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
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
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="h-12 border-2 border-[#212121]/20"
                      placeholder="Nhập họ và tên"
                      required
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
                        required
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
                    <Label htmlFor="cccd-number" className="text-[#212121]">
                      Số CCCD/CMND <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Input
                      id="cccd-number"
                      value={formData.cccd_number}
                      onChange={(e) => handleInputChange('cccd_number', e.target.value)}
                      className="h-12 border-2 border-[#212121]/20"
                      placeholder="Nhập số CCCD/CMND"
                      required
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
                    <CardTitle className="text-[#212121]">Thông tin Quê quán</CardTitle>
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
                    <CardTitle className="text-[#212121]">Thông tin Hộ khẩu</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="household" className="text-[#212121]">
                      Hộ khẩu <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select 
                      value={formData.household_id}
                      onValueChange={(value) => handleInputChange('household_id', value)}
                    >
                      <SelectTrigger id="household" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue placeholder={loadingHouseholds ? "Đang tải..." : "Chọn hộ khẩu"} />
                      </SelectTrigger>
                      <SelectContent>
                        {households.map((h) => (
                          <SelectItem key={h.id} value={h.id}>
                            {h.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <CardTitle className="text-[#212121]">Nghề nghiệp</CardTitle>
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
                  <CardTitle className="text-[#212121]">Hành động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    type="submit"
                    className="w-full h-14 bg-[#1B5E20] hover:bg-[#1B5E20]/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Tạo Nhân khẩu
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/leader/residents')}
                    className="w-full h-14 border-2 border-[#212121]/20"
                    disabled={loading}
                  >
                    Hủy
                  </Button>
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
                    <li>• Thông tin bắt buộc được đánh dấu *</li>
                    <li>• Nhân khẩu phải thuộc một hộ khẩu</li>
                    <li>• Số CCCD/CMND phải là duy nhất</li>
                    <li>• Mọi thay đổi sẽ được ghi vào nhật ký</li>
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
