#!/bin/bash

# TransportMarketing.net - Forge Deployment Script
# This script backs up existing app and deploys the new multi-brand setup

set -e  # Exit on error

SERVER="forge@64.227.66.233"
SITE_DIR="/home/forge/transportmarketing.net"
BACKUP_DIR="/home/forge/backups/transportmarketing-$(date +%Y%m%d-%H%M%S)"

echo "=================================="
echo "TransportMarketing.net Deployment"
echo "=================================="
echo ""
echo "This will:"
echo "1. Backup existing app to $BACKUP_DIR"
echo "2. Deploy new Laravel platform to $SITE_DIR/laravel/"
echo "3. Deploy 4 static brand sites"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo "Step 1: Backing up existing application..."
ssh $SERVER "mkdir -p /home/forge/backups && cp -r $SITE_DIR $BACKUP_DIR"
echo "✓ Backup created at $BACKUP_DIR"

echo ""
echo "Step 2: Cloning Laravel platform..."
ssh $SERVER "cd $SITE_DIR && mkdir -p laravel && cd .. && git clone https://github.com/alexkourtis98/redstar-platform.git temp-laravel && mv temp-laravel/* temp-laravel/.* $SITE_DIR/laravel/ 2>/dev/null || true && rm -rf temp-laravel"
echo "✓ Laravel platform cloned"

echo ""
echo "Step 3: Cloning static sites monorepo..."
ssh $SERVER << 'EOF'
cd /home/forge/transportmarketing.net
git clone https://github.com/alexkourtis98/transportmarketing-static-sites.git temp-static
mv temp-static/redstar ./redstar
mv temp-static/blueline ./blueline
mv temp-static/greenpromo ./greenpromo
mv temp-static/amberlane ./amberlane
rm -rf temp-static
chown -R forge:forge redstar/ blueline/ greenpromo/ amberlane/
chmod -R 755 redstar/ blueline/ greenpromo/ amberlane/
EOF
echo "✓ Static sites deployed"

echo ""
echo "Step 4: Verifying directory structure..."
ssh $SERVER "ls -la $SITE_DIR | grep -E '(laravel|redstar|blueline|greenpromo|amberlane)'"

echo ""
echo "=================================="
echo "Deployment Complete!"
echo "=================================="
echo ""
echo "Next steps (manual in Forge Dashboard):"
echo "1. Update Web Directory to /laravel/public"
echo "2. Add Additional Domains for static sites"
echo "3. Configure database credentials in .env"
echo "4. Run migrations: php artisan migrate --force"
echo "5. Configure SSL certificates"
echo ""
echo "Backup location: $BACKUP_DIR"
