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
        self.lsbd_table = 'movement_logs'


    async def init_client(self):
        self.client = await create_async_client(self.url, self.key)


    async def create_nhankhau(
        self,
        data: Dict[str, Any],
    ):
        if self.client is None: 
            await self.init_client()
        
        data['is_active'] = True
        response = await (
            self.client.table(self.nhankhau_table)
            .insert(data)
            .execute()
        )

        return response
    

    async def get_nhankhau_detail(
        self,
        id: str,
    ):
        if self.client is None: 
            await self.init_client()

        nhankhau_response = await (
            self.client.table(self.nhankhau_table)
            .select("*")
            .eq("id", id)
            .eq('is_active', True)
            .single()
            .execute()
        )
        if not nhankhau_response.data:
            return None
        
        return nhankhau_response
    

    async def update_nhankhau(
        self, 
        id: str, 
        data: Dict[str, Any],
    ):
        if self.client is None: 
            await self.init_client()

        response = await (
            self.client.table(self.nhankhau_table)
            .update(data)
            .eq('id', id)
            .eq('is_active', True)
            .execute()
        )

        return response


    async def create_movement_log(
        self,
        movement_data: Dict[str, Any],
    ):
        if self.client is None:
            await self.init_client()
        
        response = await (
            self.client.table(self.lsbd_table)
            .insert(movement_data)
            .execute()
        )

        return response


    # soft delete (mark is_Active = False)
    async def delete_nhankhau(
        self, 
        id: str
    ):
        if self.client is None:
            await self.init_client()

        response = await (
            self.client.table(self.nhankhau_table)
            .update({'is_active': False})
            .eq('id', id)
            .execute()
        )

        return response


    async def get_nhankhau_movement_logs(
        self,
        id: str,
    ):
        if self.client is None: 
            await self.init_client()

        response = await (
            self.client.table(self.lsbd_table)
            .select("*")
            .eq("citizen_id", id)
            .order("change_date", desc=True)
            .execute()
        )

        return response


    async def search_nhankhau(
        self,
        q: str,
    ):
        if self.client is None: 
            await self.init_client()

        response = await (
            self.client.table(self.nhankhau_table)
            .select("id, full_name, household:household_id(address)")
            .or_(f"full_name.ilike.%{q}%, cccd_number.ilike.%{q}%")
            .eq('is_active', True)
            .execute()
        )

        return response


    async def count_nhankhau(
        self,
        to_id: str | None = None,
        phuong_id: str | None = None,
    ):
        if self.client is None: 
            await self.init_client()

        query = (self.client.table(self.nhankhau_table)
                .select("id, households!fk_citizens_household!inner(id)", count="exact")
                .eq("is_active", True)
                .eq("households.is_active", True))

        if to_id:
            query = query.eq("households.scope_id", to_id)
        
        if phuong_id:
            query = query.eq('households.scope_id', phuong_id)

        response = await query.execute()

        return response


