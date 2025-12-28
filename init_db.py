import asyncio
import os
import uuid
from datetime import date, datetime

from passlib.context import CryptContext
from sqlalchemy import (
    JSON,
    UUID,
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    select,
)
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, relationship

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://admin:password123@postgres_db:5432/citizen_management",
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Base(DeclarativeBase):
    pass


# ==========================================
# Authentication Models
# ==========================================
class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)
    scope_id = Column(String, nullable=True)
    active = Column(Boolean, default=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True))
    action = Column(String)
    entity_name = Column(String)
    entity_id = Column(UUID(as_uuid=True))
    before_state = Column(JSON)
    after_state = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)


# ==========================================
# Residents Models
# ==========================================
# ==========================================
# Administrative Division Models
# ==========================================
class Province(Base):
    __tablename__ = "provinces"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    code = Column(String(10), unique=True)
    is_active = Column(Boolean, default=True)


class Ward(Base):
    __tablename__ = "wards"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    province_id = Column(UUID(as_uuid=True), ForeignKey("provinces.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True)
    is_active = Column(Boolean, default=True)


class NeighborhoodGroup(Base):
    __tablename__ = "neighborhood_groups"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ward_id = Column(UUID(as_uuid=True), ForeignKey("wards.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(20))
    to_truong_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    is_active = Column(Boolean, default=True)


class Household(Base):
    __tablename__ = "households"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    household_number = Column(String(50), unique=True, nullable=False)
    head_of_household_id = Column(
        UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True
    )
    address = Column(String(255), nullable=False)
    ward = Column(String(100), nullable=False)  # Legacy
    ward_id = Column(UUID(as_uuid=True), ForeignKey("wards.id"), nullable=True)
    neighborhood_group_id = Column(UUID(as_uuid=True), ForeignKey("neighborhood_groups.id"), nullable=True)
    scope_id = Column(String(50))
    is_active = Column(Boolean, default=True)

    # Relations
    head_of_household = relationship(
        "Citizen", foreign_keys="[Household.head_of_household_id]", post_update=True
    )
    members = relationship(
        "Citizen", back_populates="household", foreign_keys="[Citizen.household_id]"
    )


class Citizen(Base):
    __tablename__ = "citizens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    household_id = Column(
        UUID(as_uuid=True), ForeignKey("households.id"), nullable=True
    )
    full_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    place_of_birth = Column(String(255))
    hometown = Column(String(255))
    ethnicity = Column(String(50))
    occupation = Column(String(100))
    workplace = Column(String(255))
    is_active = Column(Boolean, default=True)
    cccd_number = Column(String(12), unique=True, nullable=False)

    cccd_issue_date = Column(Date)
    cccd_issue_place = Column(String(255))
    residence_registration_date = Column(Date)
    relationship_to_head = Column(String(50))

    # Death Declaration
    date_of_death = Column(Date, nullable=True)
    death_reason = Column(String(255), nullable=True)
    is_deceased = Column(Boolean, default=False)

    # Relations
    household = relationship(
        "Household", back_populates="members", foreign_keys=[household_id]
    )


class MovementLog(Base):
    __tablename__ = "movement_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=False)
    change_type = Column(String(50))  # e.g. "Tạm vắng", "Tạm trú"
    change_date = Column(Date, default=datetime.utcnow)
    reason = Column(String(255))
    destination = Column(String(255))

    # Relation
    citizen = relationship("Citizen")


# ==========================================
# Feedback Models
# ==========================================
class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(String)
    category = Column(String)
    content = Column(String)
    attachment_urls = Column(JSON, default=[])
    scope_id = Column(String)
    report_count = Column(Integer, default=0)
    created_by_user_id = Column(UUID(as_uuid=True))
    parent_id = Column(UUID(as_uuid=True), ForeignKey("feedbacks.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    reported_at = Column(DateTime, nullable=True)

    # Relations
    responses = relationship("FeedbackResponse", back_populates="feedback")


class FeedbackResponse(Base):
    __tablename__ = "feedback_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(String)
    agency = Column(String)
    attachment_url = Column(String)
    feedback_id = Column(UUID(as_uuid=True), ForeignKey("feedbacks.id"))
    responded_at = Column(DateTime, default=datetime.utcnow)
    created_by_user_id = Column(UUID(as_uuid=True))

    feedback = relationship("Feedback", back_populates="responses")


# ==========================================
# Initialization Logic
# ==========================================
async def init_db():
    print(f"Connecting to {DATABASE_URL}...")
    engine = create_async_engine(DATABASE_URL, echo=True)

    # 1. Tạo bảng
    async with engine.begin() as conn:
        print("Creating all tables from shared Base...")
        await conn.run_sync(Base.metadata.create_all)

    # 2. Seed dữ liệu mẫu
    async with AsyncSession(engine) as session:
        async with session.begin():
            print("Checking existing data...")

            # --- SEED USER: ADMIN ---
            stmt = select(User).where(User.username == "admin")
            result = await session.execute(stmt)
            admin_user = result.scalar_one_or_none()

            admin_id = uuid.uuid4()  # Tạo ID trước để dùng nếu cần

            if not admin_user:
                print("Seeding admin user...")
                admin_user = User(
                    id=admin_id,
                    username="admin",
                    password_hash=pwd_context.hash("admin123"),
                    role="admin",
                    active=True,
                )
                session.add(admin_user)
            else:
                admin_id = admin_user.id
                print("Admin user already exists.")

            # --- SEED USER: CITIZEN (Cán bộ/Người dân) ---
            stmt = select(Household).where(Household.household_number == "HK001")
            result = await session.execute(stmt)
            household = result.scalar_one_or_none()

            household_id = uuid.uuid4()
            father_id = uuid.uuid4()

            if not household:
                print("Seeding household...")
                # BƯỚC 1: Tạo Hộ khẩu TRƯỚC, KHÔNG gán head_of_household_id ngay
                household = Household(
                    id=household_id,
                    household_number="HK001",
                    # head_of_household_id=...  <-- QUAN TRỌNG: Bỏ dòng này hoặc để None
                    address="Số 1 Đại Cồ Việt",
                    ward="Phường Bách Khoa",
                    scope_id="0001",
                    is_active=True,
                )
                session.add(household)
                # QUAN TRỌNG: Flush ngay để Hộ khẩu tồn tại trong DB, tránh lỗi khi insert Citizen
                await session.flush()

                # --- SEED CITIZENS (Công dân) ---
                print("Seeding citizens...")

                # BƯỚC 2: Tạo Công dân
                father = Citizen(
                    id=father_id,
                    household_id=household_id,  # Link tới hộ khẩu đã flush ở trên
                    full_name="Nguyễn Văn A",
                    date_of_birth=date(1980, 1, 1),
                    place_of_birth="Hà Nội",
                    hometown="Nam Định",
                    ethnicity="Kinh",
                    occupation="Kỹ sư",
                    workplace="Công ty Tech Việt",
                    cccd_number="001080000001",
                    cccd_issue_date=date(2021, 5, 1),
                    cccd_issue_place="Cục CS QLHC về TTXH",
                    residence_registration_date=date(2010, 1, 1),
                    relationship_to_head="Chủ hộ",
                )
                session.add(father)

                mother_id = uuid.uuid4()
                mother = Citizen(
                    id=mother_id,
                    household_id=household_id,
                    full_name="Trần Thị B",
                    date_of_birth=date(1982, 5, 15),
                    place_of_birth="Hà Nam",
                    hometown="Hà Nam",
                    ethnicity="Kinh",
                    occupation="Giáo viên",
                    workplace="Trường THPT Bách Khoa",
                    cccd_number="001082000002",
                    cccd_issue_date=date(2021, 6, 1),
                    cccd_issue_place="Cục CS QLHC về TTXH",
                    residence_registration_date=date(2010, 1, 1),
                    relationship_to_head="Vợ",
                )
                session.add(mother)

                # QUAN TRỌNG: Flush để Công dân thực sự vào DB trước khi link ngược lại
                await session.flush()

                # BƯỚC 3: Cập nhật ngược lại chủ hộ cho Hộ khẩu
                # Lúc này father_id đã tồn tại trong bảng citizens nên không bị lỗi FK nữa
                household.head_of_household_id = father_id
                session.add(household)  # Đánh dấu object này cần update

                # --- SEED MOVEMENT LOG ---
                print("Seeding movement logs...")
                movement = MovementLog(
                    citizen_id=father_id,
                    change_type="Tạm vắng",
                    change_date=date(2023, 10, 1),
                    reason="Đi công tác nước ngoài",
                    destination="Nhật Bản",
                )
                session.add(movement)

            else:
                print("Household already exists (skipping citizen seed).")
                # Get existing father citizen ID for feedback seeding
                stmt = select(Citizen).where(
                    Citizen.household_id == household.id,
                    Citizen.relationship_to_head == "Chủ hộ",
                )
                result = await session.execute(stmt)
                father = result.scalar_one_or_none()
                if father:
                    father_id = father.id

            # --- SEED FEEDBACK (Phản ánh) ---
            # Kiểm tra xem đã có phản ánh nào chưa
            stmt = select(Feedback).limit(1)
            result = await session.execute(stmt)
            existing_feedback = result.scalar_one_or_none()

            if not existing_feedback:
                print("Seeding feedback...")
                feedback_id = uuid.uuid4()
                feedback = Feedback(
                    id=feedback_id,
                    status="pending",
                    category="Môi trường",
                    content="Có bãi rác tự phát tại ngõ 15, mùi hôi thối ảnh hưởng người dân.",
                    scope_id="0001",
                    created_by_user_id=father_id,
                    created_at=datetime.utcnow(),
                )
                session.add(feedback)

                # --- SEED FEEDBACK RESPONSE (Phản hồi) ---
                print("Seeding feedback response...")
                response = FeedbackResponse(
                    content="UBND Phường đã tiếp nhận thông tin và sẽ cử cán bộ xuống kiểm tra trong 24h tới.",
                    agency="UBND Phường Bách Khoa",
                    feedback_id=feedback_id,
                    created_by_user_id=admin_id,  # Admin trả lời
                    responded_at=datetime.utcnow(),
                )
                session.add(response)

                # Cập nhật trạng thái feedback
                feedback.status = "processing"
            else:
                print("Feedbacks already exist.")

            # --- SEED ADMINISTRATIVE DIVISIONS ---
            stmt = select(Province).limit(1)
            result = await session.execute(stmt)
            existing_province = result.scalar_one_or_none()

            if not existing_province:
                print("Seeding administrative divisions...")
                
                # 5 Provinces
                province_data = [
                    ("Hà Nội", "HN"),
                    ("Hồ Chí Minh", "HCM"),
                    ("Đà Nẵng", "DN"),
                    ("Hải Phòng", "HP"),
                    ("Cần Thơ", "CT"),
                ]
                
                for prov_name, prov_code in province_data:
                    province_id = uuid.uuid4()
                    province = Province(
                        id=province_id,
                        name=prov_name,
                        code=prov_code,
                        is_active=True,
                    )
                    session.add(province)
                    await session.flush()
                    
                    # 10 Wards per Province
                    for w_idx in range(1, 11):
                        ward_id = uuid.uuid4()
                        ward = Ward(
                            id=ward_id,
                            province_id=province_id,
                            name=f"Phường {w_idx} - {prov_name}",
                            code=f"{prov_code}-P{w_idx:02d}",
                            is_active=True,
                        )
                        session.add(ward)
                        await session.flush()
                        
                        # 10 Neighborhood Groups per Ward
                        for ng_idx in range(1, 11):
                            ng = NeighborhoodGroup(
                                id=uuid.uuid4(),
                                ward_id=ward_id,
                                name=f"Tổ {ng_idx}",
                                code=f"{prov_code}-P{w_idx:02d}-T{ng_idx:02d}",
                                is_active=True,
                            )
                            session.add(ng)
                    
                print(f"Seeded 5 provinces, 50 wards, 500 neighborhood groups.")
            else:
                print("Administrative divisions already exist.")

        # Commit transaction (được tự động thực hiện khi thoát khỏi block `async with session.begin()`)
        print("Data seeding completed successfully.")

    await engine.dispose()
    print("Database initialization completed.")


if __name__ == "__main__":
    asyncio.run(init_db())
