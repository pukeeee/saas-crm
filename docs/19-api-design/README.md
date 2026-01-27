# Розділ 19: API Design

**Версія:** 1.0  
**Дата:** 27 січня 2026  
**Власник:** Engineering Team  

---

## 19.1. Executive Summary

**Мета:** Визначити RESTful API для Justio CRM, який буде використовуватися frontend додатком та (в Phase 2+) третіми сторонами.

**API Philosophy:**
- 🎯 **Simple & Predictable** — RESTful conventions
- 📖 **Well-documented** — OpenAPI/Swagger spec
- 🔒 **Secure** — Authentication, authorization, rate limiting
- ⚡ **Fast** — Response time <300ms (p95)
- 🔄 **Versioned** — Breaking changes handled gracefully

**Base URL:**
```
Production:  https://api.justio.ua/v1
Staging:     https://api-staging.justio.ua/v1
```

---

## 19.2. API Design Principles

### 🎨 RESTful Conventions

**HTTP Methods:**
- `GET` — Retrieve resource(s)
- `POST` — Create new resource
- `PUT` — Update entire resource (replace)
- `PATCH` — Update partial resource (modify)
- `DELETE` — Delete resource

**URL Structure:**
```
/api/v1/{resource}         (collection)
/api/v1/{resource}/{id}    (single item)
/api/v1/{resource}/{id}/{sub-resource}
```

**Examples:**
```
GET    /api/v1/cases              (list all cases)
GET    /api/v1/cases/123          (get case by ID)
POST   /api/v1/cases              (create new case)
PUT    /api/v1/cases/123          (update case)
DELETE /api/v1/cases/123          (delete case)

GET    /api/v1/cases/123/documents    (get case documents)
POST   /api/v1/cases/123/documents    (upload document to case)
```

---

### 📋 Naming Conventions

**Resources:**
- Plural nouns: `/cases`, `/clients`, `/events`
- Lowercase with hyphens: `/time-entries`, `/court-cases`
- NO verbs in URLs: ❌ `/getCases`, ✅ `GET /cases`

**Query Parameters:**
- Filtering: `?status=active`
- Sorting: `?sort=-created_at` (- for descending)
- Pagination: `?page=2&per_page=20`
- Search: `?q=search+term`
- Fields: `?fields=id,name,status`

---

### 🔢 Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| **200** | OK | Successful GET, PUT, PATCH |
| **201** | Created | Successful POST |
| **204** | No Content | Successful DELETE |
| **400** | Bad Request | Invalid input, validation error |
| **401** | Unauthorized | Not authenticated (no token) |
| **403** | Forbidden | Not authorized (wrong permissions) |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Resource already exists |
| **422** | Unprocessable Entity | Validation failed |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server error |
| **503** | Service Unavailable | Maintenance mode |

---

## 19.3. Authentication

### 🔐 JWT Bearer Token

**Header:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Structure:**
```json
{
  "sub": "user-uuid",
  "org_id": "org-uuid",
  "role": "admin",
  "exp": 1706356800,
  "iat": 1706270400
}
```

**Obtaining Token:**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response 200:
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "refresh_token": "dGVzdCByZWZyZXNo...",
  "expires_in": 604800,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Олена Коваленко"
  }
}
```

**Token Refresh:**
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "dGVzdCByZWZyZXNo..."
}

Response 200:
{
  "access_token": "new-token...",
  "expires_in": 604800
}
```

---

