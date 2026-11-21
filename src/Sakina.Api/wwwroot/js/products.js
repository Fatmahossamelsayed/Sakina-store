/* Sakina — API client
   المنتجات بتتحمّل من /api/products بدل المصفوفة الثابتة، والطلبات بتتحفظ في SQL Server. */
const products = [];

const T = {
  ar: { title: 'بيانات التوصيل', sub: 'هنحفظ طلبك ونكمّل معاكِ على الواتساب.', name: 'الاسم', phone: 'رقم الموبايل', address: 'العنوان بالتفصيل', notes: 'ملاحظات (اختياري)',
        send: 'تأكيد الطلب', cancel: 'إلغاء', badName: 'اكتبي اسمك', badPhone: 'رقم موبايل مصري صحيح (مثال 01012345678)', badAddr: 'اكتبي العنوان',
        okTitle: 'تم تسجيل طلبك 🎀', okSub: 'رقم طلبك:', wa: 'أكملي على الواتساب', close: 'إغلاق', fail: 'تعذّر حفظ الطلب الآن، تقدري تبعتيه مباشرة على الواتساب.', sending: 'جاري الإرسال…', order: 'طلب رقم' },
  en: { title: 'Delivery details', sub: 'We will save your order and continue on WhatsApp.', name: 'Name', phone: 'Mobile number', address: 'Full address', notes: 'Notes (optional)',
        send: 'Confirm order', cancel: 'Cancel', badName: 'Please enter your name', badPhone: 'Valid Egyptian mobile (e.g. 01012345678)', badAddr: 'Please enter your address',
        okTitle: 'Order received 🎀', okSub: 'Your order number:', wa: 'Continue on WhatsApp', close: 'Close', fail: 'Could not save the order right now, you can send it directly on WhatsApp.', sending: 'Sending…', order: 'Order #' }
};

window.SakinaApi = {
  /* يفتح نافذة بيانات العميل، يحفظ الطلب (السعر بيتحسب من السيرفر)، وبعدها يعرض زرار الواتساب.
     بيرجع true لو الطلب اتحفظ. */
  checkout(cart, message, waNumber, lang) {
    const t = T[lang === 'en' ? 'en' : 'ar'];
    const wa = (extra) => `https://wa.me/${waNumber}?text=${encodeURIComponent((extra || '') + message)}`;
    return new Promise((resolve) => {
      const ov = document.createElement('div');
      ov.className = 'modal-overlay';
      ov.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle">
          <h3 id="mTitle">${t.title}</h3><p class="sub">${t.sub}</p>
          <form novalidate>
            <div class="field" data-f="name"><label for="fName">${t.name}</label><input id="fName" autocomplete="name" maxlength="120"><span class="err"></span></div>
            <div class="field" data-f="phone"><label for="fPhone">${t.phone}</label><input id="fPhone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr"><span class="err"></span></div>
            <div class="field" data-f="address"><label for="fAddr">${t.address}</label><textarea id="fAddr" rows="2" maxlength="400"></textarea><span class="err"></span></div>
            <div class="field"><label for="fNotes">${t.notes}</label><input id="fNotes" maxlength="1000"></div>
            <p class="err" id="mErr" style="color:#b5493f;font-size:.85rem;display:none"></p>
            <div class="modal-actions">
              <button type="submit" class="btn btn-main">${t.send}</button>
              <button type="button" class="btn btn-outline" data-close>${t.cancel}</button>
            </div>
          </form>
        </div>`;
      document.body.appendChild(ov);
      const $ = (id) => ov.querySelector(id);
      let saved = false;
      const close = () => { document.removeEventListener('keydown', onKey); ov.remove(); resolve(saved); };
      const onKey = (e) => { if (e.key === 'Escape') close(); };
      document.addEventListener('keydown', onKey);
      ov.addEventListener('click', (e) => { if (e.target === ov || e.target.hasAttribute('data-close')) close(); });
      $('#fName').focus();

      const setErr = (f, msg) => { const el = ov.querySelector(`[data-f="${f}"]`); el.classList.toggle('invalid', !!msg); el.querySelector('.err').textContent = msg || ''; };
      ov.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const v = { customerName: $('#fName').value.trim(), phone: $('#fPhone').value.trim().replace(/[\s-]/g, ''), address: $('#fAddr').value.trim(), notes: $('#fNotes').value.trim() || null };
        const bad = { name: v.customerName.length < 2 ? t.badName : '', phone: /^(\+?20|0)?1[0125]\d{8}$/.test(v.phone) ? '' : t.badPhone, address: v.address.length < 5 ? t.badAddr : '' };
        Object.entries(bad).forEach(([k, m]) => setErr(k, m));
        if (bad.name || bad.phone || bad.address) return;

        const btn = ov.querySelector('[type=submit]'); btn.disabled = true; btn.textContent = t.sending;
        const box = ov.querySelector('.modal');
        try {
          const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...v, items: cart.map(i => ({ productId: i.id, quantity: i.qty })) }) });
          if (!res.ok) throw new Error(res.status);
          const order = await res.json();
          saved = true;
          box.innerHTML = `<h3>${t.okTitle}</h3><p class="sub">${t.okSub} <strong dir="ltr">${order.orderNumber}</strong></p>
            <div class="modal-actions"><a class="btn btn-main" target="_blank" rel="noopener" href="${wa(t.order + ' ' + order.orderNumber + '\n')}">
            <i class="fa-brands fa-whatsapp"></i> ${t.wa}</a><button class="btn btn-outline" data-close>${t.close}</button></div>`;
        } catch (err) {
          console.error(err);
          btn.disabled = false; btn.textContent = t.send;
          const m = $('#mErr'); m.style.display = 'block';
          m.innerHTML = `${t.fail} <a href="${wa()}" target="_blank" rel="noopener" style="text-decoration:underline">${t.wa}</a>`;
        }
      });
    });
  }
};

(async () => {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    // نحوّل الشكل لنفس الصيغة اللي الواجهة متعودة عليها (image, image2, image3...)
    products.splice(0, products.length, ...data.map(p => {
      const o = { id: p.id, category: p.category, title: p.title, titleEn: p.titleEn || '',
                  price: p.price, tag: p.tag || '', tagName: p.tagName || '', tagNameEn: p.tagNameEn || '' };
      p.images.forEach((url, i) => { o[i === 0 ? 'image' : 'image' + (i + 1)] = url; });
      return o;
    }));
  } catch (e) { console.error('Failed to load products', e); }
  window.__productsLoaded = true;
  window.dispatchEvent(new Event('products:loaded'));
})();
