# Розділ 9: Data Model & Database Schema

**Версія:** 1.0  
**Дата:** 27 січня 2026  
**Власник:** Database Architect  

---

## 9.1. Database Overview

**DBMS:** PostgreSQL 16 (via Supabase)

**Key Features Used:**
- JSONB for flexible fields
- Full-text search (tsvector)
- Row Level Security (RLS)
- Triggers and functions
- Foreign keys with cascading
- Timestamps (created_at, updated_at)

---

## 9.2. Complete Schema

### 🔐 Auth Tables (Supabase Managed)

```sql
-- Managed by Supabase Auth
auth.users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  encrypted_password text,
  email_confirmed_at timestamp,
  created_at timestamp,
  updated_at timestamp
);
```

---

### 🏢 Organizations Table

```sql
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Subscription
  subscription_tier text NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'solo', 'team', 'firm', 'enterprise')),
  subscription_status text NOT NULL DEFAULT 'active'
    CHECK (subscription_status IN ('active', 'paused', 'cancelled', 'expired')),
  subscription_started_at timestamp,
  subscription_ends_at timestamp,
  
  -- Legal details (for invoices)
  legal_name text,
  tax_id text, -- ЄДРПОУ
  legal_address text,
  contact_phone text,
  contact_email text,
  bank_details jsonb, -- {bank_name, iban, mfo}
  
  -- Metadata
  settings jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_organizations_owner ON organizations(owner_id);
```

---

### 👥 User Organizations (Many-to-Many)

```sql
CREATE TABLE user_organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  role text NOT NULL DEFAULT 'lawyer'
    CHECK (role IN ('owner', 'admin', 'lawyer', 'assistant')),
  
  permissions jsonb DEFAULT '{}',
  invited_at timestamp,
  joined_at timestamp DEFAULT now(),
  
  UNIQUE(user_id, organization_id)
);

CREATE INDEX idx_user_orgs_user ON user_organizations(user_id);
CREATE INDEX idx_user_orgs_org ON user_organizations(organization_id);
```

---

### 👤 Clients Table

```sql
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Type
  client_type text NOT NULL
    CHECK (client_type IN ('individual', 'legal_entity')),
  
  -- Common fields
  name text NOT NULL, -- ПІБ або назва компанії
  phone text NOT NULL,
  email text,
  address text,
  
  -- Individual-specific (when client_type = 'individual')
  first_name text,
  last_name text,
  middle_name text, -- по-батькові
  date_of_birth date,
  tax_number text, -- ІПН
  passport_details jsonb, -- {series, number, issued_by, issued_date}
  
  -- Legal entity-specific (when client_type = 'legal_entity')
  legal_name text,
  tax_id text, -- ЄДРПОУ
  legal_address text,
  contact_person jsonb, -- {name, position, phone, email}
  
  -- Other
  notes text,
  tags text[], -- ['VIP', 'Long-term', etc]
  metadata jsonb DEFAULT '{}',
  
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_clients_org ON clients(organization_id);
CREATE INDEX idx_clients_type ON clients(client_type);
CREATE INDEX idx_clients_search ON clients USING gin(to_tsvector('ukrainian', name || ' ' || COALESCE(phone, '')));
```

---

### 📋 Cases Table

```sql
CREATE TABLE cases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE RESTRICT, -- Don't delete client if cases exist
  
  -- Basic info
  title text NOT NULL,
  case_number text, -- Номер справи в суді (опціонально)
  
  -- Type
  case_type text NOT NULL
    CHECK (case_type IN (
      'civil',          -- Цивільна
      'criminal',       -- Кримінальна
      'administrative', -- Адміністративна
      'commercial',     -- Господарська
      'family',         -- Сімейна
      'land',           -- Земельна
      'labor',          -- Трудова
      'other'
    )),
  
  -- Status
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'active', 'completed', 'archived')),
  
  -- Content
  description text,
  
  -- Court info (optional)
  court_name text,
  court_address text,
  judge_name text,
  
  -- Dates
  opened_at date NOT NULL DEFAULT CURRENT_DATE,
  closed_at date,
  
  -- Assigned lawyers (array of user IDs)
  assigned_to uuid[] DEFAULT '{}',
  
  -- Other
  tags text[],
  metadata jsonb DEFAULT '{}', -- Flexible for custom fields
  
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_cases_org ON cases(organization_id);
CREATE INDEX idx_cases_client ON cases(client_id);
CREATE INDEX idx_cases_status ON cases(organization_id, status);
CREATE INDEX idx_cases_type ON cases(case_type);
CREATE INDEX idx_cases_search ON cases USING gin(to_tsvector('ukrainian', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_cases_assigned ON cases USING gin(assigned_to);
```

