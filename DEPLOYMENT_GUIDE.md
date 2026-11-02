# TransportMarketing.net Deployment Guide

**Date:** 2026-11-01
**Server:** forge@64.227.66.233
**Forge Site ID:** 3436119
**Site:** transportmarketing.net

---

## Quick Reference

**GitHub Repos:**
- Laravel Platform: `https://github.com/alexkourtis98/redstar-platform`
- Static Sites: `https://github.com/alexkourtis98/transportmarketing-static-sites`

**Live URLs (after deployment):**
- https://redstar.transportmarketing.net (Static)
- https://blueline.transportmarketing.net (Static)
- https://greenpromo.transportmarketing.net (Static)
- https://amberlane.transportmarketing.net (Static)
- https://manage.redstar.transportmarketing.net/admin (Laravel)

---

## Phase 1: Forge Configuration

### 1.1 Update Primary Site Settings

1. Go to Forge Dashboard → Sites → `transportmarketing.net`
2. Update settings:
   - **Git Repository:** `alexkourtis98/redstar-platform`
   - **Branch:** `main`
   - **Web Directory:** `/laravel/public`
   - **PHP Version:** 8.2
   - **Quick Deploy:** Enable
3. Click "Update"

### 1.2 Add Additional Domains

In Forge → Site → Additional Domains, add:

| Domain | Document Root |
|--------|--------------|
| redstar.transportmarketing.net | /redstar |
| blueline.transportmarketing.net | /blueline |
| greenpromo.transportmarketing.net | /greenpromo |
| amberlane.transportmarketing.net | /amberlane |
| manage.redstar.transportmarketing.net | /laravel/public |

### 1.3 Deploy Laravel

Click "Deploy Now" - Forge clones repo to `/home/forge/transportmarketing.net/laravel/`

**Expected Structure:**
```
/home/forge/transportmarketing.net/
├── laravel/          (from Git)
│   ├── app/
│   ├── public/
│   ├── database/
│   └── ...
```

---

## Phase 2: Deploy Static Sites

SSH to server:
```bash
ssh forge@64.227.66.233
cd /home/forge/transportmarketing.net
```

Clone and extract static sites:
```bash
# Clone monorepo to temp location
git clone https://github.com/alexkourtis98/transportmarketing-static-sites.git temp-static

# Move each brand directory to site root
mv temp-static/redstar ./redstar
mv temp-static/blueline ./blueline
mv temp-static/greenpromo ./greenpromo
mv temp-static/amberlane ./amberlane

# Clean up
rm -rf temp-static

# Verify structure
ls -la
# Expected: laravel/, redstar/, blueline/, greenpromo/, amberlane/
```

Set permissions:
```bash
chown -R forge:forge redstar/ blueline/ greenpromo/ amberlane/
chmod -R 755 redstar/ blueline/ greenpromo/ amberlane/
```

**Expected Final Structure:**
```
/home/forge/transportmarketing.net/
├── laravel/          (Laravel app)
├── redstar/          (Static site)
├── blueline/         (Static site)
├── greenpromo/       (Static site)
└── amberlane/        (Static site)
```

---

## Phase 3: Database Setup

### 3.1 Create Production Database

Generate strong password:
```bash
DB_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-24)
echo "Save this password: $DB_PASSWORD"
```

Create database and user:
```bash
mysql -u forge -p
```

```sql
CREATE DATABASE transportmarketing_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'transport_user'@'localhost' IDENTIFIED BY '<PASTE_PASSWORD>';
GRANT ALL PRIVILEGES ON transportmarketing_platform.* TO 'transport_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3.2 Configure Environment

In Forge Dashboard → Site → Environment:

```env
APP_NAME="TransportMarketing Platform"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://manage.redstar.transportmarketing.net

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=transportmarketing_platform
DB_USERNAME=transport_user
DB_PASSWORD=<PASTE_PASSWORD_FROM_3.1>

QUEUE_CONNECTION=database
OLD_CRM_DB_PATH=/tmp/old_crm.sqlite

# Placeholders (configure later)
MAIL_MAILER=log
STRIPE_KEY=pk_test_placeholder
VIVA_ENVIRONMENT=demo
AADE_ENVIRONMENT=sandbox
```

Click "Save"

---

## Phase 4: Run Migrations & Seed Data

SSH and run migrations:
```bash
ssh forge@64.227.66.233
cd /home/forge/transportmarketing.net/laravel

# Run migrations
php artisan migrate --force

# Seed entities (RedStar, BlueLine, GreenPromo, AmberLane)
php artisan db:seed --class=InitialDataSeeder --force

# Verify
php artisan tinker --execute="echo \App\Models\Entity::count();"
# Expected: 4
```

### 4.2 Migrate Old CRM Data

Copy old database to server:
```bash
# On LOCAL machine:
scp ~/work/redstar/database/database.sqlite forge@64.227.66.233:/tmp/old_crm.sqlite
```

Run migration:
```bash
# On SERVER:
cd /home/forge/transportmarketing.net/laravel
php artisan migrate --path=database/migrations/2026_11_05_000001_migrate_old_crm_data.php --force
```

Verify counts:
```bash
php artisan tinker --execute="
  echo 'Entities: ' . \App\Models\Entity::count() . PHP_EOL;
  echo 'Clients: ' . \App\Models\Client::count() . PHP_EOL;
  echo 'Projects: ' . \App\Models\Project::count() . PHP_EOL;
  echo 'Tasks: ' . \App\Models\Task::count() . PHP_EOL;
  echo 'Payments: ' . \App\Models\Payment::count() . PHP_EOL;
  echo 'Contacts: ' . \App\Models\Contact::count() . PHP_EOL;