### 🚫 Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": "No valid token provided"
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions",
    "details": "You don't have access to this organization"
  }
}
```

---

## 19.4. API Endpoints

### 📁 Cases

#### GET /api/v1/cases

**Description:** List all cases for current user's organization

**Query Parameters:**
- `page` (integer, default: 1)
- `per_page` (integer, default: 20, max: 100)
- `status` (string: active, completed, archived)
- `type` (string: civil, criminal, commercial, administrative)
- `client_id` (uuid)
- `sort` (string: created_at, updated_at, name)
- `q` (string: search query)

**Example Request:**
```http
GET /api/v1/cases?status=active&sort=-created_at&page=1&per_page=20
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Розлучення Петренко",
      "number": "2024-001",
      "type": "civil",
      "status": "active",
      "client": {
        "id": "client-uuid",
        "name": "Петренко Марія Іванівна",
        "type": "individual"
      },
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-01-27T14:20:00Z",
      "next_event": {
        "id": "event-uuid",
        "title": "Перше засідання",
        "date": "2026-02-15T10:00:00Z"
      }
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

#### GET /api/v1/cases/{id}

**Description:** Get single case by ID

**Path Parameters:**
- `id` (uuid, required)

**Example Request:**
```http
GET /api/v1/cases/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Розлучення Петренко",
    "number": "2024-001",
    "type": "civil",
    "status": "active",
    "description": "Розлучення та розподіл майна",
    "client": {
      "id": "client-uuid",
      "name": "Петренко Марія Іванівна",
      "type": "individual",
      "phone": "+380671234567",
      "email": "maria@example.com"
    },
    "responsible_lawyer": {
      "id": "user-uuid",
      "name": "Олена Коваленко",
      "email": "olena@law.ua"
    },
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-27T14:20:00Z",
    "stats": {
      "documents_count": 5,
      "events_count": 3,
      "time_logged": 12.5,
      "invoices_count": 2
    }
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Case not found",
    "details": "Case with ID 550e8400... does not exist"
  }
}
```

---

#### POST /api/v1/cases

**Description:** Create new case

**Request Body:**
```json
{
  "name": "Спадщина Сидоренко",
  "number": "2024-002",
  "type": "civil",
  "status": "active",
  "client_id": "client-uuid",
  "description": "Вступ у спадщину після батька",
  "responsible_lawyer_id": "user-uuid"
}
```

**Validation Rules:**
- `name`: required, string, max 255
- `type`: required, enum (civil, criminal, commercial, administrative)
- `status`: optional, enum (active, completed, archived), default: active
- `client_id`: required, uuid, must exist
- `description`: optional, string, max 5000

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "Спадщина Сидоренко",
    "number": "2024-002",
    "type": "civil",
    "status": "active",
    "client": { ... },
    "created_at": "2026-01-27T15:00:00Z",
    "updated_at": "2026-01-27T15:00:00Z"
  }
}
```

**Response 400 (Validation Error):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "fields": {
      "name": ["Назва справи обов'язкова"],
      "client_id": ["Клієнт не знайдений"]
    }
  }
}
```

---

#### PUT /api/v1/cases/{id}

**Description:** Update entire case (replace)

**Request Body:**
```json
{
  "name": "Розлучення Петренко (оновлено)",
  "status": "completed",
  "description": "Справа завершена 27.01.2026"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

#### PATCH /api/v1/cases/{id}

**Description:** Partially update case (modify)

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

#### DELETE /api/v1/cases/{id}

**Description:** Delete case (soft delete)

**Response 204:** No content

**Note:** Soft delete (sets `deleted_at`), not hard delete

---

### 👤 Clients

#### GET /api/v1/clients

**Query Parameters:**
- `page`, `per_page`, `sort`, `q` (same as cases)
- `type` (individual, legal_entity)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "client-uuid",
      "name": "Петренко Марія Іванівна",
      "type": "individual",
      "phone": "+380671234567",
      "email": "maria@example.com",
      "cases_count": 3,
      "created_at": "2026-01-10T09:00:00Z"
    }
  ],
  "meta": { ... }
}
```

---

#### POST /api/v1/clients

**Request Body (Individual):**
```json
{
  "type": "individual",
  "first_name": "Марія",
  "last_name": "Петренко",
  "middle_name": "Іванівна",
  "phone": "+380671234567",
  "email": "maria@example.com",
  "address": "Київ, вул. Хрещатик 1",
  "birth_date": "1985-05-15",
  "tax_id": "1234567890"
}
```

