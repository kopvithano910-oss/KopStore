# SK-KOP STORE — rebuild starter

## ໄຟລ໌
- `index.html`, `style.css`, `app.js`: ໜ້າຮ້ານ, search, cart, dark mode, checkout form.
- `firebase-config.js`: Firebase web config ແລະ API URL.
- `tracking.html`: ຕິດຕາມອໍເດີ.
- `admin.html`: ໜ້າ Admin ເບື້ອງຕົ້ນ.
- `backend/`: Express API ສ້າງອໍເດີ/ຄົ້ນຫາດ້ວຍເບີໂທ.
- `database.rules.json`: rules ເລີ່ມຕົ້ນ.

## ຕິດຕັ້ງ
1. ສຳຮອງ GitHub Repository ເກົ່າກ່ອນ.
2. ອັບໂຫຼດ frontend ໃສ່ root ຂອງ GitHub Pages.
3. Deploy `backend` ໃສ່ Node.js hosting; ຕັ້ງ `ALLOWED_ORIGIN=https://kopstore-sk.com` ແລະ Firebase Admin credentials ໃນ secret manager ຂອງ host.
4. ຢ່າອັບໂຫຼດ service-account JSON/password ໃສ່ GitHub.
5. ເມື່ອ API ໃຊ້ໄດ້ ໃຫ້ໃສ່ URL ໃນ `API_BASE_URL` ຂອງ `firebase-config.js`.
6. ເພີ່ມ Firebase Auth user ສຳລັບ Admin ແລະຕັ້ງ custom claim `admin: true` ຈາກ trusted environment.
7. ທົບທວນແລະ publish `database.rules.json` ໃນ Firebase RTDB Rules.

## ຍັງບໍ່ພ້ອມສຳລັບຮັບອໍເດີຈິງ
- SMS OTP, private slip upload/review ແລະ OnePay confirmation ຍັງບໍ່ມີ.
- Admin product/order workflow, ປ່ຽນ status, Anousith tracking/label ຍັງຕ້ອງພັດທະນາເພີ່ມ.
- ການຈອງ/ຫັກ stock ແບບ atomic, rate limiting ແລະ tests ຍັງບໍ່ມີ.
- ຢ່າໃຊ້ ImgBB ສຳລັບສະລິບທີ່ມີຂໍ້ມູນສ່ວນຕົວ; ໃຊ້ private storage ຜ່ານ backend.
- COD ຄິດມັດຈຳ 30% ຂອງລາຄາສິນຄ້າ, ບໍ່ລວມຄ່າສົ່ງ. ຄ່າສົ່ງສະແດງ 0 ₭.