---

### 📅 Events Table (Calendar)

```sql
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE, -- Optional: general events can have NULL
  
  -- Event details
  title text NOT NULL,
  event_type text NOT NULL
    CHECK (event_type IN ('hearing', 'meeting', 'deadline', 'call', 'other')),
  
  -- Time
  start_time timestamp NOT NULL,
  end_time timestamp,
  all_day boolean DEFAULT false,
  
  -- Location
  location text, -- Зал суду, адреса зустрічі, etc
  
  -- Description
  description text,
  
  -- Reminders
  reminders jsonb DEFAULT '[]', -- [{type: 'email'|'push', time_before: '1 day'}, ...]
  
  -- Assigned
  assigned_to uuid[] DEFAULT '{}',
  
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_events_org ON events(organization_id);
CREATE INDEX idx_events_case ON events(case_id);
CREATE INDEX idx_events_time ON events(start_time);
CREATE INDEX idx_events_assigned ON events USING gin(assigned_to);
```

---

### 📄 Documents Table

```sql
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  
  -- File info
  filename text NOT NULL,
  file_path text NOT NULL, -- Path in Supabase Storage
  file_size bigint NOT NULL, -- bytes
  mime_type text NOT NULL,
  
  -- Optional
  description text,
  document_type text, -- 'contract', 'lawsuit', 'evidence', 'other'
  tags text[],
  
  -- Version control (Phase 2)
  version integer DEFAULT 1,
  parent_id uuid REFERENCES documents(id), -- For versioning
  
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_documents_org ON documents(organization_id);
CREATE INDEX idx_documents_case ON documents(case_id);
CREATE INDEX idx_documents_type ON documents(document_type);
```

---

### ⏱️ Time Logs Table

```sql
CREATE TABLE time_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Time
  date date NOT NULL DEFAULT CURRENT_DATE,
  duration interval NOT NULL, -- e.g., '2 hours 30 minutes'
  
  -- Details
  description text NOT NULL, -- What was done
  billable boolean NOT NULL DEFAULT true,
  hourly_rate decimal(10,2), -- Hourly rate at time of logging
  
  -- Invoicing
  invoice_id uuid REFERENCES invoices(id), -- NULL if not yet invoiced
  
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_time_logs_org ON time_logs(organization_id);
CREATE INDEX idx_time_logs_case ON time_logs(case_id);
CREATE INDEX idx_time_logs_user ON time_logs(user_id);
CREATE INDEX idx_time_logs_date ON time_logs(date);
CREATE INDEX idx_time_logs_billable ON time_logs(billable) WHERE billable = true;
```

---

### 💰 Invoices Table

```sql
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  case_id uuid REFERENCES cases(id) ON DELETE SET NULL, -- Optional
  
  -- Invoice details
  number text NOT NULL, -- e.g., 'INV-2026-001'
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  
  -- Line items
  items jsonb NOT NULL DEFAULT '[]', 
  -- [{description: 'Legal consultation', quantity: 5, unit: 'hours', price: 1000, total: 5000}, ...]
  
  -- Totals
  subtotal decimal(10,2) NOT NULL,
  tax_rate decimal(5,2) DEFAULT 0, -- %
  tax_amount decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  
  -- Dates
  issued_at date NOT NULL DEFAULT CURRENT_DATE,
  due_at date NOT NULL,
  paid_at date,
  
  -- Payment
  payment_method text, -- 'bank_transfer', 'card', 'cash'
  payment_reference text, -- Bank transaction ID
  
  -- Notes
  notes text,
  
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  
  UNIQUE(organization_id, number)
);

CREATE INDEX idx_invoices_org ON invoices(organization_id);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(organization_id, status);
CREATE INDEX idx_invoices_date ON invoices(issued_at);
```

---

### 🔔 Notifications Table

