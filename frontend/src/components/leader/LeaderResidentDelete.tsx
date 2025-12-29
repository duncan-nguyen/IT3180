import { AlertTriangle, ArrowLeft, Home, Loader2, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Resident, residentsService } from '../../services/residents-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import LeaderLayout from './LeaderLayout';

interface LeaderResidentDeleteProps {
  onLogout: () => void;
}

export default function LeaderResidentDelete({ onLogout }: LeaderResidentDeleteProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [residentData, setResidentData] = useState<Resident | null>(null);
  const [reason, setReason] = useState('');

  // Confirmation checkboxes
  const [confirmHousehold, setConfirmHousehold] = useState(false);
  const [confirmReason, setConfirmReason] = useState(false);
  const [confirmBackup, setConfirmBackup] = useState(false);
  const [confirmIrreversible, setConfirmIrreversible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isHeadOfHousehold = residentData?.relationship_to_head === 'Chủ hộ';
  const allConfirmed = confirmHousehold && confirmReason && confirmBackup && confirmIrreversible && confirmDelete;

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
    } catch (err) {
      console.error('Error loading resident:', err);
      setError('Không thể tải thông tin nhân khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !allConfirmed) return;

    try {
      setDeleting(true);
      setError(null);

      await residentsService.delete(id);
      
      // Navigate back to residents list
      navigate('/leader/residents', { 
        state: { message: 'Xóa nhân khẩu thành công!' } 
      });
    } catch (err: any) {
      console.error('Error deleting resident:', err);
      setError(err.response?.data?.detail?.error?.message || 'Không thể xóa nhân khẩu. Vui lòng thử lại.');
    } finally {
      setDeleting(false);
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
            Xóa Nhân khẩu
          </h1>
          <p className="text-[#212121]">
            Xác nhận xóa thông tin nhân khẩu: {residentData.full_name}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-2 border-[#B71C1C]/40 bg-[#B71C1C]/10">
            <CardContent className="pt-4">
              <p className="text-[#B71C1C]">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Critical Warning */}
            <Card className="border-2 border-[#B71C1C]/40 shadow-lg bg-[#B71C1C]/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#B71C1C]/20">
                    <AlertTriangle className="w-8 h-8 text-[#B71C1C]" />
                  </div>
                  <CardTitle className="text-[#B71C1C]">
                    Cảnh báo: Xóa Nhân khẩu
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#212121] mb-4">
                  <strong>BẠN SẮP XÓA THÔNG TIN NHÂN KHẨU KHỎI HỆ THỐNG!</strong>
                </p>
                <p className="text-[#212121] mb-4">
                  Hành động này sẽ gây ra những hậu quả sau:
                </p>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      Thông tin cá nhân của <strong>{residentData.full_name}</strong> (CCCD: {residentData.cccd_number}) sẽ bị xóa hoàn toàn
                    </span>
                  </li>
                  {residentData.household && (
                    <li className="flex items-start gap-2">
                      <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                      <span>
                        Người này sẽ bị loại khỏi hộ khẩu tại <strong>{residentData.household.address}</strong>
                      </span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      Lịch sử và dữ liệu liên quan sẽ bị xóa
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      Hành động này <strong>KHÔNG THỂ HOÀN TÁC</strong>
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Special Warning for Head of Household */}
            {isHeadOfHousehold && (
              <Card className="border-2 border-[#B71C1C]/40 shadow-lg bg-[#B71C1C]/5">
                <CardHeader>
                  <CardTitle className="text-[#B71C1C]">
                    ⚠️ Cảnh báo Đặc biệt: Xóa Chủ hộ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#212121] mb-4">
                    Người này là <strong>CHỦ HỘ</strong>. 
                    Trước khi xóa, bạn <strong>BẮT BUỘC PHẢI</strong>:
                  </p>
                  <ul className="space-y-3 text-[#212121]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#B71C1C] mt-1">1.</span>
                      <span>Chỉ định một thành viên khác làm chủ hộ mới</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B71C1C] mt-1">2.</span>
                      <span>Có giấy tờ xác nhận từ cấp trên (Cán bộ Phường/Xã)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B71C1C] mt-1">3.</span>
                      <span>Thông báo cho tất cả thành viên trong hộ khẩu</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-[#B71C1C]/10 rounded-lg">
                    <p className="text-[#B71C1C]">
                      <strong>Khuyến nghị:</strong> Hãy chuyển quyền chủ hộ cho người khác trước, 
                      sau đó mới xóa người này khỏi hộ khẩu.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reason for Deletion */}
            <Card className="border-2 border-[#B71C1C]/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Lý do Xóa <span className="text-[#B71C1C]">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label htmlFor="reason" className="text-[#212121]">
                    Vui lòng nêu rõ lý do xóa nhân khẩu này:
                  </Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do xóa nhân khẩu (ví dụ: Đã mất, Chuyển nơi ở, Sai thông tin đăng ký...)"
                    className="min-h-[100px] border-2 border-[#212121]/20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Confirmation */}
            <Card className="border-2 border-[#B71C1C]/30 shadow-lg bg-[#B71C1C]/5">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm-household"
                    checked={confirmHousehold}
                    onChange={(e) => setConfirmHousehold(e.target.checked)}
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="confirm-household" className="text-[#212121] cursor-pointer">
                    <strong>Tôi hiểu rằng nhân khẩu này sẽ bị xóa khỏi hộ khẩu</strong>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm-reason"
                    checked={confirmReason}
                    onChange={(e) => setConfirmReason(e.target.checked)}
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="confirm-reason" className="text-[#212121] cursor-pointer">
                    <strong>Tôi đã có lý do chính đáng và sự phê duyệt từ cấp trên</strong>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm-backup"
                    checked={confirmBackup}
                    onChange={(e) => setConfirmBackup(e.target.checked)}
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="confirm-backup" className="text-[#212121] cursor-pointer">
                    <strong>Tôi đã sao lưu hoặc lưu trữ thông tin cần thiết</strong>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirm-irreversible"
                    checked={confirmIrreversible}
                    onChange={(e) => setConfirmIrreversible(e.target.checked)}
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="confirm-irreversible" className="text-[#212121] cursor-pointer">
                    <strong>Tôi hiểu rằng hành động này KHÔNG THỂ HOÀN TÁC</strong>
                  </label>
                </div>

                <div className="pt-4 border-t-2 border-[#B71C1C]/20">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="confirm-delete"
                      checked={confirmDelete}
                      onChange={(e) => setConfirmDelete(e.target.checked)}
                      className="w-5 h-5 mt-1"
                    />
                    <label htmlFor="confirm-delete" className="text-[#B71C1C] cursor-pointer">
                      <strong>TÔI CHẮC CHẮN MUỐN XÓA NHÂN KHẨU "{residentData.full_name.toUpperCase()}"</strong>
                    </label>
                  </div>
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
                  className="w-full h-14 bg-[#B71C1C] hover:bg-[#B71C1C]/90"
                  onClick={handleDelete}
                  disabled={!allConfirmed || deleting || !reason.trim()}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5 mr-2" />
                      Xóa Nhân khẩu Vĩnh viễn
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/leader/residents')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                  disabled={deleting}
                >
                  Hủy và Quay lại
                </Button>
              </CardContent>
            </Card>

            {/* Resident Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <User className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Nhân khẩu
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Họ và tên:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.full_name}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Số CCCD/CMND:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.cccd_number}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Ngày sinh:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {residentData.date_of_birth}
                  </p>
                </div>

                {residentData.phone_number && (
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-[#212121] mb-1">
                      <strong>Số điện thoại:</strong>
                    </p>
                    <p className="text-[#212121]">
                      {residentData.phone_number}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Household Info */}
            {residentData.household && (
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
                <CardContent className="space-y-3">
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <p className="text-sm text-[#212121] mb-1">
                      <strong>Địa chỉ:</strong>
                    </p>
                    <p className="text-[#212121]">
                      {residentData.household.address}
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg ${
                    isHeadOfHousehold 
                      ? 'bg-[#B71C1C]/10 border border-[#B71C1C]/20' 
                      : 'bg-[#F5F5F5]'
                  }`}>
                    <p className="text-sm text-[#212121] mb-1">
                      <strong>Quan hệ:</strong>
                    </p>
                    <span className={`inline-block px-3 py-1 rounded ${
                      isHeadOfHousehold
                        ? 'bg-[#B71C1C] text-white'
                        : 'bg-[#0D47A1]/10 text-[#0D47A1]'
                    }`}>
                      {residentData.relationship_to_head || 'Không xác định'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alternative Actions */}
            <Card className="border-2 border-[#0D47A1]/20 shadow-lg bg-[#0D47A1]/5">
              <CardHeader>
                <CardTitle className="text-[#212121]">
                  Hành động Thay thế
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-[#212121] mb-3">
                  Thay vì xóa, bạn có thể:
                </p>
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-[#0D47A1]/30 text-[#0D47A1]"
                  onClick={() => navigate(`/leader/residents/${id}/edit`)}
                >
                  Chỉnh sửa Thông tin
                </Button>
                <div className="pt-3 border-t border-[#212121]/10">
                  <p className="text-sm text-[#212121]">
                    <strong>Khuyến nghị:</strong> Hãy cân nhắc kỹ trước khi xóa vĩnh viễn
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LeaderLayout>
  );
}
