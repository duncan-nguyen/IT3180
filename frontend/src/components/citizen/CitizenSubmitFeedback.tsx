import { AlertCircle, ArrowLeft, LogOut, Send, Upload } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createFeedback, type Category } from '../../api_caller/port8019';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface CitizenSubmitFeedbackProps {
  onLogout: () => void;
}

export default function CitizenSubmitFeedback({ onLogout }: CitizenSubmitFeedbackProps) {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | ''>('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provideIdentity, setProvideIdentity] = useState(false);

  const token = localStorage.getItem('access_token') || '';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category) {
      setError('Vui lòng chọn phân loại kiến nghị');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const feedbackData = {
        noi_dung: content,
        phan_loai: category as Category,
        nguoi_phan_anh: {
          nhankhau_id: provideIdentity ? user.id : null,
          ho_ten_tu_do: provideIdentity ? null : 'Ẩn danh',
        },
      };

      await createFeedback(token, feedbackData);
      
      // Show success and navigate
      alert('Kiến nghị của bạn đã được gửi thành công!');
      navigate('/citizen');
      
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Không thể gửi kiến nghị. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions: { value: Category; label: string }[] = [
    { value: 'HA_TANG', label: 'Hạ tầng (Đường xá, điện, nước)' },
    { value: 'AN_NINH', label: 'An ninh trật tự' },
    { value: 'MOI_TRUONG', label: 'Môi trường' },
    { value: 'KHAC', label: 'Khác' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#212121]/10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/citizen">
              <Button
                variant="outline"
                className="h-14 px-6 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
              >
                <ArrowLeft className="w-6 h-6 mr-3" />
                Quay lại
              </Button>
            </Link>
            <h1 className="text-[#212121]">
              Gửi Kiến nghị Mới
            </h1>
          </div>
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
      <main className="max-w-4xl mx-auto p-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Mẫu gửi kiến nghị
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Selection */}
              <div className="space-y-3">
                <Label htmlFor="category" className="text-[#212121]">
                  Chọn Phân loại <span className="text-red-500">*</span>
                </Label>
                <Select value={category} onValueChange={(value) => setCategory(value as Category)} required>
                  <SelectTrigger
                    id="category"
                    className="h-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                  >
                    <SelectValue placeholder="Chọn phân loại kiến nghị" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <Label htmlFor="content" className="text-[#212121]">
                  Nội dung phản ánh <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Nhập nội dung phản ánh của bạn..."
                  className="min-h-[200px] border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                />
              </div>

              {/* Identity Option */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="provideIdentity"
                    checked={provideIdentity}
                    onChange={(e) => setProvideIdentity(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <Label htmlFor="provideIdentity" className="text-[#212121] cursor-pointer">
                    Cung cấp thông tin cá nhân (nếu không chọn, kiến nghị sẽ được gửi ẩn danh)
                  </Label>
                </div>
              </div>

              {/* File Upload - Note: This would need additional backend support for file uploads */}
              <div className="space-y-3">
                <Label htmlFor="file" className="text-[#212121]">
                  Đính kèm ảnh (tạm thời chưa khả dụng)
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="h-14 px-6 border-2 border-[#212121]/20 hover:bg-[#F5F5F5] opacity-50"
                    onClick={() => document.getElementById('file')?.click()}
                  >
                    <Upload className="w-6 h-6 mr-3" />
                    Chọn tệp
                  </Button>
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {file && (
                    <span className="text-[#212121]">{file.name}</span>
                  )}
                </div>
                <p className="text-sm text-[#212121]/60">
                  Chức năng upload ảnh sẽ được cập nhật trong phiên bản sau
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white disabled:opacity-50"
              >
                <Send className="w-6 h-6 mr-3" />
                {isLoading ? 'Đang gửi...' : 'Gửi đi'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}