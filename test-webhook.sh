#!/bin/bash

# WooCommerce Webhook Test Script
# Tests the /api/webhook/woocommerce endpoint locally

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 WooCommerce Webhook Test Script${NC}\n"

# Configuration
ENDPOINT="${1:-http://localhost:3000/api/webhook/woocommerce}"
SECRET="${WEBHOOK_SECRET:-${REVALIDATE_SECRET}}"

if [ -z "$SECRET" ]; then
  echo -e "${RED}❌ Error: WEBHOOK_SECRET or REVALIDATE_SECRET not set${NC}"
  echo "Usage: WEBHOOK_SECRET=your-secret ./test-webhook.sh [endpoint]"
  exit 1
fi

echo -e "📍 Endpoint: ${ENDPOINT}"
echo -e "🔑 Secret: ${SECRET:0:10}...\n"

# Create test payload
PAYLOAD=$(cat <<EOF
{
  "id": 123,
  "name": "Felpa con Cappuccio - Test",
  "slug": "felpa-con-cappuccio",
  "status": "publish",
  "categories": [
    {
      "id": 45,
      "name": "Stampa Abbigliamento Serigrafia",
      "slug": "stampa-abbigliamento-serigrafia"
    }
  ],
  "date_modified": "$(date -u +"%Y-%m-%dT%H:%M:%S")",
  "price": "29.99"
}
EOF
)

echo -e "${YELLOW}📦 Payload:${NC}"
echo "$PAYLOAD" | jq .
echo ""

# Generate HMAC-SHA256 signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -binary | base64)

echo -e "${YELLOW}🔐 Signature:${NC} $SIGNATURE\n"

# Send webhook request
echo -e "${YELLOW}📤 Sending webhook...${NC}\n"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "X-WC-Webhook-Signature: $SIGNATURE" \
  -d "$PAYLOAD")

# Extract HTTP status code and body
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo -e "${YELLOW}📥 Response:${NC}"
echo "HTTP Status: $HTTP_CODE"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
echo ""

# Check result
if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Test PASSED${NC}"
  echo -e "${GREEN}Cache revalidated successfully!${NC}"
  exit 0
else
  echo -e "${RED}❌ Test FAILED${NC}"
  echo -e "${RED}HTTP Status: $HTTP_CODE${NC}"
  exit 1
fi