```sql
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification content
  type text NOT NULL
    CHECK (type IN ('event_reminder', 'invoice_due', 'comment', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  
  -- Related entities
  related_type text, -- 'case', 'event', 'invoice', etc
  related_id uuid,
  
  -- Status
  read boolean DEFAULT false,
  read_at timestamp,
  
  -- Delivery
  delivered_via text[], -- ['email', 'push', 'in_app']
  
  created_at timestamp DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

---

## 9.3. Views (для зручності)

### Active Cases View

```sql
CREATE VIEW active_cases AS
SELECT 
  c.*,
  cl.name as client_name,
  cl.phone as client_phone,
  (SELECT COUNT(*) FROM events WHERE case_id = c.id) as events_count,
  (SELECT COUNT(*) FROM documents WHERE case_id = c.id) as documents_count,
  (SELECT SUM(EXTRACT(epoch FROM duration)/3600) FROM time_logs WHERE case_id = c.id) as total_hours
FROM cases c
JOIN clients cl ON c.client_id = cl.id
WHERE c.status IN ('new', 'active');
```

---

### Upcoming Events View

```sql
CREATE VIEW upcoming_events AS
SELECT 
  e.*,
  c.title as case_title,
  c.case_number,
  cl.name as client_name
FROM events e
LEFT JOIN cases c ON e.case_id = c.id
LEFT JOIN clients cl ON c.client_id = cl.id
WHERE e.start_time > now()
ORDER BY e.start_time ASC;
```

---

## 9.4. Triggers & Functions

### Auto Update Timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Repeat for other tables...
```

---

### Auto-generate Invoice Number

```sql
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
  next_number integer;
  year text;
BEGIN
  IF NEW.number IS NULL THEN
    year := EXTRACT(YEAR FROM CURRENT_DATE)::text;
    
    SELECT COALESCE(MAX(SUBSTRING(number FROM 'INV-[0-9]{4}-([0-9]+)')::integer), 0) + 1
    INTO next_number
    FROM invoices
    WHERE organization_id = NEW.organization_id
      AND number LIKE 'INV-' || year || '%';
    
    NEW.number := 'INV-' || year || '-' || LPAD(next_number::text, 4, '0');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION generate_invoice_number();
```

---

## 9.5. Row Level Security (RLS) Policies

### Cases Policies

```sql
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Users can only see cases from their organizations
CREATE POLICY "Users see own org cases"
  ON cases FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert cases to their organizations
CREATE POLICY "Users can create cases"
  ON cases FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- Users can update cases they have access to
CREATE POLICY "Users can update cases"
  ON cases FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- Similar policies for DELETE, and for other tables...
```

---

## 9.6. Data Relationships Diagram

```
auth.users ─┬─ owns ──→ organizations
            │
            └─ member of ──→ user_organizations ──→ organizations

organizations ─┬─ has ──→ clients
               ├─ has ──→ cases ──→ clients
               ├─ has ──→ events ──→ cases
               ├─ has ──→ documents ──→ cases
               ├─ has ──→ time_logs ──→ cases
               ├─ has ──→ invoices ──→ clients
               └─ has ──→ notifications ──→ users
```

---

## 9.7. Sample Data (for Development)

```sql
-- Organization
INSERT INTO organizations (id, name, owner_id, subscription_tier)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Юридична фірма "Справедливість"', '{user_id}', 'team');

-- Client
INSERT INTO clients (organization_id, client_type, name, phone, email)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'individual',
  'Іваненко Марина Петрівна',
  '+380671234567',
  'marina@example.com'
);

-- Case
INSERT INTO cases (organization_id, client_id, title, case_type, status)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '{client_id}',
  'Розлучення та розподіл майна',
  'family',
  'active'
);
```

---

## 9.8. Indexing Strategy

**Principles:**
1. Index foreign keys (already created)
2. Index WHERE clauses (status, type)
3. Index ORDER BY columns (created_at, start_time)
4. Full-text search indexes (title, description)
5. AVOID over-indexing (slow writes)

**Monitoring:**
```sql
-- Find missing indexes
SELECT schemaname, tablename, attname, n_distinct
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND attname NOT IN (
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public'
  );
```

---

## 9.9. Query Performance

### Slow Query Example (Bad)

```sql
-- N+1 problem
SELECT * FROM cases;
-- Then for each case:
SELECT * FROM clients WHERE id = case.client_id;
```

### Optimized Query (Good)

