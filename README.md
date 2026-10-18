# SK-KOP STORE — revised storefront draft

## Included in this version
- Product cards show image, name, price, stock and optional `bestSeller` label; no add-to-cart button on cards.
- Product details modal supports image thumbnails, optional `colors` and `sizes`, quantity, reviews summary, Buy Now and Add to Cart.
- Favorites page, persistent cart, dark/light toggle, search and price sorting.
- Customer fields: phone, name, province, district, village. No detailed-address field.
- Firebase Phone Auth OTP UI and reCAPTCHA flow.
- Payment choices shown as QR transfer or COD with 30% deposit wording.
- Province/district dropdown data included in `app.js` for the currently listed provinces. Verify spelling and completeness before launch.

## Important — not production ready yet
This is a working UI draft, not a finished payment/order system. Firebase Phone Authentication must be enabled, authorized domains added, SMS region settings checked, and billing/quotas configured as Firebase requires. SMS delivery to Lao phone numbers must be tested. Do not promise OTP works until tested on a real Lao number.

`firebase-config.js` contains public web-app config only. `API_BASE_URL` is blank. Set it only after deploying and securing the backend. The backend starter is not yet hardened to verify Firebase ID tokens, enforce OTP verification server-side, handle slip uploads, create payment QR, verify payment, manage admin claims, or integrate Anousith. Do not use it for real orders until those protections are implemented and tested. A front-end `verifiedPhone` field is not proof of verification; backend must verify the Firebase ID token.

Product data is expected at Firebase Realtime Database path `/products`. Suggested fields: `name`, `description`, `price`, `originalPrice`, `salePrice`, `stock`, `image`, `images` (array), `colors` (array), `sizes` (array), `bestSeller`, `active`, `reviewsSummary`.

## Open locally
Because this uses JavaScript modules, serve it over localhost or deploy it on HTTPS; opening `index.html` directly as a file may fail. Configure Firebase authorized domains before testing OTP.
