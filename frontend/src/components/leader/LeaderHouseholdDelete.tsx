import { AlertTriangle, ArrowLeft, Home, Loader2, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Household, householdsService } from '../../services/households-service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import LeaderLayout from './LeaderLayout';

interface LeaderHouseholdDeleteProps {
  onLogout: () => void;
}

export default function LeaderHouseholdDelete({ onLogout }: LeaderHouseholdDeleteProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [householdData, setHouseholdData] = useState<Household | null>(null);
  const [reason, setReason] = useState('');

  // Confirmation checkboxes
  const [confirmMembers, setConfirmMembers] = useState(false);
  const [confirmReason, setConfirmReason] = useState(false);
  const [confirmBackup, setConfirmBackup] = useState(false);
  const [confirmIrreversible, setConfirmIrreversible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const allConfirmed = confirmMembers && confirmReason && confirmBackup && confirmIrreversible && confirmDelete;

  useEffect(() => {
    if (id) {
      loadHousehold();
    }
  }, [id]);

  const loadHousehold = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await householdsService.getHouseholdById(id!);
      setHouseholdData(data);
    } catch (err) {
      console.error('Error loading household:', err);
      setError('Không thể tải thông tin hộ khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !allConfirmed) return;

    try {
      setDeleting(true);
      setError(null);

      await householdsService.deleteHousehold(id);
      
      // Navigate back to households list
      navigate('/leader/households', { 
        state: { message: 'Xóa hộ khẩu thành công!' } 
      });
    } catch (err: any) {
      console.error('Error deleting household:', err);
      setError(err.response?.data?.detail?.error?.message || 'Không thể xóa hộ khẩu. Vui lòng thử lại.');
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

  if (!householdData) {
    return (
      <LeaderLayout onLogout={onLogout}>
        <div className="p-6">
          <Card className="border-2 border-[#B71C1C]/20">
            <CardContent className="pt-6">
              <p className="text-[#B71C1C]">Không tìm thấy hộ khẩu</p>
              <Button
                variant="outline"
                onClick={() => navigate('/leader/households')}
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

  const membersCount = householdData.nhan_khau?.length || 0;

  return (
    <LeaderLayout onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/leader/households')}
            className="h-12 mb-4 border-2 border-[#212121]/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-[#212121] mb-3 text-2xl font-bold">
            Xóa Hộ khẩu
          </h1>
          <p className="text-[#212121]">
            Xác nhận xóa hộ khẩu: {householdData.household_number || householdData.id}
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
                    Cảnh báo: Xóa Hộ khẩu
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#212121] mb-4">
                  <strong>BẠN SẮP XÓA HỘ KHẨU VÀ TẤT CẢ THÔNG TIN LIÊN QUAN!</strong>
                </p>
                <p className="text-[#212121] mb-4">
                  Hành động này sẽ gây ra những hậu quả sau:
                </p>
                <ul className="space-y-3 text-[#212121]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      <strong>Hộ khẩu {householdData.household_number || householdData.id}</strong> sẽ bị xóa hoàn toàn khỏi hệ thống
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      Thông tin của <strong>{membersCount} thành viên</strong> trong hộ khẩu sẽ bị ảnh hưởng
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B71C1C] mt-1 text-2xl">⚠</span>
                    <span>
                      Lịch sử và dữ liệu liên quan đến hộ khẩu sẽ bị xóa
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

            {/* Members Affected */}
            {householdData.nhan_khau && householdData.nhan_khau.length > 0 && (
              <Card className="border-2 border-[#B71C1C]/20 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-[#B71C1C]" />
                    <CardTitle className="text-[#212121]">
                      Thành viên bị Ảnh hưởng ({membersCount})
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#212121] mb-4">
                    Những người sau sẽ <strong>MẤT THÔNG TIN HỘ KHẨU</strong> khi bạn xóa:
                  </p>
                  <div className="space-y-2">
                    {householdData.nhan_khau.map((member, index) => (
                      <div
                        key={member.id || index}
                        className="p-4 bg-[#B71C1C]/5 border border-[#B71C1C]/20 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[#212121]">
                              <strong>{member.full_name}</strong>
                            </p>
                            <p className="text-sm text-[#212121] mt-1">
                              Quan hệ: {member.relationship_to_head || 'Không xác định'}
                            </p>
                          </div>
                          {member.relationship_to_head === 'Chủ hộ' && (
                            <span className="px-3 py-1 rounded bg-[#B71C1C]/20 text-[#B71C1C] text-sm">
                              Chủ hộ
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
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
                    Vui lòng nêu rõ lý do xóa hộ khẩu này:
                  </Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do xóa hộ khẩu (ví dụ: Chuyển nơi ở, Sai thông tin đăng ký...)"
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
                    id="confirm-members"
                    checked={confirmMembers}
                    onChange={(e) => setConfirmMembers(e.target.checked)}
                    className="w-5 h-5 mt-1"
                  />
                  <label htmlFor="confirm-members" className="text-[#212121] cursor-pointer">
                    <strong>Tôi hiểu rằng {membersCount} thành viên sẽ mất thông tin hộ khẩu</strong>
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
                      <strong>TÔI CHẮC CHẮN MUỐN XÓA HỘ KHẨU "{householdData.household_number || householdData.id}"</strong>
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
                      Xóa Hộ khẩu Vĩnh viễn
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/leader/households')}
                  className="w-full h-14 border-2 border-[#212121]/20"
                  disabled={deleting}
                >
                  Hủy và Quay lại
                </Button>
              </CardContent>
            </Card>

            {/* Household Info */}
            <Card className="border-2 border-[#212121]/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#0D47A1]/10">
                    <Home className="w-6 h-6 text-[#0D47A1]" />
                  </div>
                  <CardTitle className="text-[#212121]">
                    Thông tin Hộ khẩu
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Số hộ khẩu:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {householdData.household_number || householdData.id}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Chủ hộ:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {householdData.head_name || 'Chưa có'}
                  </p>
                </div>

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Địa chỉ:</strong>
                  </p>
                  <p className="text-[#212121]">
                    {householdData.address}
                  </p>
                </div>

                <div className="p-3 bg-[#B71C1C]/10 border border-[#B71C1C]/20 rounded-lg">
                  <p className="text-sm text-[#212121] mb-1">
                    <strong>Số thành viên:</strong>
                  </p>
                  <p className="text-2xl text-[#B71C1C]">
                    {membersCount} người
                  </p>
                </div>
              </CardContent>
            </Card>

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
                  onClick={() => navigate(`/leader/households/${id}/edit`)}
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