"
# Expected: Entities: 4, Clients: 10, Projects: 22, Tasks: 45, Payments: 17, Contacts: 25
```

---

## Phase 5: Configure Queue Worker

In Forge Dashboard → Site → Daemons → New Daemon:

- **Command:** `php artisan queue:work database --sleep=3 --tries=3 --max-time=3600`
- **Directory:** `/home/forge/transportmarketing.net/laravel`
- **User:** `forge`
- **Processes:** 2

---

## Phase 6: DNS Configuration

In DNS provider (Cloudflare/Namecheap):

```
Type | Name              | Value            | TTL
-----|-------------------|------------------|-----
A    | @                 | 64.227.66.233    | 3600
A    | redstar           | 64.227.66.233    | 3600
A    | blueline          | 64.227.66.233    | 3600
A    | greenpromo        | 64.227.66.233    | 3600
A    | amberlane         | 64.227.66.233    | 3600
A    | manage.redstar    | 64.227.66.233    | 3600
```

**Note:** If using Cloudflare, set to "DNS only" (grey cloud) not "Proxied" for SSL generation.

Verify DNS propagation:
```bash
dig redstar.transportmarketing.net +short
dig blueline.transportmarketing.net +short
dig greenpromo.transportmarketing.net +short
dig amberlane.transportmarketing.net +short
dig manage.redstar.transportmarketing.net +short
# All should return: 64.227.66.233
```

Wait 5-30 min for DNS propagation.

---

## Phase 7: Enable SSL

### 7.1 Obtain Certificates

In Forge Dashboard → Site → SSL:
1. Click "Let's Encrypt"
2. Select all 6 domains (base + 5 subdomains)
3. Click "Obtain Certificate"
4. Wait for issuance (~2 min)

### 7.2 Force HTTPS

After certificate issued:
- Enable "Force HTTPS" toggle

### 7.3 Optimize Laravel

```bash
ssh forge@64.227.66.233
cd /home/forge/transportmarketing.net/laravel

php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Phase 8: Final Verification

### 8.1 Test All Sites

```bash
# Test static sites
curl -I https://redstar.transportmarketing.net
curl -I https://blueline.transportmarketing.net
curl -I https://greenpromo.transportmarketing.net
curl -I https://amberlane.transportmarketing.net

# Expected: HTTP/2 200, strict-transport-security header

# Test Laravel admin
curl -I https://manage.redstar.transportmarketing.net/admin
# Expected: HTTP/2 200, Filament login page
```

### 8.2 Verify Data

```bash
ssh forge@64.227.66.233
cd /home/forge/transportmarketing.net/laravel

php artisan tinker --execute="
  \$client = \App\Models\Client::with('projects.tasks', 'contacts')->first();
  echo 'Client: ' . \$client->name . PHP_EOL;
  echo 'Projects: ' . \$client->projects->count() . PHP_EOL;
  echo 'Tasks: ' . \$client->projects->sum(fn(\$p) => \$p->tasks->count()) . PHP_EOL;
  echo 'Contacts: ' . \$client->contacts->count() . PHP_EOL;
"
```

### 8.3 Check Queue Worker

```bash
supervisorctl status | grep daemon
# Expected: 2 processes RUNNING
```

### 8.4 Manual Browser Tests

- Visit https://redstar.transportmarketing.net - homepage loads
- Visit https://blueline.transportmarketing.net - homepage loads
- Visit https://greenpromo.transportmarketing.net - homepage loads
- Visit https://amberlane.transportmarketing.net - homepage loads
- Visit https://manage.redstar.transportmarketing.net/admin
  - Login: admin@redstarweb.net / password
  - Dashboard shows 4 entities
  - Clients table shows 10 records
  - Projects table shows 22 records

---

## Troubleshooting

**Problem:** Static site shows 404
- **Solution:** Check Nginx config, verify directory exists, check permissions

**Problem:** Laravel admin 500 error
- **Solution:** Check `storage/logs/laravel.log`, verify .env database config

**Problem:** Data migration imported 0 records
- **Solution:** Verify `/tmp/old_crm.sqlite` exists, check file permissions

**Problem:** SSL certificate fails
- **Solution:** Wait for DNS propagation, disable Cloudflare proxy, retry

---

## Success Checklist

- [ ] All 5 sites accessible via HTTPS
- [ ] Laravel admin login works
- [ ] 4 entities seeded
- [ ] 94 records migrated (10 clients, 22 projects, 45 tasks, 17 payments, 25 contacts)
- [ ] Relationships intact
- [ ] Queue worker running
- [ ] Static sites serve correctly

**Total Deployment Time:** ~90 minutes
