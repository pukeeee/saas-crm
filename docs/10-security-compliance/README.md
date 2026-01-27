# Розділ 10: Security & Compliance

**Версія:** 1.0  
**Дата:** 27 січня 2026  
**Власник:** Security Team  

---

## 10.1. Security Overview

**Принцип:** Defense in Depth (багатошаровий захист)

**Рівні безпеки:**
1. Network Security (HTTPS, CORS, Rate Limiting)
2. Application Security (Input validation, CSRF, XSS)
3. Data Security (Encryption, RLS, Backups)
4. Access Control (Auth, RBAC)
5. Operational Security (Monitoring, Incident Response)

---

## 10.2. Network Security

### 🔒 HTTPS Everywhere

**Requirements:**
- TLS 1.3 only (no older versions)
- Valid SSL certificate (Let's Encrypt via Vercel)
- HSTS header (force HTTPS)

```typescript
// Next.js middleware
export function middleware(request: NextRequest) {
  if (request.nextUrl.protocol !== 'https:') {
    return NextResponse.redirect(
      `https://${request.nextUrl.hostname}${request.nextUrl.pathname}`,
      301
    );
  }
}
```

---

### 🚧 CORS Policy

```typescript
// api/cors.ts
const corsOptions = {
  origin: [
    'https://justio.com.ua',
    'https://app.justio.com.ua',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
```

---

### ⏱️ Rate Limiting

**Limits:**
- Authentication: 5 attempts / 15 min
- API calls: 100 requests / min per user
- File uploads: 10 uploads / hour
- Password reset: 3 attempts / hour

**Implementation:** Vercel Edge Config + Upstash Redis

```typescript
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
});

export async function middleware(req: Request) {
  const ip = req.headers.get("x-forwarded-for");
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }
}
```

---

## 10.3. Application Security

### 🛡️ Input Validation

**All inputs validated with Zod:**

```typescript
import { z } from 'zod';

// Example: Case creation
const createCaseSchema = z.object({
  title: z.string()
    .min(3, "Title too short")
    .max(200, "Title too long")
    .regex(/^[a-zA-Zа-яА-ЯіІїЇєЄ0-9\s\-.,!?]+$/, "Invalid characters"),
  
  client_id: z.string().uuid("Invalid client ID"),
  
  case_type: z.enum([
    'civil', 'criminal', 'administrative', 
    'commercial', 'family', 'land', 'labor', 'other'
  ]),
  
  description: z.string().max(5000).optional(),
});

// Usage
export async function createCase(data: unknown) {
  const validated = createCaseSchema.parse(data); // Throws if invalid
  // ... proceed with validated data
}
```

---

### 🚫 XSS Prevention

**React auto-escapes by default, but:**

```typescript
// NEVER use dangerouslySetInnerHTML without sanitization
import DOMPurify from 'dompurify';

function CaseDescription({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href'],
  });
  
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

---

### 🔐 CSRF Protection

**Next.js handles this automatically for same-origin requests**

For external APIs:
```typescript
// Generate CSRF token
import { randomBytes } from 'crypto';

const csrfToken = randomBytes(32).toString('hex');

// Store in session
cookies().set('csrf_token', csrfToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
});

// Validate on POST
if (req.cookies.get('csrf_token') !== req.headers.get('x-csrf-token')) {
  return new Response("Invalid CSRF token", { status: 403 });
}
```

---

### 💉 SQL Injection Prevention

**Supabase uses parameterized queries → immune to SQL injection**

```typescript
// SAFE (parameterized)
const { data } = await supabase
  .from('cases')
  .select('*')
  .eq('client_id', clientId); // clientId is safely escaped

// UNSAFE (NEVER DO THIS)
const query = `SELECT * FROM cases WHERE client_id = '${clientId}'`;
// ⚠️ Vulnerable to SQL injection!
```

---

## 10.4. Data Security

### 🔒 Encryption

**At Rest:**
- Database: AES-256 (Supabase default)
- File storage: AES-256 (Supabase Storage)
- Backups: Encrypted

**In Transit:**
- TLS 1.3 (HTTPS)
- Database connections: SSL/TLS

**Application-Level (sensitive fields):**
```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = process.env.ENCRYPTION_KEY!;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':');
  
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key),
    Buffer.from(ivHex, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Usage for sensitive data
const sensitiveNote = encrypt(clientNote);
await supabase.from('clients').insert({ encrypted_notes: sensitiveNote });
```

---

### 🗄️ Row Level Security (RLS)

**Enforced at database level:**

```sql
-- Users can ONLY see their organization's data
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_isolation"
  ON cases
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );
```

