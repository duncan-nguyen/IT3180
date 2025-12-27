from typing import Any, Dict, Optional

from database import AsyncSessionLocal, DbResponse
from models import Citizen, Household
from sqlalchemy import or_, select, update
from sqlalchemy.orm import joinedload, selectinload


class HouseholdService:
    @staticmethod
    async def get_hokhau_list(
        q: Optional[str] = None,
        phuong_xa: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ):
        async with AsyncSessionLocal() as session:
            query = (
                select(Household)
                .options(joinedload(Household.head_of_household))
                .filter(Household.is_active == True)
            )

            if phuong_xa:
                query = query.filter(Household.ward == phuong_xa)

            if q:
                # Search logic similar to original: matching citizen name -> household head, OR address
                # Original logic: get citizens matching name, find households where head is in that list OR address matches
                # Optimization: Join and filter
                # However, original logic was: head_of_household_id in (matching citizens) OR address matches
                # We can do: Join Citizen on head_of_household_id, filter (Citizen.full_name ilike q OR Household.address ilike q)
                query = query.join(Household.head_of_household)
                query = query.filter(
                    or_(
                        Citizen.full_name.ilike(f"%{q}%"),
                        Household.address.ilike(f"%{q}%"),
                    )
                )

            # Pagination
            # Total count first? Or basic count
            # Supabase usually returns count if requested. API seems to use len(response.data) for pagination count?
            # Wait, api code: "count": len(response.data). That's page size, not total.
            # But normally pagination needs total.
            # Let's check api usage: "pagination": {"page": page, "limit": limit, "count": len(response.data)}
            # It seems the frontend might not get total count for pages?
            # Ah, `get_hokhau_list` returns `response` which has `data`.
            # Let's just return the page data.

            offset = (page - 1) * limit
            query = query.offset(offset).limit(limit)

            result = await session.execute(query)
            households = result.scalars().all()

            data = []
            for h in households:
                h_dict = h.as_dict()
                if h.head_of_household:
                    h_dict["head_of_household"] = {
                        "full_name": h.head_of_household.full_name
                    }
                data.append(h_dict)

            return DbResponse(data=data, count=len(data))

    @staticmethod
    async def get_hokhau_detail(id: str):
        async with AsyncSessionLocal() as session:
            query = (
                select(Household)
                .options(selectinload(Household.members))
                .filter(Household.id == id, Household.is_active == True)
            )

            result = await session.execute(query)
            household = result.scalar_one_or_none()

            if not household:
                return DbResponse(data=None)

            h_dict = household.as_dict()
            h_dict["nhan_khau"] = [m.as_dict() for m in household.members]
            return DbResponse(data=h_dict)

    @staticmethod
    async def get_hokhau_detail_without_nhankhau(id: str):
        async with AsyncSessionLocal() as session:
            query = select(Household).filter(
                Household.id == id, Household.is_active == True
            )
            result = await session.execute(query)
            household = result.scalar_one_or_none()

            if not household:
                return None  # The API checks 'if not existing'

            return DbResponse(data=household.as_dict())

    @staticmethod
    async def get_household_by_citizen_id(citizen_id: str):
        async with AsyncSessionLocal() as session:
            # 1. Find Citizen to get household_id
            query_citizen = select(Citizen).where(Citizen.id == citizen_id)
            result_citizen = await session.execute(query_citizen)
            citizen = result_citizen.scalar_one_or_none()

            if not citizen or not citizen.household_id:
                return None

            # 2. Get Household Detail (re-using logic is better but query is simple)
            query = (
                select(Household)
                .options(selectinload(Household.members))
                .filter(Household.id == citizen.household_id, Household.is_active == True)
            )

            result = await session.execute(query)
            household = result.scalar_one_or_none()

            if not household:
                return None

            h_dict = household.as_dict()
            h_dict["nhan_khau"] = [m.as_dict() for m in household.members]
            return DbResponse(data=h_dict)

    @staticmethod
    async def create_hokhau(data: Dict[str, Any]):
        async with AsyncSessionLocal() as session:
            # Handle data conversion if needed (e.g. UUIDs)
            # data is a dict
            household = Household(**data)
            session.add(household)
            await session.commit()
            await session.refresh(household)
            return DbResponse(data=household.as_dict())

    @staticmethod
    async def update_hokhau(id: str, data: Dict[str, Any]):
        async with AsyncSessionLocal() as session:
            # remove updated_at if it causes issues or handle it
            stmt = update(Household).where(Household.id == id).values(**data)
            await session.execute(stmt)
            await session.commit()

            # Return updated data
            result = await session.execute(select(Household).where(Household.id == id))
            household = result.scalar_one()
            return DbResponse(data=household.as_dict())

    @staticmethod
    async def delete_hokhau(id: str):
        async with AsyncSessionLocal() as session:
            stmt = update(Household).where(Household.id == id).values(is_active=False)
            await session.execute(stmt)
            await session.commit()
            return DbResponse(data=True)

    @staticmethod
    async def count_hokhau(to_id: str | None = None, phuong_id: str | None = None):
        async with AsyncSessionLocal() as session:
            query = select(Household).filter(Household.is_active == True)

            if to_id:
                query = query.filter(Household.scope_id == to_id)
            if phuong_id:
                query = query.filter(
                    Household.scope_id == phuong_id
                )  # original code was scope_id for both? Check services
                # Original: if to_id: query.eq("scope_id", to_id). if phuong_id: query.eq("scope_id", phuong_id)
                # Yes, assumes scope_id fields match context.

            # Returning list of IDs to match "len(response.data)" in controller
            result = await session.execute(query)
            households = result.scalars().all()
            return DbResponse(data=households)