**Request Body (Legal Entity):**
```json
{
  "type": "legal_entity",
  "name": "ТОВ 'Будсервіс'",
  "edrpou": "12345678",
  "phone": "+380441234567",
  "email": "info@budservis.ua",
  "legal_address": "Київ, просп. Перемоги 50",
  "contact_person": {
    "name": "Іванов Іван Іванович",
    "position": "Директор",
    "phone": "+380671234567"
  }
}
```

**Response 201:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 📅 Events

#### GET /api/v1/events

**Query Parameters:**
- `page`, `per_page`, `sort`
- `case_id` (uuid)
- `type` (hearing, meeting, deadline, call, other)
- `from_date` (ISO 8601)
- `to_date` (ISO 8601)

**Example:**
```http
GET /api/v1/events?from_date=2026-02-01&to_date=2026-02-29&type=hearing
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "event-uuid",
      "title": "Перше засідання",
      "type": "hearing",
      "date": "2026-02-15T10:00:00Z",
      "duration": 60,
      "location": "Київський райсуд, зал 12",
      "case": {
        "id": "case-uuid",
        "name": "Розлучення Петренко"
      },
      "reminders": [
        { "before": 1440, "type": "email" },
        { "before": 60, "type": "push" }
      ],
      "created_at": "2026-01-20T14:00:00Z"
    }
  ],
  "meta": { ... }
}
```

---

#### POST /api/v1/events

**Request Body:**
```json
{
  "title": "Консультація з клієнтом",
  "type": "meeting",
  "date": "2026-02-10T15:00:00Z",
  "duration": 60,
  "location": "Офіс",
  "case_id": "case-uuid",
  "description": "Обговорення стратегії",
  "reminders": [
    { "before": 1440, "type": "email" },
    { "before": 60, "type": "push" }
  ]
}
```

**Validation:**
- `title`: required, string, max 255
- `type`: required, enum
- `date`: required, ISO 8601 datetime
- `duration`: optional, integer (minutes)
- `reminders.before`: integer (minutes before event)

**Response 201:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 📄 Documents

#### GET /api/v1/cases/{case_id}/documents

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "doc-uuid",
      "name": "Позовна заява.pdf",
      "type": "application/pdf",
      "size": 1048576,
      "url": "https://storage.justio.ua/documents/...",
      "uploaded_by": {
        "id": "user-uuid",
        "name": "Олена Коваленко"
      },
      "created_at": "2026-01-18T11:30:00Z"
    }
  ]
}
```

---

#### POST /api/v1/cases/{case_id}/documents

**Request:** `multipart/form-data`

```http
POST /api/v1/cases/550e8400.../documents
Content-Type: multipart/form-data
Authorization: Bearer <token>

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="dovirenitst.pdf"
Content-Type: application/pdf

<binary data>
------WebKitFormBoundary--
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "doc-uuid",
    "name": "dovirenitst.pdf",
    "url": "https://storage.justio.ua/...",
    "size": 524288,
    "created_at": "2026-01-27T16:00:00Z"
  }
}
```

**Validation:**
- Max file size: 10 MB (Solo), 50 MB (Team+)
- Allowed types: PDF, DOCX, DOC, JPEG, PNG, ZIP

**Response 413 (File Too Large):**
```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File exceeds maximum size",
    "details": "Max size: 10 MB"
  }
}
```

---

### ⏱️ Time Entries

#### GET /api/v1/time-entries

**Query Parameters:**
- `case_id` (uuid)
- `user_id` (uuid)
- `from_date`, `to_date`
- `billable` (boolean)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "time-uuid",
      "case": {
        "id": "case-uuid",
        "name": "Розлучення Петренко"
      },
      "user": {
        "id": "user-uuid",
        "name": "Олена Коваленко"
      },
      "date": "2026-01-27",
      "duration": 2.5,
      "description": "Підготовка позовної заяви",
      "billable": true,
      "created_at": "2026-01-27T18:00:00Z"
    }
  ],
  "meta": { ... }
}
```

