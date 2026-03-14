#!/bin/bash
curl -i -X POST https://www.dtfitalia.it/api/webhook/woocommerce \
-H "Content-Type: application/json" \
-H "x-wc-webhook-event: ping" \
-H "x-wc-webhook-signature: test" \
-d '{}'