**This prevents:**
- User A seeing User B's cases (even with direct API calls)
- SQL injection bypassing access control
- Bugs in application code exposing data

---

### 🔑 Secrets Management

**Environment Variables:**
```bash
# .env.local (NEVER commit to git)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx # Public, safe to expose
SUPABASE_SERVICE_KEY=eyJyyy # SECRET, server-only

DATABASE_URL=postgresql://xxx # SECRET
ENCRYPTION_KEY=xxx # SECRET

SENDGRID_API_KEY=xxx # SECRET
STRIPE_SECRET_KEY=sk_xxx # SECRET
```

**Access Control:**
- `.env` files in `.gitignore`
- Secrets in Vercel Environment Variables (encrypted)
- Service keys NEVER in frontend code

---

## 10.5. Authentication & Authorization

### 🔐 Password Security

**Requirements:**
- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 number
- Common passwords blocked (list of 10k most common)

```typescript
const passwordSchema = z.string()
  .min(8, "Password too short")
  .regex(/[A-Z]/, "Must contain uppercase")
  .regex(/[a-z]/, "Must contain lowercase")
  .regex(/[0-9]/, "Must contain number")
  .refine(
    (password) => !commonPasswords.includes(password),
    "Password too common"
  );
```

**Storage:**
- Hashed with bcrypt (cost factor 12)
- Handled by Supabase Auth (industry standard)

---

### 🎫 JWT Tokens

**Structure:**
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "authenticated",
  "organization_id": "org_id",
  "exp": 1234567890
}
```

**Security:**
- Signed with HS256 (HMAC-SHA256)
- Short-lived: 15 minutes (access token)
- Refresh token: 7 days
- HttpOnly cookies (не доступні з JS)

```typescript
// Set cookie securely
cookies().set('access_token', jwt, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 15 * 60, // 15 minutes
});
```

---

### 👥 Role-Based Access Control (RBAC)

**Roles:**
- **Owner** — full access
- **Admin** — all features except billing
- **Lawyer** — case management, client management
- **Assistant** — read-only + basic tasks

**Permissions Check:**
```typescript
async function requirePermission(
  userId: string,
  resource: string,
  action: 'read' | 'write' | 'delete'
) {
  const { data: membership } = await supabase
    .from('user_organizations')
    .select('role, permissions')
    .eq('user_id', userId)
    .single();
  
  const can = checkPermission(membership.role, resource, action);
  
  if (!can) {
    throw new Error('Insufficient permissions');
  }
}

// Usage
await requirePermission(userId, 'cases', 'write');
await createCase(data);
```

---

## 10.6. File Upload Security

### 📤 Upload Validation

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

export async function validateUpload(file: File) {
  // Size check
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }
  
  // Type check (MIME type)
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('File type not allowed');
  }
  
  // Extension check (double-check)
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'].includes(ext)) {
    throw new Error('Invalid file extension');
  }
  
  // Virus scan (Phase 2)
  // await scanForViruses(file);
}
```

---

### 🔗 Signed URLs

```typescript
// Generate temporary URL (1 hour expiry)
const { data: signedUrl } = await supabase
  .storage
  .from('documents')
  .createSignedUrl(filePath, 3600); // 1 hour

// User can download via this URL for 1 hour only
return signedUrl;
```

---

## 10.7. Audit Logging

### 📝 What to Log

**Security Events:**
- Login attempts (success/failure)
- Password changes
- Permission changes
- Data exports

**Critical Actions:**
- Case deletion
- Client deletion
- Document deletion
- Invoice payment status change

**Schema:**
```sql
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  organization_id uuid REFERENCES organizations(id),
  
  event_type text NOT NULL, -- 'case.delete', 'login.success', etc
  resource_type text, -- 'case', 'client', etc
  resource_id uuid,
  
  details jsonb, -- {old_value, new_value, ip_address, user_agent}
  
  ip_address inet,
  user_agent text,
  
  created_at timestamp DEFAULT now()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id, created_at);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
```

---

### 📊 Log Retention

- Security logs: 3 years
- Audit logs: 1 year
- Access logs: 90 days

---

## 10.8. Compliance

### 🇪🇺 GDPR Compliance

**Key Requirements:**

**1. Lawful Basis:**
- Contract (service delivery)
- Consent (marketing emails)
- Legal obligation (invoices, tax records)

