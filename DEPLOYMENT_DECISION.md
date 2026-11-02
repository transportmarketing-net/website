# Deployment Decision Required

## Current Situation

**Server:** forge@64.227.66.233
**Forge Site:** `transportmarketing.net` (ID: 3436119)
**Current App:** CRM Offers (AI-powered offer/proposal management)
**Directory:** `/home/forge/transportmarketing.net/`

## Discovery

The `transportmarketing.net` Forge site is **already in use** with a Laravel application (CRM Offers - offer management system). The deployment plan assumes this site is empty or can be reconfigured.

## Two Deployment Options

### Option A: Single-Site Approach (Original Plan)
**Use ONE Forge site for everything**

**Pros:**
- Simpler DNS (all point to same IP)
- ONE SSL certificate
- Matches original plan

**Cons:**
- Must backup and move existing CRM Offers app
- More complex Nginx routing
- Higher risk of breaking existing app

**Steps:**
1. Backup existing CRM Offers app to `/home/forge/backups/`
2. Move existing Laravel app to `/home/forge/transportmarketing.net/old-crm-offers/`
3. Deploy new Laravel platform to `/home/forge/transportmarketing.net/laravel/`
4. Deploy static sites to `/home/forge/transportmarketing.net/{brand}/`
5. Configure Nginx subdomain routing:
   - `manage.redstar.transportmarketing.net` → `/laravel/public`
   - `redstar.transportmarketing.net` → `/redstar`
   - `blueline.transportmarketing.net` → `/blueline`
   - `greenpromo.transportmarketing.net` → `/greenpromo`
   - `amberlane.transportmarketing.net` → `/amberlane`
6. Decide what to do with old CRM Offers app (move to different domain, archive, etc.)

**Structure:**
```
/home/forge/transportmarketing.net/
├── laravel/              (NEW redstar-platform)
├── redstar/              (Static site)
├── blueline/             (Static site)
├── greenpromo/           (Static site)
├── amberlane/            (Static site)
└── old-crm-offers/       (Existing CRM Offers app - backed up)
```

---

### Option B: Multi-Site Approach (Cleaner)
**Create separate Forge sites for each brand/service**

**Pros:**
- No risk to existing CRM Offers app
- Cleaner separation
- Easier to manage individually
- Each site can have own Git repo
- Explicit SSL per site

**Cons:**
- More Forge sites to manage (but only marginally)
- Slightly more complex DNS setup

**Sites to Create:**
1. **Keep existing:** `transportmarketing.net` → CRM Offers (existing Laravel app)
2. **Keep existing:** `manage.redstar.transportmarketing.net` → Deploy NEW Laravel platform here
3. **Create new:** `redstar.transportmarketing.net` → Static site
4. **Create new:** `blueline.transportmarketing.net` → Static site
5. **Create new:** `greenpromo.transportmarketing.net` → Static site
6. **Create new:** `amberlane.transportmarketing.net` → Static site

**Steps:**
1. Update existing `manage.redstar.transportmarketing.net` Forge site:
   - Git Repo: `alexkourtis98/redstar-platform`
   - Branch: `main`
   - Deploy
2. Create 4 new Forge sites (one per brand static site)
3. For each static site:
   - Set document root to `/public_html/`
   - Deploy via Git or manual upload
4. Configure DNS for all domains
5. Enable SSL for all sites

---

## Recommendation: Option B (Multi-Site)

**Reason:** Safer, cleaner, no risk to existing CRM Offers app, easier to maintain long-term.

The existing `manage.redstar.transportmarketing.net` Forge site exists and can be repurposed for the NEW Laravel platform. The 4 brand static sites get their own Forge sites.

---

## Immediate Next Steps (Option B)

### 1. Fix/Deploy manage.redstar.transportmarketing.net

```bash
# SSH to server
ssh forge@64.227.66.233

# Check current state
cd /home/forge/manage.redstar.transportmarketing.net
ls -la

# Remove broken symlink and old releases
rm -f current
rm -rf releases/

# Clone fresh
git clone https://github.com/alexkourtis98/redstar-platform.git .
composer install --no-dev --optimize-autoloader
npm install && npm run build
php artisan key:generate
```

**In Forge Dashboard:**
- Site: `manage.redstar.transportmarketing.net`
- Update Git Repository: `alexkourtis98/redstar-platform`
- Branch: `main`
- Web Directory: `/public`
- Deploy

### 2. Create Static Site Forge Sites

**For each brand (redstar, blueline, greenpromo, amberlane):**

In Forge Dashboard → Create New Site:
- **Domain:** `{brand}.transportmarketing.net`
- **PHP Version:** None (static HTML)
- **Web Directory:** `/public_html`

After creation:
```bash
ssh forge@64.227.66.233
cd /home/forge/{brand}.transportmarketing.net/public_html

# Clone and extract that brand's files
git clone https://github.com/alexkourtis98/transportmarketing-static-sites.git temp
mv temp/{brand}/* ./
rm -rf temp
```

### 3. Database Setup (for Laravel platform)

```bash
# Generate password
DB_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-24)
echo "Save this: $DB_PASSWORD"

# Create database
mysql -u forge -p
```

```sql
CREATE DATABASE redstar_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'redstar_user'@'localhost' IDENTIFIED BY '<PASSWORD>';
GRANT ALL PRIVILEGES ON redstar_platform.* TO 'redstar_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Update .env in Forge Dashboard:**
```env
APP_URL=https://manage.redstar.transportmarketing.net
DB_DATABASE=redstar_platform
DB_USERNAME=redstar_user
DB_PASSWORD=<PASSWORD>
QUEUE_CONNECTION=database
```

### 4. Run Migrations

```bash
cd /home/forge/manage.redstar.transportmarketing.net
php artisan migrate --force
php artisan db:seed --class=InitialDataSeeder --force
```

### 5. Configure Queue Worker

Forge Dashboard → Daemons → New:
- Command: `php artisan queue:work database --sleep=3 --tries=3`
- Directory: `/home/forge/manage.redstar.transportmarketing.net`
- User: `forge`

### 6. DNS Records

```
Type | Name              | Value            | TTL
-----|-------------------|------------------|-----
A    | manage.redstar    | 64.227.66.233    | 3600
A    | redstar           | 64.227.66.233    | 3600
A    | blueline          | 64.227.66.233    | 3600
A    | greenpromo        | 64.227.66.233    | 3600
A    | amberlane         | 64.227.66.233    | 3600
```

### 7. SSL

For each site in Forge:
- SSL → Let's Encrypt → Obtain Certificate
- Enable "Force HTTPS"

---

## Decision Required

**Which option do you want to proceed with?**

- **Option A:** Single-site with subdomain routing (original plan, requires backing up CRM Offers)
- **Option B:** Multi-site approach (recommended, safer, cleaner)

Please confirm before I proceed with deployment.