---

#### POST /api/v1/time-entries

**Request Body:**
```json
{
  "case_id": "case-uuid",
  "date": "2026-01-27",
  "duration": 2.5,
  "description": "Консультація клієнта",
  "billable": true
}
```

**Validation:**
- `case_id`: required, uuid
- `date`: required, ISO 8601 date
- `duration`: required, float (hours)
- `description`: required, string, max 500

**Response 201:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 💰 Invoices

#### GET /api/v1/invoices

**Query Parameters:**
- `status` (draft, sent, paid, overdue, cancelled)
- `client_id` (uuid)
- `from_date`, `to_date`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "invoice-uuid",
      "number": "INV-2026-001",
      "client": {
        "id": "client-uuid",
        "name": "Петренко М.І."
      },
      "case": {
        "id": "case-uuid",
        "name": "Розлучення Петренко"
      },
      "amount": 8000,
      "currency": "UAH",
      "status": "paid",
      "issue_date": "2026-01-27",
      "due_date": "2026-02-10",
      "paid_date": "2026-02-05",
      "items": [
        {
          "description": "Консультація",
          "quantity": 3,
          "unit_price": 1000,
          "amount": 3000
        },
        {
          "description": "Підготовка документів",
          "quantity": 1,
          "unit_price": 5000,
          "amount": 5000
        }
      ],
      "created_at": "2026-01-27T19:00:00Z"
    }
  ],
  "meta": { ... }
}
```

---

#### POST /api/v1/invoices

**Request Body:**
```json
{
  "client_id": "client-uuid",
  "case_id": "case-uuid",
  "issue_date": "2026-01-27",
  "due_date": "2026-02-10",
  "items": [
    {
      "description": "Консультація",
      "quantity": 3,
      "unit_price": 1000
    },
    {
      "description": "Підготовка документів",
      "quantity": 1,
      "unit_price": 5000
    }
  ],
  "notes": "Оплата протягом 14 днів"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "invoice-uuid",
    "number": "INV-2026-001",
    "amount": 8000,
    "pdf_url": "https://storage.justio.ua/invoices/INV-2026-001.pdf",
    ...
  }
}
```

---

## 19.5. Pagination

### 📄 Standard Pagination

**Request:**
```http
GET /api/v1/cases?page=2&per_page=20
```

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 2,
    "per_page": 20,
    "total": 85,
    "total_pages": 5,
    "has_next": true,
    "has_prev": true
  },
  "links": {
    "first": "/api/v1/cases?page=1&per_page=20",
    "prev": "/api/v1/cases?page=1&per_page=20",
    "next": "/api/v1/cases?page=3&per_page=20",
    "last": "/api/v1/cases?page=5&per_page=20"
  }
}
```

**Defaults:**
- `page`: 1
- `per_page`: 20 (max: 100)

---

### ♾️ Cursor-Based Pagination (Future)

**For large datasets, real-time feeds:**

```http
GET /api/v1/events?cursor=eyJpZCI6IjEyMyIsImNyZWF0ZWRfYXQiOiIyMDI2...
```

**Response:**
```json
{
  "data": [ ... ],
  "meta": {
    "next_cursor": "eyJpZCI6IjQ1NiIsImNyZWF...",
    "has_next": true
  }
}
```

---

## 19.6. Filtering & Searching

### 🔍 Search

**Full-text search:**
```http
GET /api/v1/cases?q=петренко
```

**Search in specific fields:**
```http
GET /api/v1/cases?name=петренко&status=active
```

---

### 🎯 Filtering

**Multiple values (OR):**
```http
GET /api/v1/cases?status=active,completed
```

**Date ranges:**
```http
GET /api/v1/events?from_date=2026-02-01&to_date=2026-02-29
```

**Boolean:**
```http
GET /api/v1/time-entries?billable=true
```

---

### 📊 Sorting

