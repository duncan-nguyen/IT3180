from typing import Any, Dict

from database import AsyncSessionLocal, DbResponse
from models import Citizen, Household, MovementLog
from sqlalchemy import func, or_, select, update
from sqlalchemy.orm import joinedload


class ResidentService:
    @staticmethod
    async def create_nhankhau(data: Dict[str, Any]):
        async with AsyncSessionLocal() as session:
            data["is_active"] = True
            citizen = Citizen(**data)
            session.add(citizen)
            await session.commit()
            await session.refresh(citizen)
            return DbResponse(data=citizen.as_dict())

    @staticmethod
    async def get_nhankhau_detail(id: str):
        async with AsyncSessionLocal() as session:
            query = select(Citizen).filter(
                Citizen.id == id, Citizen.is_active == True
            )
            result = await session.execute(query)
            citizen = result.scalar_one_or_none()
            if not citizen:
                return DbResponse(data=None)
            return DbResponse(data=citizen.as_dict())

    @staticmethod
    async def update_nhankhau(id: str, data: Dict[str, Any]):
        async with AsyncSessionLocal() as session:
            stmt = update(Citizen).where(Citizen.id == id).values(**data)
            await session.execute(stmt)
            await session.commit()

            result = await session.execute(select(Citizen).where(Citizen.id == id))
            citizen = result.scalar_one()
            return DbResponse(data=citizen.as_dict())

    @staticmethod
    async def create_movement_log(movement_data: Dict[str, Any]):
        async with AsyncSessionLocal() as session:
            log = MovementLog(**movement_data)
            session.add(log)
            await session.commit()
            await session.refresh(log)
            return DbResponse(data=log.as_dict())

    @staticmethod
    async def delete_nhankhau(id: str):
        async with AsyncSessionLocal() as session:
            stmt = update(Citizen).where(Citizen.id == id).values(is_active=False)
            await session.execute(stmt)
            await session.commit()
            return DbResponse(data=True)

    @staticmethod
    async def get_nhankhau_movement_logs(id: str):
        async with AsyncSessionLocal() as session:
            query = (
                select(MovementLog)
                .filter(MovementLog.citizen_id == id)
                .order_by(MovementLog.change_date.desc())
            )
            result = await session.execute(query)
            logs = result.scalars().all()
            return DbResponse(data=[l.as_dict() for l in logs])

    @staticmethod
    async def get_all_nhankhau(
        q: str | None = None, page: int = 1, limit: int = 20
    ):
        async with AsyncSessionLocal() as session:
            query = (
                select(Citizen)
                .options(joinedload(Citizen.household))
                .filter(Citizen.is_active == True)
            )

            if q:
                q_filter = f"%{q}%"
                query = query.filter(
                    or_(
                        Citizen.full_name.ilike(q_filter),
                        Citizen.cccd_number.ilike(q_filter),
                    )
                )

            # Get total count
            count_query = select(func.count()).select_from(query.subquery())
            total_result = await session.execute(count_query)
            total = total_result.scalar_one()

            # Apply pagination
            query = query.offset((page - 1) * limit).limit(limit)
            result = await session.execute(query)
            citizens = result.scalars().all()

            data = []
            for c in citizens:
                c_dict = c.as_dict()
                if c.household:
                    c_dict["household"] = c.household.as_dict()
                data.append(c_dict)

            return DbResponse(
                data=data,
                meta={"total": total, "page": page, "limit": limit}
            )

    @staticmethod
    async def search_nhankhau(q: str):
        async with AsyncSessionLocal() as session:
            q_filter = f"%{q}%"
            query = (
                select(Citizen)
                .options(joinedload(Citizen.household))
                .filter(
                    or_(
                        Citizen.full_name.ilike(q_filter),
                        Citizen.cccd_number.ilike(q_filter),
                    ),
                    Citizen.is_active == True,
                )
            )
            result = await session.execute(query)
            citizens = result.scalars().all()

            data = []
            for c in citizens:
                c_dict = c.as_dict()
                if c.household:
                    c_dict["household"] = {"address": c.household.address}
                data.append(c_dict)
            return DbResponse(data=data)

    @staticmethod
    async def count_nhankhau(to_id: str | None = None, phuong_id: str | None = None):
        async with AsyncSessionLocal() as session:
            query = (
                select(Citizen)
                .join(Household, Citizen.household_id == Household.id)
                .filter(Citizen.is_active == True, Household.is_active == True)
            )

            if to_id:
                query = query.filter(Household.scope_id == to_id)
            if phuong_id:
                query = query.filter(Household.scope_id == phuong_id)

            result = await session.execute(query)
            citizens = result.scalars().all()
            return DbResponse(data=citizens)
