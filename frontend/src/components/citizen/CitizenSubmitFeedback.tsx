import { ArrowLeft, Loader2, LogOut, Send, Upload } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth-service';
import { feedbackService } from '../../services/feedback-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface CitizenSubmitFeedbackProps {
  onLogout: () => void;
}

// Map frontend category values to backend enum values (UPPERCASE)
const CATEGORY_MAP: Record<string, string> = {
  'infrastructure': 'HA_TANG',
  'security': 'AN_NINH',
  'environment': 'MOI_TRUONG',
  'other': 'KHAC',
};

export default function CitizenSubmitFeedback({ onLogout }: CitizenSubmitFeedbackProps) {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !content) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get current user to get their citizen ID (scope_id)
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.scope_id) {
        setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      await feedbackService.createFeedback({
        noi_dung: content,
        phan_loai: CATEGORY_MAP[category] || category,
        nguoi_phan_anh: {
          nhankhau_id: currentUser.scope_id,
        },
      });

      alert('Kiến nghị của bạn đã được gửi thành công!');
      navigate('/citizen');
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      // Handle error - backend may return object or string
      const errorDetail = err.response?.data?.detail;
      if (typeof errorDetail === 'string') {
        setError(errorDetail);
      } else if (Array.isArray(errorDetail)) {
        // Validation errors are returned as array of objects with 'msg' field
        setError(errorDetail.map((e: any) => e.msg || JSON.stringify(e)).join(', '));
      } else if (errorDetail && typeof errorDetail === 'object') {
        setError(errorDetail.msg || errorDetail.message || JSON.stringify(errorDetail));
      } else {
        setError('Không thể gửi kiến nghị. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

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
        <Card className="border-2 border-[#212121]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#212121]">
              Mẫu gửi kiến nghị
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Selection */}
              <div className="space-y-3">
                <Label htmlFor="category" className="text-[#212121]">
                  Chọn Phân loại
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger
                    id="category"
                    className="h-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                  >
                    <SelectValue placeholder="Chọn phân loại kiến nghị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="infrastructure">Hạ tầng (Đường xá, điện, nước)</SelectItem>
                    <SelectItem value="security">An ninh trật tự</SelectItem>
                    <SelectItem value="environment">Môi trường</SelectItem>
                    <SelectItem value="healthcare">Y tế</SelectItem>
                    <SelectItem value="education">Giáo dục</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <Label htmlFor="content" className="text-[#212121]">
                  Nội dung phản ánh
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="Nhập nội dung phản ánh của bạn..."
                  className="min-h-[200px] border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <Label htmlFor="file" className="text-[#212121]">
                  Đính kèm ảnh (nếu có)
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 px-6 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"
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
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 mr-3" />
                    Gửi đi
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
