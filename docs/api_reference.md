# API Reference

## Authentication Service
**Base URL**: `/api/v1/auth`

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/validate` | Validate access token and get user info | Authenticated |
| `POST` | `/login` | Login to get access and refresh tokens | Public |
| `GET` | `/me` | Get current logged-in user information | Authenticated |
| `GET` | `/users` | Get list of all users | Admin |
| `POST` | `/users` | Create a new user | Admin |
| `POST` | `/users/{id}` | Update user information | Admin |
| `POST` | `/{id}/reset-password` | Reset user password | Admin |
| `POST` | `/refresh` | Refresh access token | Public |
| `DELETE` | `/users/{id}/delete` | Delete a user | Admin |
| `POST` | `/users/{id}/lock` | Lock a user account | Admin |
| `PUT` | `/users/{id}/unlock` | Unlock a user account | Admin |
| `POST` | `/internal/audit-logs` | Create audit log (Internal use) | Internal Service |

## Residents Service
**Base URL**: `/api/v1`

### Households (`/hokhau`)
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/hokhau/count` | Count total households with optional filters | Admin, ToTruong, CanBoPhuong |
| `GET` | `/hokhau/` | Get list of households with pagination and search | Admin, ToTruong, CanBoPhuong |
| `GET` | `/hokhau/{id}` | Get household details by ID | Admin, ToTruong, CanBoPhuong |
| `POST` | `/hokhau/` | Create a new household | Admin, ToTruong, CanBoPhuong |
| `PUT` | `/hokhau/{id}` | Update household information | Admin, ToTruong, CanBoPhuong |
| `DELETE` | `/hokhau/{id}` | Soft delete a household | Admin |

### Residents (`/nhankhau`)
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/nhankhau/search` | Search citizens by name or CCCD | Admin, ToTruong, CanBoPhuong |
| `GET` | `/nhankhau/count` | Count total citizens with optional filters | Admin, ToTruong, CanBoPhuong |
| `POST` | `/nhankhau/` | Create a new citizen | Admin, ToTruong, CanBoPhuong |
| `GET` | `/nhankhau/{id}` | Get citizen details by ID | Admin, ToTruong, CanBoPhuong |
| `PUT` | `/nhankhau/{id}` | Update citizen information | Admin, ToTruong, CanBoPhuong |
| `DELETE` | `/nhankhau/{id}` | Soft delete a citizen | Admin |
| `GET` | `/nhankhau/{id}/lich-su-bien-dong` | Get movement logs of a citizen | Public |

## Feedback Service
**Base URL**: `/api/v1`

### Feedback (`/kiennghi`)
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/kiennghi` | Get list of feedbacks with filters | Admin, ToTruong, CanBoPhuong |
| `GET` | `/kiennghi/{feedback_id}` | Get feedback details by ID | Admin, ToTruong, CanBoPhuong |
| `PUT` | `/kiennghi/{feedback_id}` | Update feedback | ToTruong |
| `POST` | `/kiennghi/{feedback_id}/phanhoi` | Respond to feedback | CanBoPhuong |
| `POST` | `/kiennghi/gop` | Merge multiple feedbacks | ToTruong |
| `POST` | `/kiennghi` | Create new feedback | NguoiDan, Admin, ToTruong, CanBoPhuong |

### Reports (`/reports`)
| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/reports/kiennghi-theo-trangthai` | Get feedback statistics by status (JSON, PDF, Excel) | Admin, ToTruong, CanBoPhuong |
