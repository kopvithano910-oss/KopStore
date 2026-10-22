# SK-KOP STORE — storefront + API + admin

Includes responsive storefront, product detail/cart/favorites, province→district checkout, Firebase Phone Auth OTP UI, backend order creation, private slip submission endpoint, order tracking, and an Admin panel for order status/tracking and product updates.

## Required setup before real orders
1. Deploy `backend/` to a Node.js host that supports HTTPS. Run `npm install`, set `ALLOWED_ORIGIN` to your exact storefront origins, set `FIREBASE_DATABASE_URL`, and provide Google Application Default Credentials/service account securely in the host environment. Never commit service-account JSON.
2. Set `API_BASE_URL` in `firebase-config.js` to the deployed API base URL.
3. In Firebase Authentication, enable Email/Password and Phone providers; add the storefront domain to Authorized domains; review SMS region policy and billing/quotas. Test OTP on a real Lao number.
4. Assign `admin: true` custom claims to the intended admin UID only using trusted Firebase Admin SDK on a private server. Do not put a service-account key or admin password in frontend code. Example (run only in a trusted admin environment): `await admin.auth().setCustomUserClaims('FIREBASE_UID_HERE', {admin:true})`. Then sign out/in again.
5. Import `database.rules.json` after reviewing it. Backend service account has privileged access, so keep it private.
6. Set products under `/products` with fields such as `name`, `description`, `price`, `salePrice`, `stock`, `image`, `images`, `colors`, `sizes`, `bestSeller`, `active`. Product IDs must match IDs used in the storefront.
7. Add your actual OnePay QR details to the checkout flow before launch. This package does not automatically verify bank transfers; an admin must review slips and confirm payment. Uploading a slip is not proof of payment.
8. Anousith Express integration/official label generation is not automated here. Enter only real tracking numbers and upload carrier-generated labels in a future extension.

## Current API endpoints
- `GET /api/health`
- `POST /api/orders` (requires valid Firebase ID token with verified phone number matching the order phone)
- `POST /api/orders/:id/slip` (private slip submission; JPEG/PNG/WebP, max ~4.5 MB decoded)
- `GET /api/orders/:id?phone=...`
- Admin: `GET /api/admin/orders`, `GET /api/admin/orders/:id/slip`, `PATCH /api/admin/orders/:id`, `GET /api/admin/products`, `PUT /api/admin/products/:id`, `DELETE /api/admin/products/:id`

## Important limitation
The frontend checkout currently needs a final integration pass for the slip upload screen and real OnePay QR presentation; the backend endpoint and admin review route are included but are not a complete payment gateway. Do not advertise the site as production-ready until OTP, orders, uploads, rules, CORS, admin claim, and real payments are tested end-to-end.
