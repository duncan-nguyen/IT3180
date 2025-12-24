import os

import httpx
from fastapi import HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from schemas.auth import AuthRes, UserInfor, UserRole

AUTH_SERVICE_URL = os.getenv(
    "AUTH_SERVICE_URL", "http://authentication:8000/api/v1/auth"
)

# Create a shared client
_http_client = None


def get_http_client():
    global _http_client
    if _http_client is None:
        _http_client = httpx.AsyncClient()
    return _http_client


class RemoteBearer(HTTPBearer):
    def __init__(
        self,
        accepted_role_list: list[UserRole] | list[str] = [],
        auto_error: bool = True,
    ):
        super().__init__(auto_error=auto_error)
        self.accepted_role_list = [
            r.value if isinstance(r, UserRole) else r for r in accepted_role_list
        ]

    async def __call__(self, request: Request) -> UserInfor:
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if not credentials:
            raise HTTPException(status_code=403, detail="Invalid authorization code")
        if credentials.scheme != "Bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        token = credentials.credentials

        # Extract username from header
        username = request.headers.get("X-Username")
        if not username:
            raise HTTPException(status_code=400, detail="X-Username header is required")

        try:
            client = get_http_client()
            response = await client.post(
                f"{AUTH_SERVICE_URL}/validate",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "username": username,
                    "access_token": token,
                },
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Invalid token or expired",
                )

            data = response.json()
            auth_res = AuthRes(**data)

            user_data = UserInfor(
                id=auth_res.id,
                role=auth_res.role,
                scope_id=auth_res.scope_id,
                username=username,
                active=True,
            )

            if user_data.role in self.accepted_role_list:
                return user_data

            raise HTTPException(status_code=403, detail="Insufficient permissions")

        except HTTPException:
            raise
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=500, detail=f"Auth service unreachable: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