**2. Data Subject Rights:**
```typescript
// Right to Access
export async function exportUserData(userId: string) {
  const data = await supabase.rpc('export_user_data', { user_id: userId });
  return data; // JSON with all user's data
}

// Right to Delete
export async function deleteUser(userId: string) {
  // Soft delete with 30-day grace period
  await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { deleted_at: new Date().toISOString() }
  });
  
  // Schedule hard delete after 30 days
  await scheduleHardDelete(userId, Date.now() + 30 * 24 * 60 * 60 * 1000);
}

// Right to Portability
export async function exportDataPortable(userId: string) {
  // Export in machine-readable format (JSON/CSV)
  const data = await exportUserData(userId);
  return {
    json: JSON.stringify(data, null, 2),
    csv: convertToCSV(data),
  };
}
```

**3. Privacy by Design:**
- Minimal data collection
- Purpose limitation
- Data minimization
- Storage limitation

**4. DPA (Data Processing Agreement):**
- Supabase DPA: ✅ (EU-based, GDPR compliant)
- SendGrid DPA: ✅
- Vercel DPA: ✅

---

### 🇺🇦 Ukrainian Law Compliance

**Personal Data Protection:**
- Law of Ukraine "On Personal Data Protection"
- Registration with Ukrainian Data Protection Authority (if >10k users)

**Lawyer-Client Confidentiality:**
- Адвокатська таємниця (absolute)
- Data encrypted
- RLS policies
- Audit logs

**Document Retention:**
- Minimum 3 years (Закон України "Про адвокатуру")
- Users can keep longer

**Electronic Signature:**
- Дія.Підпис integration
- Qualified electronic signature (КЕП)

---

### 💶 PCI DSS (Payments)

**Strategy:** We DON'T handle card data directly

**Payment Flow:**
```
User → Stripe Checkout (hosted) → Stripe processes → Webhook → Our DB (subscription status)
```

**We NEVER:**
- Store card numbers
- Store CVV
- Process payments directly

**Stripe is PCI DSS Level 1 certified** ✅

---

## 10.9. Incident Response Plan

### 🚨 Security Incident Levels

**P0 (Critical):**
- Data breach
- System compromise
- Service down

**P1 (High):**
- Vulnerability exploited
- Unauthorized access attempt

**P2 (Medium):**
- Suspicious activity
- Configuration issue

---

### 📞 Incident Response Team

**Roles:**
- **Incident Commander** — coordinates response
- **Tech Lead** — investigates root cause
- **Communications** — user notifications

**On-Call Rotation:** (Phase 2, when team > 3)

---

### 🛠️ Response Procedure

**1. Detection (< 15 min):**
- Automated alerts (Sentry, Uptime monitoring)
- User report
- Security scan

**2. Containment (< 1 hour):**
- Isolate affected systems
- Block attacker IP
- Disable compromised accounts

**3. Investigation (< 4 hours):**
- Root cause analysis
- Scope of breach
- Data affected

**4. Remediation (< 24 hours):**
- Fix vulnerability
- Deploy patch
- Verify fix

**5. Communication (< 72 hours):**
- Notify affected users (GDPR requirement: 72h)
- Public disclosure (if needed)
- Post-mortem

**6. Prevention:**
- Update security measures
- Document lessons learned

---

## 10.10. Vulnerability Management

### 🔍 Security Scanning

**Tools:**
- **Dependabot** (GitHub) — dependency vulnerabilities
- **npm audit** — NPM packages
- **Snyk** (optional) — code scanning

**Frequency:**
- Automated: Every push
- Manual penetration testing: Quarterly (Phase 2)

---

### 🐛 Responsible Disclosure

**Security Email:** security@justio.com.ua

**Process:**
1. Researcher reports vulnerability
2. We acknowledge within 24h
3. We fix within 30 days (critical), 90 days (others)
4. Public disclosure after fix
5. Hall of Fame + bounty (Phase 2)

---

## 10.11. Security Checklist (MVP Launch)

- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] Input validation (Zod) on all endpoints
- [ ] XSS prevention (DOMPurify where needed)
- [ ] CSRF protection enabled
- [ ] SQL injection prevention (parameterized queries)
- [ ] RLS policies enabled on all tables
- [ ] Passwords hashed (bcrypt)
- [ ] JWT tokens secured (HttpOnly cookies)
- [ ] File upload validation
- [ ] Audit logging for critical actions
- [ ] GDPR compliance (data export, delete)
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Security monitoring (Sentry)

---

## 10.12. Ongoing Security

**Monthly:**
- Review audit logs
- Update dependencies
- Security newsletter review

**Quarterly:**
- Security audit (internal)
- Penetration testing (external, Phase 2)
- Update policies

**Annually:**
- Full security assessment
- GDPR compliance review
- Update DPAs

---

**Відповідальний:** CTO + Security Lead

**Статус:** ✅ Security Framework Defined

**Наступний крок:** Implementation and security testing
