import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Send, Upload, LogOut } from 'lucide-react';

interface CitizenSubmitFeedbackProps {
  onLogout: () => void;
}

export default function CitizenSubmitFeedback({ onLogout }: CitizenSubmitFeedbackProps) {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    alert('Kiến nghị của bạn đã được gửi thành công!');
    navigate('/citizen');
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
                className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white"
              >
                <Send className="w-6 h-6 mr-3" />
                Gửi đi
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
