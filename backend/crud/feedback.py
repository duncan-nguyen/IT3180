import datetime


























































































































































































































































































}  );    </LeaderLayout>      </div>        </div>          </div>            </Card>              </CardContent>                </div>                  </div>                    </p>                      {feedback.feedback_responses?.length || 0}                    <p className="text-2xl font-bold text-blue-700">                    <p className="text-sm text-blue-600 mb-1">Tổng phản hồi</p>                  <div className="p-4 bg-blue-50 rounded-lg text-center">                <div className="mt-6 pt-6 border-t border-[#212121]/10 space-y-4">                {/* Summary Info */}                </div>                  </Button>                    )}                      </>                        Lưu thay đổi                        <Save className="w-6 h-6 mr-3" />                      <>                    ) : (                      </>                        Đang cập nhật...                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />                      <>                    {updatingStatus ? (                  >                    className="w-full h-14 bg-[#0D47A1] hover:bg-[#0D47A1]/90 text-white"                    disabled={updatingStatus || newStatus === feedback.status}                    onClick={handleStatusUpdate}                  <Button                  {/* Submit Button */}                  </div>                    </Select>                      </SelectContent>                        <SelectItem value="DONG">Đã đóng</SelectItem>                        <SelectItem value="DA_GIAI_QUYET">Đã giải quyết</SelectItem>                        <SelectItem value="DANG_XU_LY">Đang xử lý</SelectItem>                        <SelectItem value="MOI_GHI_NHAN">Mới ghi nhận</SelectItem>                      <SelectContent>                      </SelectTrigger>                        <SelectValue placeholder="Chọn trạng thái" />                      >                        className="h-14 border-2 border-[#212121]/20 focus:border-[#0D47A1] focus:ring-[#0D47A1]"                        id="status"                      <SelectTrigger                    <Select value={newStatus} onValueChange={setNewStatus}>                    </Label>                      Chọn trạng thái mới                    <Label htmlFor="status" className="text-[#212121]">                  <div className="space-y-3">                  {/* Status Selection */}                <div className="space-y-6">                )}                  </div>                    Cập nhật trạng thái thành công!                    <CheckCircle2 className="w-5 h-5" />                  <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">                {statusUpdateSuccess && (              <CardContent>              </CardHeader>                </CardTitle>                  Cập nhật trạng thái                <CardTitle className="text-[#212121]">              <CardHeader>            <Card className="border-2 border-[#212121]/10 shadow-lg sticky top-6">          <div className="lg:col-span-1">          {/* Right Column: Status Update */}          </div>            )}              </Card>                </CardContent>                  ))}                    </div>                      </p>                        {new Date(resp.responded_at).toLocaleString('vi-VN')}                      <p className="text-gray-500 text-sm">                      </p>                        {resp.content}                      <p className="text-[#212121]">                      </p>                        {resp.agency}                      <p className="text-[#0D47A1] font-semibold">                    <div key={resp.id} className="p-6 bg-blue-50 border border-blue-100 rounded-lg space-y-2">                  {feedback.feedback_responses.map((resp) => (                <CardContent className="space-y-4">                </CardHeader>                  </CardTitle>                    Các phản hồi từ cơ quan chức năng                  <CardTitle className="text-[#212121]">                <CardHeader>              <Card className="border-2 border-[#212121]/10 shadow-lg">            {feedback.feedback_responses && feedback.feedback_responses.length > 0 && (            {/* Existing Responses */}            </Card>              </CardContent>                </div>                  </div>                    </p>                      {feedback.report_count} báo cáo                      <Users className="w-4 h-4" />                    <p className="text-[#212121] font-medium flex items-center gap-2">                    <p className="text-sm text-gray-600 mb-1">Số báo cáo gộp</p>                  <div className="p-4 bg-[#F5F5F5] rounded-lg">                  </div>                    </p>                      {new Date(feedback.created_at).toLocaleString('vi-VN')}                    <p className="text-[#212121]">                    <p className="text-sm text-gray-600 mb-1">Ngày gửi</p>                  <div className="p-4 bg-[#F5F5F5] rounded-lg">                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                </div>                  </div>                    </span>                      {STATUS_DISPLAY[feedback.status] || feedback.status}                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(feedback.status)}`}>                    <p className="text-sm text-gray-600 mb-1">Trạng thái</p>                  <div className="p-4 bg-[#F5F5F5] rounded-lg">                  </div>                    </p>                      {CATEGORY_DISPLAY[feedback.category] || feedback.category}                    <p className="text-[#212121] font-medium">                    <p className="text-sm text-gray-600 mb-1">Phân loại</p>                  <div className="p-4 bg-[#F5F5F5] rounded-lg">                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                </div>                  <p className="text-[#212121]">{feedback.content}</p>                  <p className="text-sm text-gray-600 mb-2">Nội dung kiến nghị</p>                <div className="p-6 bg-[#F5F5F5] rounded-lg">              <CardContent className="space-y-4">              </CardHeader>                </CardTitle>                  Thông tin cơ bản                <CardTitle className="text-[#212121]">              <CardHeader>            <Card className="border-2 border-[#212121]/10 shadow-lg">            {/* Basic Info */}          <div className="lg:col-span-2 space-y-6">          {/* Left Column: Feedback Details */}        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">        </div>          </h1>            Chi tiết Kiến nghị            <MessageSquare className="w-8 h-8 text-[#0D47A1]" />          <h1 className="text-2xl font-bold text-[#212121] flex items-center gap-3">          </Link>            </Button>              Quay lại              <ArrowLeft className="w-6 h-6 mr-3" />            >              className="h-14 px-6 border-2 border-[#212121]/20 hover:bg-[#F5F5F5]"              variant="outline"            <Button          <Link to="/leader/feedback">        <div className="mb-8 flex items-center gap-6">        {/* Header */}      <div className="p-6">    <LeaderLayout onLogout={onLogout}>  return (  }    );      </LeaderLayout>        </div>          </Link>            <Button className="mt-4">Quay lại</Button>          <Link to="/leader/feedback">          </div>            {error || 'Không tìm thấy kiến nghị.'}          <div className="text-red-500">        <div className="p-6">      <LeaderLayout onLogout={onLogout}>    return (  if (!feedback) {  }    );      </LeaderLayout>        </div>          <Loader2 className="w-8 h-8 animate-spin text-[#0D47A1]" />        <div className="flex justify-center items-center h-screen">      <LeaderLayout onLogout={onLogout}>    return (  if (loading) {  };    return 'bg-yellow-100 text-yellow-700';    if (s === 'DONG') return 'bg-red-100 text-red-700';    if (s === 'DANG_XU_LY') return 'bg-blue-100 text-blue-700';    if (s === 'DA_GIAI_QUYET') return 'bg-green-100 text-green-700';    const s = status?.toUpperCase();  const getStatusColor = (status: string) => {  };    }      setUpdatingStatus(false);    } finally {      alert('Cập nhật trạng thái thất bại: ' + (err.response?.data?.detail || err.message));      console.error('Error updating status:', err);    } catch (err: any) {      setTimeout(() => setStatusUpdateSuccess(false), 3000);      await fetchFeedbackDetail(id);      setStatusUpdateSuccess(true);      await feedbackService.updateFeedbackStatus(id, newStatus);      setUpdatingStatus(true);    try {    if (!id || !newStatus) return;  const handleStatusUpdate = async () => {  };    }      setLoading(false);    } finally {      setError('Không thể tải chi tiết kiến nghị.');      console.error('Error fetching feedback detail:', err);    } catch (err: any) {      setNewStatus(data.status);      setFeedback(data);      const data = await feedbackService.getFeedbackById(feedbackId);      setLoading(true);    try {  const fetchFeedbackDetail = async (feedbackId: string) => {  }, [id]);    }      fetchFeedbackDetail(id);    if (id) {  useEffect(() => {  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);  const [updatingStatus, setUpdatingStatus] = useState(false);  const [newStatus, setNewStatus] = useState('');  // Status update  const [error, setError] = useState('');  const [loading, setLoading] = useState(true);  const [feedback, setFeedback] = useState<Feedback | null>(null);  const { id } = useParams();export default function LeaderFeedbackDetail({ onLogout }: LeaderFeedbackDetailProps) {};  'KHAC': 'Khác',  'MOI_TRUONG': 'Môi trường',  'AN_NINH': 'An ninh',  'HA_TANG': 'Hạ tầng',const CATEGORY_DISPLAY: Record<string, string> = {// Map backend category to display};  'DONG': 'Đã đóng',  'DA_GIAI_QUYET': 'Đã giải quyết',  'DANG_XU_LY': 'Đang xử lý',  'MOI_GHI_NHAN': 'Mới ghi nhận',const STATUS_DISPLAY: Record<string, string> = {// Map backend status to display}  onLogout: () => void;interface LeaderFeedbackDetailProps {import LeaderLayout from './LeaderLayout';import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';import { Label } from '../ui/label';import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';import { Button } from '../ui/button';import { Feedback, feedbackService } from '../../services/feedback-service';import { Link, useParams } from 'react-router-dom';from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.feedback import Feedback, FeedbackResponse
from schemas.common import Category, Status
from schemas.feedback import FBResponse, FeedBack, MergedFB


async def get_feedbacks(
    client: AsyncSession,
    trang_thai: Status | None = None,
    phan_loai: Category | None = None,
    start_date: datetime.date | None = None,
    end_date: datetime.date | None = None,
    q: str | None = None,
    user_id: str | None = None,
    include_merged: bool = False,
):
    query = select(Feedback)

    # Mặc định chỉ lấy các feedback gốc (không có parent_id)
    # Để không hiển thị các feedback đã được gộp vào feedback khác
    if not include_merged:
        query = query.filter(Feedback.parent_id == None)

    if trang_thai:
        query = query.filter(
            Feedback.status == trang_thai.value
            if hasattr(trang_thai, "value")
            else trang_thai
        )
    if phan_loai:
        query = query.filter(
            Feedback.category == phan_loai.value
            if hasattr(phan_loai, "value")
            else phan_loai
        )
    if start_date:
        query = query.filter(Feedback.created_at >= start_date)
    if end_date:
        next_day = end_date + datetime.timedelta(days=1)
        query = query.filter(Feedback.updated_at <= next_day)
    if q:
        query = query.filter(Feedback.content.ilike(f"%{q}%"))
    if user_id:
        query = query.filter(Feedback.created_by_user_id == user_id)

    result = await client.execute(query)
    feedbacks = result.scalars().all()
    return [f.as_dict() for f in feedbacks]


async def get_feedback_by_id(client: AsyncSession, feedback_id: str):
    query = (
        select(Feedback)
        .options(selectinload(Feedback.responses))
        .filter(Feedback.id == feedback_id)
    )
    result = await client.execute(query)
    feedback = result.scalar_one_or_none()

    if not feedback:
        return None

    data = feedback.as_dict()
    data["feedback_responses"] = [r.as_dict() for r in feedback.responses]
    data["feedback_reporters"] = []
    return data


async def update_feedback(client: AsyncSession, feedback: FeedBack, feedback_id: str):
    status_value = (
        feedback.trang_thai.value
        if hasattr(feedback.trang_thai, "value")
        else feedback.trang_thai
    )

    stmt = (
        update(Feedback).where(Feedback.id == feedback_id).values(status=status_value)
    )
    await client.execute(stmt)
    await client.commit()

    return await get_feedback_by_id(client, feedback_id)


async def create_feedback_response(
    client: AsyncSession, fbresponse: FBResponse, feedback_id: str
):
    query = select(Feedback).filter(Feedback.id == feedback_id)
    result = await client.execute(query)
    feedback_obj = result.scalar_one_or_none()

    if not feedback_obj:
        return None

    created_by_user_id = feedback_obj.created_by_user_id

    response = FeedbackResponse(
        content=fbresponse.noi_dung,
        agency=fbresponse.co_quan,
        attachment_url=fbresponse.tep_dinh_kem_url,
        feedback_id=feedback_id,
        responded_at=datetime.datetime.utcnow(),
        created_by_user_id=created_by_user_id,
    )
    client.add(response)
    await client.commit()
    await client.refresh(response)
    return response.as_dict()


async def create_new_feedback(client: AsyncSession, posted_fb, user_id: str):
    category_value = (
        posted_fb.phan_loai.value
        if hasattr(posted_fb.phan_loai, "value")
        else posted_fb.phan_loai
    )

    created_by_user_id = user_id
    scope_id = None

    if posted_fb.nguoi_phan_anh.nhankhau_id:
        scope_id = posted_fb.nguoi_phan_anh.nhankhau_id

    new_feedback = Feedback(
        status=Status.moi_ghi_nhan.value,
        category=category_value,
        content=posted_fb.noi_dung,
        scope_id=scope_id,
        created_by_user_id=created_by_user_id,
        report_count=1,
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow(),
    )

    client.add(new_feedback)
    await client.commit()
    await client.refresh(new_feedback)

    return new_feedback.as_dict()


async def merge_feedbacks(client: AsyncSession, merged_fb: MergedFB):
    sub_fb_id = merged_fb.sub_id[0]
    q = select(Feedback).filter(Feedback.id == sub_fb_id)
    res = await client.execute(q)
    sub_fb = res.scalar_one()

    q_sum = select(func.sum(Feedback.report_count)).filter(
        Feedback.id.in_(merged_fb.sub_id)
    )
    sum_res = await client.execute(q_sum)
    count = sum_res.scalar() or 0

    parent_id = merged_fb.parent_id

    if parent_id is None:
        new_parent = Feedback(
            category=sub_fb.category,
            scope_id=sub_fb.scope_id,
            status=sub_fb.status,
            content=sub_fb.content,
            report_count=count,
            created_by_user_id=sub_fb.created_by_user_id,
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow(),
        )
        client.add(new_parent)
        await client.flush()
        parent_id = new_parent.id

    stmt = (
        update(Feedback)
        .where(Feedback.id.in_(merged_fb.sub_id))
        .values(parent_id=parent_id)
    )
    await client.execute(stmt)
    await client.commit()

    return await get_feedback_by_id(client, str(parent_id))