```sql
-- Single query with JOIN
SELECT 
  c.*,
  cl.name as client_name,
  cl.phone as client_phone
FROM cases c
JOIN clients cl ON c.client_id = cl.id
WHERE c.organization_id = $1;
```

---

### Query Plan Analysis

```sql
EXPLAIN ANALYZE
SELECT * FROM cases
WHERE organization_id = '550e8400-e29b-41d4-a716-446655440000'
  AND status = 'active'
ORDER BY updated_at DESC
LIMIT 20;
```

**Goal:** Seq Scan → Index Scan

---

## 9.10. Data Migrations

### Migration Versioning

```
migrations/
  001_initial_schema.sql
  002_add_invoices.sql
  003_add_notifications.sql
  004_alter_cases_add_tags.sql
```

**Tools:** Supabase Migrations (built-in)

---

### Example Migration

```sql
-- migrations/004_alter_cases_add_tags.sql

-- Up
ALTER TABLE cases ADD COLUMN tags text[];
CREATE INDEX idx_cases_tags ON cases USING gin(tags);

-- Down (rollback)
DROP INDEX idx_cases_tags;
ALTER TABLE cases DROP COLUMN tags;
```

---

## 9.11. Data Validation

### Database Constraints

```sql
-- Email format (simple)
ALTER TABLE clients
ADD CONSTRAINT email_format 
CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$');

-- Phone format (Ukrainian)
ALTER TABLE clients
ADD CONSTRAINT phone_format
CHECK (phone ~ '^\+380[0-9]{9}$');

-- Positive amounts
ALTER TABLE invoices
ADD CONSTRAINT positive_total
CHECK (total > 0);
```

---

### Application-Level Validation (Zod)

```typescript
import { z } from 'zod';

export const caseSchema = z.object({
  title: z.string().min(3).max(200),
  case_type: z.enum(['civil', 'criminal', 'administrative', ...]),
  status: z.enum(['new', 'active', 'completed', 'archived']),
  client_id: z.string().uuid(),
  description: z.string().optional(),
});
```

---

## 9.12. Data Retention & Archival

### Retention Policy

| Data Type | Retention | Action After |
|-----------|----------|-------------|
| Active cases | Indefinite | Keep |
| Completed cases | 5 years | Archive or user choice |
| Archived cases | User choice | Soft delete |
| Deleted cases | 30 days | Hard delete |
| Invoices | 10 years | Legal requirement |
| Audit logs | 3 years | Compliance |

---

### Soft Delete Pattern

```sql
-- Add deleted_at column to cases
ALTER TABLE cases ADD COLUMN deleted_at timestamp;

-- Modified RLS policy
CREATE POLICY "Users see non-deleted cases"
  ON cases FOR SELECT
  USING (
    deleted_at IS NULL
    AND organization_id IN (...)
  );

-- Soft delete function
CREATE FUNCTION soft_delete_case(case_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE cases
  SET deleted_at = now()
  WHERE id = case_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 9.13. Data Export

### GDPR Export

```sql
-- Export all user data
CREATE FUNCTION export_user_data(user_id uuid)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'user', (SELECT row_to_json(u) FROM auth.users u WHERE id = user_id),
    'organizations', (SELECT jsonb_agg(row_to_json(o)) FROM organizations o WHERE owner_id = user_id),
    'cases', (SELECT jsonb_agg(row_to_json(c)) FROM cases c WHERE created_by = user_id),
    -- ... other tables
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

---

## 9.14. Backup & Recovery

**Automated Backups:** Supabase handles this

**Manual Backup:**
```bash
# Export database
pg_dump -h {supabase_host} -U {user} -d {database} > backup.sql

# Restore
psql -h {supabase_host} -U {user} -d {database} < backup.sql
```

---

## 9.15. Database Size Estimation

**Per Organization (avg):**
- Cases: 50 × 2KB = 100KB
- Clients: 30 × 1KB = 30KB
- Events: 200 × 1KB = 200KB
- Documents metadata: 100 × 0.5KB = 50KB
- Time logs: 500 × 0.5KB = 250KB
- Total: ~600KB per org

**1,000 organizations:** ~600MB  
**10,000 organizations:** ~6GB  

**Files (separate from DB):**
- Avg 50MB per org → 50GB for 1,000 orgs

---

**Наступний крок:** API Design document

**Відповідальний:** Database Administrator

**Статус:** ✅ Schema Ready for Implementation
