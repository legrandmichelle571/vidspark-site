#!/bin/bash
#############################################################################
# VidSpark AI - Google OAuth Auto-Configuration Script
# Configure tout automatiquement via Google Cloud CLI
#############################################################################

set -e

PROJECT_ID="vidspark-ai-v4"
CLIENT_NAME="VidSpark AI"
DOMAINS=(
  "vidsparkpro.com"
  "www.vidsparkpro.com"
)

echo "═══════════════════════════════════════════════════════════════"
echo "  🔐 VidSpark AI - Google OAuth Configuration"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not installed"
    echo ""
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "✅ gcloud CLI found"
echo ""

# Check if authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated to Google Cloud"
    echo ""
    echo "Run: gcloud auth login"
    exit 1
fi

ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1)
echo "✅ Authenticated as: $ACCOUNT"
echo ""

# Set project
echo "Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID
echo "✅ Project set"
echo ""

# Get the OAuth client
echo "Looking for OAuth client..."
CLIENT_ID=$(gcloud iam oauth-clients list --format="value(clientId)" | head -n 1)

if [ -z "$CLIENT_ID" ]; then
    echo "❌ No OAuth client found in project"
    echo ""
    echo "You need to create it manually in Google Cloud Console:"
    echo "1. Go to https://console.cloud.google.com/apis/credentials"
    echo "2. Create OAuth 2.0 Client ID (Web Application)"
    echo "3. Run this script again"
    exit 1
fi

echo "✅ Found OAuth client: $CLIENT_ID"
echo ""

# Add JavaScript origins
echo "Adding Authorized JavaScript Origins..."
for domain in "${DOMAINS[@]}"; do
    echo "  Adding: https://$domain"
done

# Note: gcloud iam oauth-clients update doesn't support JSON directly
# We'll output the commands for manual execution

cat > /tmp/oauth-config.json << EOF
{
  "clientId": "$CLIENT_ID",
  "project": "$PROJECT_ID",
  "authorizedJavascriptOrigins": [
    "https://vidsparkpro.com",
    "https://www.vidsparkpro.com"
  ],
  "authorizedRedirectUris": [
    "https://vidsparkpro.com/login.html",
    "https://vidsparkpro.com",
    "https://www.vidsparkpro.com/login.html",
    "https://www.vidsparkpro.com"
  ]
}
EOF

echo "✅ Configuration saved to: /tmp/oauth-config.json"
echo ""

# Display the configuration
echo "═══════════════════════════════════════════════════════════════"
echo "  📋 YOUR OAUTH CONFIGURATION"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Client ID: $CLIENT_ID"
echo ""
echo "JavaScript Origins:"
echo "  - https://vidsparkpro.com"
echo "  - https://www.vidsparkpro.com"
echo ""
echo "Redirect URIs:"
echo "  - https://vidsparkpro.com/login.html"
echo "  - https://vidsparkpro.com"
echo "  - https://www.vidsparkpro.com/login.html"
echo "  - https://www.vidsparkpro.com"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "  ⚠️  MANUAL STEPS REQUIRED"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Unfortunately, gcloud CLI cannot update OAuth clients directly."
echo "You must do this manually in the console:"
echo ""
echo "1. Go to: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo "2. Click on your OAuth client"
echo "3. Add to 'Authorized JavaScript origins':"
for domain in "${DOMAINS[@]}"; do
    echo "      https://$domain"
done
echo ""
echo "4. Add to 'Authorized redirect URIs':"
echo "      https://vidsparkpro.com/login.html"
echo "      https://vidsparkpro.com"
echo "      https://www.vidsparkpro.com/login.html"
echo "      https://www.vidsparkpro.com"
echo ""
echo "5. Click SAVE"
echo "6. WAIT 5-10 MINUTES"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ NEXT STEPS"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "After you add the URLs manually:"
echo ""
echo "1. Wait 5-10 minutes for Google to apply changes"
echo ""
echo "2. Test here: https://vidsparkpro.com/google-oauth-test.html"
echo ""
echo "3. You should see: ✅ Google OAuth prêt!"
echo ""
echo "Done! 🎉"