**Single field:**
```http
GET /api/v1/cases?sort=name           (ascending)
GET /api/v1/cases?sort=-created_at    (descending)
```

**Multiple fields:**
```http
GET /api/v1/cases?sort=-status,name
```

---

### 🎛️ Field Selection

**Return only specific fields:**
```http
GET /api/v1/cases?fields=id,name,status
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Справа 1",
      "status": "active"
    }
  ]
}
```

**Benefits:**
- Reduce bandwidth
- Faster response times
- Mobile-friendly

---

## 19.7. Rate Limiting

### ⏱️ Limits

| Plan | Requests/hour | Burst |
|------|--------------|-------|
| **Free** | 100 | 10/min |
| **Solo** | 1,000 | 20/min |
| **Team** | 5,000 | 50/min |
| **Firm** | 10,000 | 100/min |
| **Enterprise** | Custom | Custom |

**Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1706356800
```

**Response 429 (Rate Limit Exceeded):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": "Try again in 3600 seconds",
    "retry_after": 3600
  }
}
```

---

## 19.8. Webhooks (Phase 2+)

### 🪝 Event Types

**Available Events:**
- `case.created`
- `case.updated`
- `case.deleted`
- `event.upcoming` (24h before)
- `invoice.created`
- `invoice.paid`
- `document.uploaded`

**Webhook Payload:**
```json
{
  "event": "case.created",
  "timestamp": "2026-01-27T20:00:00Z",
  "data": {
    "id": "case-uuid",
    "name": "Нова справа",
    ...
  }
}
```

**Signature Verification:**
```http
X-Justio-Signature: sha256=abc123...
```

---

## 19.9. API Versioning

### 🔢 Strategy

**URL Versioning:**
```
/api/v1/cases
/api/v2/cases
```

**Breaking Changes:**
- New major version (/v2)
- Old version supported for 12 months
- Deprecation warnings (header)

**Non-Breaking Changes:**
- Same version
- Additive only (new fields, endpoints)

**Deprecation Notice:**
```http
X-API-Deprecated: true
X-API-Deprecation-Date: 2027-01-01
X-API-Sunset-Date: 2027-06-01
Link: <https://docs.justio.ua/migration-guide>; rel="deprecation"
```

---

## 19.10. Error Handling

### 🚨 Error Response Format

**Standard Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": "Additional context (optional)",
    "fields": { ... }  // For validation errors
  }
}
```

---

### 📋 Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `UNAUTHORIZED` | 401 | No authentication |
| `FORBIDDEN` | 403 | No permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Maintenance |

---

### 🛠️ Validation Errors

**Example:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "fields": {
      "name": [
        "Назва справи обов'язкова",
        "Назва має бути менше 255 символів"
      ],
      "client_id": [
        "Клієнт не знайдений"
      ]
    }
  }
}
```

---

## 19.11. API Documentation

### 📖 OpenAPI (Swagger) Spec

**Auto-generated:**
```yaml
openapi: 3.0.0
info:
  title: Justio CRM API
  version: 1.0.0
  description: RESTful API for Justio CRM

servers:
  - url: https://api.justio.ua/v1
    description: Production
  - url: https://api-staging.justio.ua/v1
    description: Staging

paths:
  /cases:
    get:
      summary: List cases
      tags: [Cases]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CaseList'
```

**Interactive Docs:**
- Swagger UI: `https://api.justio.ua/docs`
- Redoc: `https://api.justio.ua/redoc`

---

### 🧪 Postman Collection

**Export Postman collection:**
```json
{
  "info": {
    "name": "Justio API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/"
  },
  "item": [
    {
      "name": "Cases",
      "item": [
        {
          "name": "List Cases",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/cases"
          }
        }
      ]
    }
  ]
}
```

**Variables:**
- `baseUrl`: `https://api.justio.ua/v1`
- `token`: `<your-jwt-token>`

---

## 19.12. SDK & Libraries (Future)

### 💻 Official SDKs (Phase 3+)

