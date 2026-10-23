import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { firebaseConfig, API_BASE_URL } from './firebase-config.js';

const app = initializeApp(firebaseConfig), db = getDatabase(app), auth = getAuth(app);
let products = [], cart = JSON.parse(localStorage.skCart || '[]'), favs = JSON.parse(localStorage.skFavs || '[]'), current = null, conf, recaptcha = null, confirmation = null;

const districts = {
  'ນະຄອນຫຼວງວຽງຈັນ': ['ຈັນທະບູລີ', 'ສີໂຄດຕະບອງ', 'ໄຊເຊດຖາ', 'ສີສັດຕະນາກ', 'ນາຊາຍທອງ', 'ໄຊທານີ', 'ຫາດຊາຍຟອງ', 'ສັງທອງ', 'ປາກງື່ມ'],
  'ຜົ້ງສາລີ': ['ຜົ້ງສາລີ', 'ບຸນໃຕ້', 'ຍອດອູ', 'ຜາໄຊ'],
  'ຫຼວງນ້ຳທາ': ['ຫຼວງນ້ຳທາ', 'ສິງ', 'ລອງ', 'ວຽງພູຄາ', 'ນາແລ'],
  'ອຸດົມໄຊ': ['ໄຊ', 'ຫຼວງາ', 'ຮຸນ', 'ປາກແບງ', 'ນາໝໍ້', 'ງາ'],
  'ບໍ່ແກ້ວ': ['ຫ້າຍຊາຍ', 'ຕົ້ນເຜິ້ງ', 'ເມືອງເມງ', 'ເມືອງຜາອຸດົມ', 'ເມືອງປາກທາ'],
  'ຫຼວງພະບາງ': ['ຫຼວງພະບາງ', 'ຊຽງເງິນ', 'ນານ', 'ປາກອູ', 'ຊາງ', 'ພູຄູນ', 'ງòi', 'ຈອມເພັດ', 'ວຽງຄຳ'],
  'ຫົວພັນ': ['ຊຳເໜືອ', 'ຊຽງຄໍໍ', 'ວຽງທອງ', 'ວຽງໄຊ', 'ຫົວເມືອງ', 'ຊຳໃຕ້', 'ສົບເບົາ', 'ແອດ'],
  'ຊຽງຂວາງ': ['ແປກ', 'ຄຳ', 'ໜອງແຮດ', 'ຄູນ', 'ໝອກໃໝ່', 'ພູກູດ'],
  'ວຽງຈັນ': ['ໂພນໂຮງ', 'ທຸາຄົມ', 'ແກ້ວອຸດົມ', 'ກາສີ', 'ວັງວຽງ', 'ເມືອງເຟືອງ', 'ໝື່ນ', 'ຫີນເຫີບ'],
  'ບໍລິຄຳໄຊ': ['ປາກຊັນ', 'ທ່າພຣະບາດ', 'ປາກກະດິງ', 'ບໍລິຄັນ', 'ຄຳເກີດ', 'ວຽງທອງ', 'ໄຊຈຳພອນ'],
  'ຄຳມ່ວນ': ['ແກ້ວ', 'ມະຫາໄຊ', 'ໜອງບົກ', 'ຫີນບູນ', 'ຍົມມະລາດ', 'ບົວລາພາ', 'ນາກາຍ'],
  'ສະຫວັນນະເຂດ': ['ໄກສອນ ພົມວິຫານ', 'ອຸທຸມພອນ', 'ພະລານສາຍ', 'ສອງຄອນ', 'ຈຳພອນ', 'ຊົນນະບູລີ', 'ພິນ', 'ນອງ'],
  'ສາລະວັນ': ['ສາລະວັນ', 'ຕາໂອຍ', 'ປາກວມ', 'ຄົງເຊໂດນ', 'ວາປີ', 'ເລົ່າງາມ'],
  'ເຊກອງ': ['ລະມາມ', 'ກະລຶມ', 'ຕຸ້ມລານ', 'ຊານໄຊ'],
  'ຈຳປາສັກ': ['ປາກເຊ', 'ຊະນະສະສົມ', 'ປະທຸມພອນ', 'ໂພນທອງ', 'ມູນລະປະໂມກ', 'ໂຂງ', 'ປາກຊ່ອງ'],
  'ອັດຕະປື': ['ສາມັກຄີໄຊ', 'ໄຊເສດຖາ', 'ສະໜາມໄຊ', 'ຊານໄຊ', 'ພູວົງ']
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function save() {
  localStorage.skCart = JSON.stringify(cart);
  localStorage.skFavs = JSON.stringify(favs);
  let el = document.getElementById('cartCount');
  if (el) el.textContent = cart.reduce((s, c) => s + c.qty, 0);
}

function showHome() {
  let title = document.getElementById('pageTitle');
  if (title) title.textContent = 'ສິນຄ້າທັງໝົດ';
  render();
}

function showFavorites() {
  let title = document.getElementById('pageTitle');
  if (title) title.textContent = 'ລາຍການທີ່ມັກ';
  render(favs);
}

window.toggleFav = id => {
  favs.includes(id) ? favs = favs.filter(x => x !== id) : favs.push(id);
  save();
  render();
};

window.detail = id => {
  current = products.find(p => p.id === id);
  if (!current) return;
  let p = current, imgs = p.images || [p.img];
  let modal = document.getElementById('modal');
  if (modal) {
    modal.innerHTML = `<div class="modal-content"><span onclick="document.getElementById('modal').style.display='none'" class="close">&times;</span><h2>${esc(p.name)}</h2><div class="slider">${imgs.map((src, i) => `<img src="${src}" class="slide" style="display:${i === 0 ? 'block' : 'none'}">`).join('')}</div><p>${esc(p.desc)}</p><h3>ລາຄາ: ${p.price} ₭</h3><input type="number" id="qty" value="1" min="1"><button onclick="add()">ເພີ່ມລົງກະຕ່າ</button></div>`;
    modal.style.display = 'block';
  }
};

window.add = () => {
  let q = Math.max(1, Number(document.getElementById('qty')?.value) || 1);
  let x = cart.find(x => x.id === current.id);
  if (x) x.qty += q; else cart.push({ ...current, qty: q });
  save();
  let modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';
  alert('ເພີ່ມລົງກະຕ່າແລ້ວ');
};

window.showCheckout = () => {
  let title = document.getElementById('pageTitle');
  if (title) title.textContent = 'ກະລຸນາຊຳລະເງິນ';
};

window.sendOTP = async () => {
  try {
    let phoneInput = document.getElementById('phone');
    let rawPhone = phoneInput ? phoneInput.value.trim() : '';
    if (!rawPhone) throw Error('ກະລຸນາໃສ່ເບີໂທ');
    let phoneNumber = rawPhone.startsWith('+') ? rawPhone : '+856' + rawPhone.replace(/^0+/, '');
    
    if (!recaptcha) {
      recaptcha = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
    }
    let conf = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
    confirmation = conf;
    alert('ສົ່ງ OTP ສຳເລັດ');
  } catch (e) {
    alert('ສົ່ງ OTP ບໍ່ສຳເລັດ: ' + e.message);
  }
};

window.verifyOTP = async () => {
  try {
    let otpInput = document.getElementById('otp');
    let otpCode = otpInput ? otpInput.value.trim() : '';
    if (!confirmation) throw Error('ກະລຸນາສົ່ງ OTP ກ่อน');
    if (!otpCode) throw Error('ກະລຸນາໃສ່ລະຫັດ OTP');
    let res = await confirmation.confirm(otpCode);
    alert('ຢືນຢັນ OTP ສຳເລັດ');
  } catch (e) {
    alert('ຢືນຢັນ OTP ບໍ່ສຳເລັດ: ' + e.message);
  }
};
