import os
from dotenv import load_dotenv
from supabase import AsyncClient, create_async_client
from typing import Optional, Dict, Any

_ = load_dotenv()

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")


class Database:
    def __init__(self, url: str | None = None, key: str | None = None) -> None:
        self.url: str = url if url is not None else SUPABASE_URL
        self.key: str = key if key is not None else SUPABASE_KEY
        self.client: AsyncClient | None = None
        self.hokhau_table = 'households'
        self.nhankhau_table = 'citizens'


    async def init_client(self):
        self.client = await create_async_client(self.url, self.key)


    async def get_hokhau_list(
        self,
        q: Optional[str] = None,
        phuong_xa: Optional[str] = None,
        page: int = 1, # so trang hien thi mac dinh
        limit: int = 20, # so ho khau toi da trong 1 trang 
    ):
        if self.client is None: 
            await self.init_client()

        start = (page - 1) * limit
        end = start + limit - 1

        query = (
            self.client.table(self.hokhau_table)
            .select("*, citizens!fk_households_head(full_name)") 
            .eq("is_active", True)
        )

        # Filter on ward field
        if phuong_xa:
            query = query.eq("ward", phuong_xa)

        # Search on citizens.full_name, address fields
        if q:
            citizens_res = await (
                self.client.table(self.nhankhau_table)
                .select("id")
                .ilike("full_name", f"%{q}%")
                .execute() 
            )
            citizen_ids = [c["id"] for c in citizens_res.data]
            if citizen_ids:
                query = query.or_(
                    f"head_of_household_id.in.({','.join(map(str, citizen_ids))}),address.ilike.%{q}%"
                )
            else:
                query = query.ilike("address", f"%{q}%")

        response = await query.range(start, end).execute()
        return response # type APIResponse


    async def get_hokhau_detail(
        self, 
        id: str
    ):
        if self.client is None: 
            await self.init_client()

        hokhau_response = await (
            self.client.table(self.hokhau_table)
            .select("*")
            .eq("id", id)
            .eq('is_active', True)
            .single()
            .execute()
        )
        if not hokhau_response.data:
            return None

        nhankhau_res = await (
            self.client.table(self.nhankhau_table)
            .select("*")
            .eq("household_id", id)
            .execute()
        )

        hokhau_response.data["nhan_khau"] = nhankhau_res.data or []
        return hokhau_response
    

    async def get_hokhau_detail_without_nhankhau(
        self, 
        id: str
    ):
        if self.client is None: 
            await self.init_client()

        hokhau_response = await (
            self.client.table(self.hokhau_table)
            .select("*")
            .eq("id", id)
            .eq('is_active', True)
            .single()
            .execute()
        )

        if not hokhau_response.data:
            return None

        return hokhau_response


    async def create_hokhau(
        self, 
        data: Dict[str, Any]
    ):
        if self.client is None: 
            await self.init_client()

        data['is_active'] = True
        response = await (
            self.client.table(self.hokhau_table)
            .insert(data)
            .execute()
        )

        return response 
    

    async def update_hokhau(
        self, 
        id: str, 
        data: Dict[str, Any]
    ):
        if self.client is None: 
            await self.init_client()

        response = await (
            self.client.table(self.hokhau_table)
            .update(data).eq('id', id)
            .eq('is_active', True)
            .execute()
        )

        return response
    

    # soft delete (mark is_Active = False)
    async def delete_hokhau(
        self, 
        id: str
    ):
        if self.client is None:
            await self.init_client()

        response = await (
            self.client.table(self.hokhau_table)
            .update({'is_active': False})
            .eq('id', id)
            .execute()
        )

        return response


    async def count_hokhau(
        self,
        to_id: str | None = None,
        phuong_id: str | None = None,
    ):
        if self.client is None:
            await self.init_client()

        query = (
            self.client
            .table(self.hokhau_table)
            .select("id", count="exact")
            .eq("is_active", True)
        )

        if to_id:
            query = query.eq("scope_id", to_id)

        if phuong_id:
            query = query.eq("scope_id", phuong_id)

        response = await query.execute()
        return response






