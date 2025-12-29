import { AlertCircle, ArrowLeft, Loader2, MessageSquare, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedbackService } from '../../services/feedback-service';
import { Resident, residentsService } from '../../services/residents-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import LeaderLayout from './LeaderLayout';

interface LeaderFeedbackCreateProps {
  onLogout: () => void;
}

export default function LeaderFeedbackCreate({ onLogout }: LeaderFeedbackCreateProps) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    selectedResidentId: '',
    content: '',
    category: '',
  });

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      setLoading(true);
      const response = await residentsService.getAll({ limit: 100 });
      setResidents(response.data || []);
    } catch (err) {
      console.error('Error loading residents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadResidents();
      return;
    }
    try {
      setLoading(true);
      const data = await residentsService.search(searchQuery);
      // Map search results to Resident format
      const mappedResidents = data.map((item: any) => ({
        id: item.id,
        full_name: item.ho_ten,
        date_of_birth: '',
        cccd_number: '',
        household: item.dia_chi ? { id: '', address: item.dia_chi } : undefined
      }));
      setResidents(mappedResidents);
    } catch (err) {
      console.error('Error searching residents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.selectedResidentId) {
      setError('Vui lòng chọn người phản ánh');
      return;
    }
    if (!formData.content.trim()) {
      setError('Vui lòng nhập nội dung kiến nghị');
      return;
    }
    if (!formData.category) {
      setError('Vui lòng chọn phân loại');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      await feedbackService.createFeedback({
        noi_dung: formData.content,
        phan_loai: formData.category,
        nguoi_phan_anh: {
          nhankhau_id: formData.selectedResidentId
        }
      });

      setSuccessMessage('Tạo kiến nghị thành công!');
      
      // Navigate back after 1.5s
      setTimeout(() => {
        navigate('/leader/feedback');
      }, 1500);
    } catch (err: any) {
      console.error('Error creating feedback:', err);
      setError(err.response?.data?.detail?.error?.message || 'Không thể tạo kiến nghị. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const selectedResident = residents.find(r => r.id === formData.selectedResidentId);

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/leader/feedback')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3 text-2xl font-bold">
            Ghi nhận Kiến nghị Mới
          </h1>
          <p className="text-[#212121]">
            Ghi nhận kiến nghị từ người dân trong khu vực quản lý
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
            {/* Reporter Information */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <User className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Người phản ánh
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-[#0D47A1]/5 border-2 border-[#0D47A1]/20 rounded-lg">
                  <p className="text-[#212121] mb-3">
                    Tìm và chọn người phản ánh từ danh sách nhân khẩu
                  </p>
                  
                  {/* Search */}
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Tìm theo tên hoặc CCCD..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 border-2 border-[#212121]/20"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleSearch}
                      className="h-12"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tìm'}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="select-resident" className="text-[#212121]">
                      Chọn từ danh sách Nhân khẩu <span className="text-[#B71C1C]">*</span>
                    </Label>
                    <Select 
                      value={formData.selectedResidentId}
                      onValueChange={(value) => handleInputChange('selectedResidentId', value)}
                    >
                      <SelectTrigger id="select-resident" className="h-12 border-2 border-[#212121]/20">
                        <SelectValue placeholder="Chọn người phản ánh..." />
                      </SelectTrigger>
                      <SelectContent>
                        {residents.map((resident) => (
                          <SelectItem key={resident.id} value={resident.id}>
                            {resident.full_name} 
                            {resident.household?.address && ` - ${resident.household.address}`}
                          </SelectItem>
                        ))}
                        {residents.length === 0 && (
                          <SelectItem value="_empty" disabled>
                            Không tìm thấy nhân khẩu
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Display selected resident info */}
                {selectedResident && (
                  <div className="p-4 bg-[#1B5E20]/10 border-2 border-[#1B5E20]/20 rounded-lg">
                    <p className="text-[#1B5E20] font-semibold mb-2">Người phản ánh đã chọn:</p>
                    <p className="text-[#212121]">
                      <strong>{selectedResident.full_name}</strong>
                    </p>
                    {selectedResident.cccd_number && (
                      <p className="text-sm text-[#212121]/70">CCCD: {selectedResident.cccd_number}</p>
                    )}
                    {selectedResident.household?.address && (
                      <p className="text-sm text-[#212121]/70">Địa chỉ: {selectedResident.household.address}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feedback Content */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#1B5E20]/10">
                    <MessageSquare className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Nội dung Kiến nghị
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-[#212121]">
                    Phân loại <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger id="category" className="h-12 border-2 border-[#212121]/20">
                      <SelectValue placeholder="Chọn phân loại..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HA_TANG">Hạ tầng</SelectItem>
                      <SelectItem value="MOI_TRUONG">Môi trường</SelectItem>
                      <SelectItem value="AN_NINH">An ninh trật tự</SelectItem>
                      <SelectItem value="KHAC">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="content" className="text-[#212121]">
                    Mô tả chi tiết <span className="text-[#B71C1C]">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Mô tả chi tiết về vấn đề, thời gian xảy ra, mức độ ảnh hưởng..."
                    className="min-h-[200px] border-2 border-[#212121]/20"
                  />
                  <p className="text-sm text-[#212121]/70">
                    Ghi chép đầy đủ thông tin từ người phản ánh
                  </p>
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
                  className="w-full h-14 bg-[#1B5E20] hover:bg-[#1B5E20]/90"
                  onClick={handleSubmit}
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
                      Lưu Kiến nghị
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/leader/feedback')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                  disabled={saving}
                >
                  Hủy
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-[#0D47A1]" />
                  <CardTitle className="text-[#212121]">
                    Hướng dẫn
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Chọn người phản ánh từ danh sách nhân khẩu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Ghi chép đầy đủ và chính xác thông tin từ người dân</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Chọn phân loại phù hợp với nội dung kiến nghị</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D47A1] mt-1">•</span>
                    <span>Trường có dấu <span className="text-[#B71C1C]">*</span> là bắt buộc</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Category Guide */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hướng dẫn Phân loại
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-[#212121]">
                  <li className="p-3 bg-[#0D47A1]/10 rounded-lg border border-[#0D47A1]/20">
                    <strong className="text-[#0D47A1]">Hạ tầng:</strong>
                    <p className="text-sm mt-1">
                      Đường, điện, nước, công trình công cộng
                    </p>
                  </li>
                  <li className="p-3 bg-[#1B5E20]/10 rounded-lg border border-[#1B5E20]/20">
                    <strong className="text-[#1B5E20]">Môi trường:</strong>
                    <p className="text-sm mt-1">
                      Rác thải, ô nhiễm, cây xanh
                    </p>
                  </li>
                  <li className="p-3 bg-[#B71C1C]/10 rounded-lg border border-[#B71C1C]/20">
                    <strong className="text-[#B71C1C]">An ninh:</strong>
                    <p className="text-sm mt-1">
                      Trật tự, an toàn khu dân cư
                    </p>
                  </li>
                  <li className="p-3 bg-[#F5F5F5] rounded-lg">
                    <strong>Khác:</strong>
                    <p className="text-sm mt-1">
                      Các vấn đề khác không thuộc các loại trên
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LeaderLayout>
  );
}
