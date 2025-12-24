# Database Schema Analysis

This document outlines the database structure for the project, analyzing the `authentication`, `residents`, and `feedback` services.

## Overview

The system is composed of three main microservices, each with its own logical schema (though they might share a physical database instance in the current setup).

-   **Authentication**: Manages users and audit logs.
-   **Residents**: Manages households, citizens, movement logs, and temporary residence/absence records.
-   **Feedback**: Manages feedback submissions and responses.

## Entity-Relationship Diagram

```mermaid
erDiagram
    %% Authentication Service
    USERS {
        uuid id PK
        string username
        string password_hash
        string role
        string scope_id
        boolean active
    }
    
    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string action
        string entity_name
        uuid entity_id
        json before_state
        json after_state
        datetime timestamp
    }

    USERS ||--o{ AUDIT_LOGS : "generates"

    %% Residents Service
    HOUSEHOLDS {
        uuid id PK
        string household_number "Unique"
        uuid head_of_household_id FK
        string address
        string ward
        string scope_id
        boolean is_active
    }

    CITIZENS {
        uuid id PK
        uuid household_id FK
        string full_name
        date date_of_birth
        string cccd_number "Unique"
        string place_of_birth
        string role "Relationship to head"
    }

    MOVEMENT_LOGS {
        uuid id PK
        uuid citizen_id FK
        string change_type
        date change_date
        string reason
        string destination
    }

    TEMPORARY_RECORDS {
        uuid id PK
        uuid citizen_id FK
        string record_type "TAM_TRU | TAM_VANG"
        date start_date
        date end_date
        string status "PENDING | APPROVED | REJECTED | EXPIRED"
    }

    %% Residents Relationships
    HOUSEHOLDS ||--o{ CITIZENS : "has members"
    CITIZENS ||--|| HOUSEHOLDS : "is head of"
    CITIZENS ||--o{ MOVEMENT_LOGS : "has"
    CITIZENS ||--o{ TEMPORARY_RECORDS : "requests"

    %% Feedback Service
    FEEDBACKS {
        uuid id PK
        string status
        string category
        string content
        json attachment_urls
        string scope_id
        int report_count
        uuid created_by_user_id
        uuid parent_id FK
    }

    FEEDBACK_RESPONSES {
        uuid id PK
        uuid feedback_id FK
        string content
        string agency
        string attachment_url
        uuid created_by_user_id
        datetime responded_at
    }

    %% Feedback Relationships
    FEEDBACKS ||--o{ FEEDBACK_RESPONSES : "has"
    FEEDBACKS ||--o{ FEEDBACKS : "parent (optional)"
```

## Table Details

### Authentication Service

#### `users`
- Stores system users (admin, etc.).
- `scope_id` is used potentially for multi-tenancy or permission scoping.

#### `audit_logs`
- Tracks actions performed by users.

### Residents Service

#### `households`
- Represents a household unit.
- **Circular Dependency**: Contains `head_of_household_id` pointing to `citizens.id`, while `citizens` contains `household_id` pointing to `households`. This requires careful handling during insertion (e.g., insert household with null head, insert citizen, update household head).

#### `citizens`
- Represents an individual.
- `cccd_number` is a unique identifier (ID card).

#### `movement_logs`
- Tracks changes like moving in or out.

#### `temporary_records`
- Manages temporary residence (Tạm trú) and temporary absence (Tạm vắng).
- Uses `record_type` and `status`.

### Feedback Service

#### `feedbacks`
- Stores user feedback/reports.
- Can have a `parent_id` suggesting a threaded structure or linked reports.

#### `feedback_responses`
- Responses from agencies to the feedback.

## Notes

-   **Foreign Keys**: Explicit foreign keys exist within services. Cross-service relationships (e.g., `created_by_user_id` in `Feedback` referring to `User`) are logical and typically not enforced by database constraints if services are separated.
-   **UUID**: All tables use UUIDs as primary keys.
-   **Timestamps**: Most tables track `created_at`/`updated_at`, though they are not explicitly shown in every model definition above (some use mixins or default values not fully visible in the snippet, but assumed standard practice).