**JavaScript/TypeScript:**
```typescript
import { JustioClient } from '@justio/sdk';

const client = new JustioClient({
  token: 'your-jwt-token'
});

const cases = await client.cases.list({
  status: 'active',
  page: 1
});
```

**Python:**
```python
from justio import Client

client = Client(token='your-jwt-token')
cases = client.cases.list(status='active', page=1)
```

**Other Languages:**
- PHP (Phase 3+)
- Ruby (Phase 3+)
- Go (Phase 3+)

---

## 19.13. Testing

### 🧪 Test Environment

**Sandbox API:**
```
https://api-sandbox.justio.ua/v1
```

**Test Credentials:**
```
Email: test@example.com
Password: test123
```

**Test Data:**
- Pre-populated cases, clients
- Reset daily (midnight UTC)

---

### ✅ API Testing Checklist

**Unit Tests:**
- [ ] All endpoints have tests
- [ ] Authentication/authorization tested
- [ ] Validation rules tested
- [ ] Error handling tested

**Integration Tests:**
- [ ] End-to-end workflows
- [ ] External service mocks
- [ ] Database transactions

**Load Tests:**
- [ ] 100 req/s (MVP target)
- [ ] 1,000 req/s (Phase 2 target)
- [ ] Response time <300ms (p95)

---

## 19.14. Security

### 🔒 Best Practices

**Input Validation:**
- Validate all inputs (type, format, range)
- Sanitize strings (prevent XSS)
- Use parameterized queries (prevent SQL injection)

**Rate Limiting:**
- Per user + per organization
- Exponential backoff for failures
- CAPTCHA for repeated failures

**CORS:**
```http
Access-Control-Allow-Origin: https://justio.ua
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
```

**HTTPS Only:**
- Redirect HTTP → HTTPS
- HSTS header: `Strict-Transport-Security: max-age=31536000`

**Secrets:**
- No secrets in URLs (use headers)
- No sensitive data in logs
- Rotate keys regularly

---

## 19.15. Monitoring & Analytics

### 📊 Metrics

**Track:**
- Request count (per endpoint)
- Response time (p50, p95, p99)
- Error rate (4xx, 5xx)
- Most used endpoints
- Slowest endpoints

**Tools:**
- Vercel Analytics
- Sentry (error tracking)
- Custom dashboard (Grafana)

**Alerts:**
- Error rate >5% → alert
- Response time p95 >1s → alert
- Downtime → immediate alert

---

## 19.16. API Changelog

### 📜 Version History

**v1.0.0 (2026-01-27):**
- Initial release
- Core endpoints: cases, clients, events, documents, time-entries, invoices
- JWT authentication
- Rate limiting

**Future Versions:**
- v1.1.0: Webhooks, advanced filtering
- v1.2.0: Batch operations, GraphQL endpoint
- v2.0.0: Breaking changes (new data model)

---

## 19.17. Migration Guide (Future v2)

**When v2 Released:**

**Breaking Changes:**
- `status` field renamed to `state`
- `type` enum values changed
- Authentication: OAuth 2.0 required

**Migration Steps:**
1. Update SDK to v2
2. Replace deprecated endpoints
3. Test thoroughly
4. Deploy

**Compatibility Mode:**
- v1 supported until 2027-06-01
- Use `Accept: application/vnd.justio.v1+json` header

---

## 19.18. Best Practices for API Consumers

### ✅ Recommendations

**DO:**
- ✅ Cache responses (use ETags)
- ✅ Use pagination (don't fetch all)
- ✅ Handle errors gracefully
- ✅ Respect rate limits
- ✅ Use HTTPS always
- ✅ Keep tokens secure

**DON'T:**
- ❌ Hardcode tokens in code
- ❌ Poll frequently (use webhooks)
- ❌ Ignore error responses
- ❌ Fetch unnecessary data (use field selection)

---

**Status:** ✅ Ready for Implementation  
**Owner:** Backend Team  
**Next:** Implement API endpoints, generate OpenAPI spec
