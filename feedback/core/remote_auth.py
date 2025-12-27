import os

import httpx
from fastapi import HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from schemas.auth import AuthRes, UserInfor, UserRole

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://authentication:8000/api/v1")

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
        print(f"[RemoteBearer DEBUG] Starting auth check for {request.method} {request.url}")
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if not credentials:
            print("[RemoteBearer DEBUG] No credentials found")
            raise HTTPException(status_code=403, detail="Invalid authorization code")
        if credentials.scheme != "Bearer":
            print(f"[RemoteBearer DEBUG] Invalid scheme: {credentials.scheme}")
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        token = credentials.credentials
        print(f"[RemoteBearer DEBUG] Token: {token[:20]}...")

        # Extract username from header
        username = request.headers.get("X-Username")
        print(f"[RemoteBearer DEBUG] X-Username header: {username}")
        if not username:
            raise HTTPException(status_code=400, detail="X-Username header is required")

        try:
            client = get_http_client()
            print(f"[RemoteBearer DEBUG] Calling auth service at {AUTH_SERVICE_URL}/validate")
            response = await client.post(
                f"{AUTH_SERVICE_URL}/validate",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "username": username,
                    "access_token": token,
                },
            )

            print(f"[RemoteBearer DEBUG] Auth service status: {response.status_code}")
            if response.status_code != 200:
                print(f"[RemoteBearer DEBUG] Auth service returned {response.status_code}: {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Invalid token or expired",
                )

            data = response.json()
            print(f"[RemoteBearer DEBUG] Auth Response Data: {data}")

            try:
                auth_res = AuthRes(**data)
                print(f"[RemoteBearer DEBUG] AuthRes parsed successfully: {auth_res}")
            except Exception as e:
                print(f"[RemoteBearer DEBUG] Schema Validation Failed: {e}")
                print(f"[RemoteBearer DEBUG] Data received: {data}")
                raise HTTPException(status_code=500, detail="Auth response schema mismatch")

            # Handle Enum: Ensure we have the value string for UserInfor
            role_value = auth_res.role.value if hasattr(auth_res.role, "value") else auth_res.role
            print(f"[RemoteBearer DEBUG] Role value: {role_value}")

            user_data = UserInfor(
                id=auth_res.id,
                role=role_value,
                scope_id=auth_res.scope_id,
                username=username,
                active=True,
            )
            print(f"[RemoteBearer DEBUG] UserInfor created: {user_data}")

            # Check role (compare values)
            # user_data.role should be a string because UserInfor has use_enum_values=True
            current_role = user_data.role
            
            # Additional safety: ensure current_role is a string value for comparison
            if hasattr(current_role, "value"):
                 current_role = current_role.value

            print(f"[RemoteBearer DEBUG] Current role: {current_role}, Accepted roles: {self.accepted_role_list}")
            if current_role in self.accepted_role_list:
                print(f"[RemoteBearer DEBUG] Role check passed, returning user data")
                return user_data

            print(f"[RemoteBearer DEBUG] Role check FAILED: {current_role} not in {self.accepted_role_list}")
            raise HTTPException(status_code=403, detail="Insufficient permissions")

        except HTTPException:
            raise
        except httpx.RequestError as e:
            print(f"HTTPX Request Error: {e}")
            raise HTTPException(
                status_code=500, detail=f"Auth service unreachable at {AUTH_SERVICE_URL}: {str(e)}"
            )
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"Unexpected error in RemoteBearer: {e}")
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
