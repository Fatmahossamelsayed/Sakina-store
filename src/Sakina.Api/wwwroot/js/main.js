// Dynamic Operations, i18n & Interactions

/* رقم الواتساب لاستلام الطلبات — غيّريه هنا لو حبيتي */
const WHATSAPP_NUMBER = "+201019712312";

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. Dictionary for English / Arabic (i18n)
     ========================================== */
  const translations = {
    ar: {
      "top.bar": "✨ شحن مجاني للطلبات لأكثر من 2000 ج.م | جميع المقاسات FREE SIZE ✨",
      "hero.badge": "تشكيلة الستان الجديدة",
      "nav.home": "الرئيسية",
      "nav.isdal": "الإسدال",
      "nav.pajamas": "البيجامات",
      "nav.abayas": "العبايات",
      "nav.dresses": "الفساتين",
      "hero.title": "أناقة وراحة تدوم في كل لحظة",
      "hero.p": "تشكيلة بيجامات وإسدال بخامة ستان مريحة جداً ✨ بالإضافة للعبايات والفساتين. مقاسات FREE SIZE مع إمكانية التفصيل المخصص.",
      "hero.ctaPajamas": "تسوقي البيجامات",
      "hero.ctaIsdal": "استكشفي الإسدال",
      "cat.title": "أقسام المجموعة",
      "cat.subtitle": "اختاري من تشكيلتنا المصممة بكل حب",
      "cat.isdalDesc": "خامة ستان أرماني مريحة جداً ✨",
      "cat.pajamasDesc": "تصاميم ستان أرماني ناعمة ومريحة",
      "cat.abayasDesc": "قصات أنيقة وإطلالة راقية",
      "cat.dressesDesc": "فساتين سهرة وكاجوال متميزة",
      "cat.browse": "تصفحي المنتجات ←",
      "size.note": "جميع المقاسات FREE SIZE ✨ - Made with love for the most beautiful lady 🏷️🧵🎀 (تتوفر إمكانية تفصيل مقاسك الخاص عبر الواتساب او لو عايزه ديزاين علي زوقك 😉)",
      "contact.title": "هل لديكِ استفسار أو تفصيل خاص؟",
      "contact.desc": "يمكنك التواصل معنا مباشرة عبر الواتساب لتحديد المقاسات الخاصة أو لأي استفسار حول المنتجات.",
      "contact.btn": "تواصل عبر الواتساب",
      "filter.all": "الكل",
      "filter.bestseller": "الأكثر مبيعاً",
      "filter.new": "وصل حديثاً",
      "filter.limited": "كمية محدودة",
      "filter.searchPh": "بحث...",
      "cart.title": "سلة التسوق",
      "cart.total": "الإجمالي:",
      "cart.checkout": "إتمام الطلب عبر الواتساب",
      "cart.empty": "السلة فارغة حالياً 🛍️",
      "cart.addToast": "تم إضافة المنتج للسلة ✨",
      "footer.about": "سكينة — أزياء نسائية مريحة وأنيقة صُنعت بحب لأجمل جميلات.",
      "footer.quickLinks": "روابط سريعة",
      "footer.contactUs": "تواصل معنا"
    },
    en: {
      "top.bar": "✨ Free shipping on orders over 2000 EGP | All sizes are FREE SIZE ✨",
      "hero.badge": "New Satin Collection",
      "nav.home": "Home",
      "nav.isdal": "Isdal",
      "nav.pajamas": "Pajamas",
      "nav.abayas": "Abayas",
      "nav.dresses": "Dresses",
      "hero.title": "Elegance & Comfort That Lasts",
      "hero.p": "Collection of pajamas & Isdals in comfortable Satin ✨ plus Abayas & Dresses. FREE SIZE with custom tailoring available.",
      "hero.ctaPajamas": "Shop Pajamas",
      "hero.ctaIsdal": "Explore Isdal",
      "cat.title": "Categories",
      "cat.subtitle": "Choose from our lovingly crafted collection",
      "cat.isdalDesc": "Very comfortable Armani satin fabric ✨",
      "cat.pajamasDesc": "Soft and cozy Armani satin designs",
      "cat.abayasDesc": "Elegant cuts & classy look",
      "cat.dressesDesc": "Exquisite evening & casual dresses",
      "cat.browse": "Browse Products →",
      "size.note": "All sizes are FREE SIZE ✨ - Made with love for the most beautiful lady 🏷️🧵🎀 (You can customize your own size via WhatsApp, or if you have a specific design in mind, we can create it for you! 😉)",
      "contact.title": "Have an inquiry or custom size request?",
      "contact.desc": "Contact us directly on WhatsApp to specify custom measurements or ask about products.",
      "contact.btn": "Contact via WhatsApp",
      "filter.all": "All",
      "filter.bestseller": "Best Seller",
      "filter.new": "New Arrival",
      "filter.limited": "Limited Edition",
      "filter.searchPh": "Search...",
      "cart.title": "Shopping Cart",
      "cart.total": "Total:",
      "cart.checkout": "Checkout via WhatsApp",
      "cart.empty": "Your cart is currently empty 🛍️",
      "cart.addToast": "Item added to cart ✨",
      "footer.about": "Sakina — Comfortable & elegant women's fashion made with love for the most beautiful lady.",
      "footer.quickLinks": "Quick Links",
      "footer.contactUs": "Contact Us"
    }
  };

  /* ==========================================
     2. Language Switcher Logic
     ========================================== */
  const langToggleBtn = document.getElementById('langToggle');
  let currentLang = localStorage.getItem('sakina_lang') || 'ar';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('sakina_lang', lang);

    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    if (langToggleBtn) {
      langToggleBtn.textContent = lang === 'ar' ? 'EN' : 'عربي';
    }

    // Translate DOM elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (translations[lang] && translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });

    renderCart();
    if (typeof filterAndRender === 'function') {
      filterAndRender();
    }
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const newLang = currentLang === 'ar' ? 'en' : 'ar';
      applyLanguage(newLang);
    });
  }

  /* ==========================================
     3. Dark Mode Toggle
     ========================================== */
  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('sakina_theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sakina_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-regular fa-moon';
    }
  }

  /* ==========================================
     4. Mobile Menu & Cart Drawer
     ========================================== */
  const menuBtn = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

  const cartBtn = document.getElementById('cartOpen');
  const cartCloseBtn = document.getElementById('cartClose');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');

  function openCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
    }
  }

  function closeCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
    }
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  /* ==========================================
     5. Cart Logic
     ========================================== */
  let cart = JSON.parse(localStorage.getItem('sakina_cart')) || [];

  window.addToCart = function(productId) {
    if (typeof products === 'undefined') return;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    saveAndRenderCart();
    const title = currentLang === 'en' && product.titleEn ? product.titleEn : product.title;
    showToast(`${translations[currentLang]["cart.addToast"]} (${title})`);
  };

  window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveAndRenderCart();
  };

  window.changeQty = function(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        removeFromCart(productId);
      } else {
        saveAndRenderCart();
      }
    }
  };

  function saveAndRenderCart() {
    localStorage.setItem('sakina_cart', JSON.stringify(cart));
    renderCart();
  }

  function renderCart() {
    const cartBody = document.getElementById('cartBody');
    const cartBadge = document.getElementById('cartBadge');
    const cartTotal = document.getElementById('cartTotal');

    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.classList.remove('bump');
      // force reflow so the animation can replay even if count changes rapidly
      void cartBadge.offsetWidth;
      cartBadge.classList.add('bump');
    }
    if (cartTotal) cartTotal.textContent = `${totalPrice} ${currentLang === 'en' ? 'EGP' : 'ج.م'}`;

    if (!cartBody) return;

    if (cart.length === 0) {
      cartBody.innerHTML = `<div class="cart-empty"><i class="fa-solid fa-bag-shopping"></i>${translations[currentLang]["cart.empty"]}</div>`;
      return;
    }

    cartBody.innerHTML = cart.map(item => {
      const itemTitle = currentLang === 'en' && item.titleEn ? item.titleEn : item.title;
      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${itemTitle}" onerror="this.src='https://via.placeholder.com/60x75/E8D5C8/2B2118?text=Sakina'">
          <div style="flex: 1;">
            <h5 style="font-size: 0.95rem; margin-bottom: 4px;">${itemTitle}</h5>
            <div style="font-size: 0.85rem; color: var(--primary); font-weight: bold; margin-bottom: 6px;">${item.price} ${currentLang === 'en' ? 'EGP' : 'ج.م'}</div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <button class="qty-btn" aria-label="-" onclick="changeQty(${item.id}, -1)">−</button>
              <span style="font-size: 0.95rem; min-width: 14px; text-align: center;">${item.qty}</span>
              <button class="qty-btn" aria-label="+" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
          </div>
          <button class="cart-remove" aria-label="remove" onclick="removeFromCart(${item.id})">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    }).join('');
  }

  /* ==========================================
     6. WhatsApp Checkout
     ========================================== */
  const checkoutBtn = document.getElementById('whatsappCheckoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      if (cart.length === 0) {
        showToast(translations[currentLang]["cart.empty"]);
        return;
      }
      
      let message = currentLang === 'en' 
        ? 'Hello Sakina ✨ I would like to order:\n\n'
        : 'مرحباً سكينة ✨ أود طلب المنتجات التالية:\n\n';

      cart.forEach((item, index) => {
        const title = currentLang === 'en' && item.titleEn ? item.titleEn : item.title;
        message += `${index + 1}. ${title} (Qty: ${item.qty}) - ${item.price * item.qty} ${currentLang === 'en' ? 'EGP' : 'ج.م'}\n`;
      });
      
      const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      message += `\n${translations[currentLang]["cart.total"]} ${totalPrice} ${currentLang === 'en' ? 'EGP' : 'ج.م'}`;
      message += `\nSize: FREE SIZE (or Custom Size Request)`;

      // نافذة بيانات العميل → حفظ الطلب في الداتابيز → زرار الواتساب
      checkoutBtn.disabled = true;
      try {
        const saved = await window.SakinaApi.checkout(cart, message, WHATSAPP_NUMBER, currentLang);
        if (saved) { cart = []; saveAndRenderCart(); }
      } catch (e) { console.error(e); }
      checkoutBtn.disabled = false;
    });
  }

  /* ==========================================
     7. Toast & Products Filter
     ========================================== */
  function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
      toastMsg.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }

  const category = document.body.dataset.category;
  const productsGrid = document.getElementById('productsGrid');

  let filterAndRender = null;

  if (category && productsGrid && typeof products !== 'undefined') {
    let currentFilter = 'all';
    let searchQuery = '';

    filterAndRender = function() {
      if (!products.length && !window.__productsLoaded) {
        productsGrid.innerHTML = Array.from({ length: 8 }, () => '<div class="skeleton"></div>').join('');
        return;
      }
      let filtered = products.filter(p => p.category === category);

      if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.tag === currentFilter);
      }

      if (searchQuery.trim() !== '') {
        filtered = filtered.filter(p => {
          const title = currentLang === 'en' && p.titleEn ? p.titleEn : p.title;
          return title.toLowerCase().includes(searchQuery.trim().toLowerCase());
        });
      }

      if (filtered.length === 0) {
        productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">${currentLang === 'en' ? 'No products found.' : 'لا توجد منتجات مطابقة.'}</p>`;
        return;
      }

      productsGrid.innerHTML = filtered.map((p, idx) => {
        const title = currentLang === 'en' && p.titleEn ? p.titleEn : p.title;
        const tagName = currentLang === 'en' && p.tagNameEn ? p.tagNameEn : p.tagName;
        const delay = Math.min(idx, 10) * 0.06;
        return `
          <div class="product-card" style="animation-delay:${delay}s">
            <a href="product.html?id=${p.id}" class="product-img" style="display: block; cursor: pointer;">
              <img class="product-img-bg" src="${p.image}" alt="" aria-hidden="true">
              <img src="${p.image}" alt="${title}" onerror="this.src='https://via.placeholder.com/300x400/E8D5C8/2B2118?text=${encodeURIComponent(title)}'">
              ${p.image2 ? `<img class="product-img-alt" src="${p.image2}" alt="" loading="lazy">` : ''}
              ${tagName ? `<span class="product-tag">${tagName}</span>` : ''}
            </a>
            <div class="product-details">
              <h3 class="product-title">
                <a href="product.html?id=${p.id}">${title}</a>
              </h3>
              <div class="product-price">${p.price} ${currentLang === 'en' ? 'EGP' : 'ج.م'}</div>
              <button class="btn btn-main" style="width: 100%; justify-content: center;" onclick="addToCart(${p.id}); flashAdded(this)">
                <i class="fa-solid fa-cart-plus"></i> <span>${currentLang === 'en' ? 'Add to Cart' : 'إضافة للسلة'}</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    };

    const filterChips = document.querySelectorAll('#filterChips .chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.dataset.filter;
        filterAndRender();
      });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterAndRender();
      });
    }
  }

  // المنتجات بتيجي من الـ API بشكل غير متزامن
  window.addEventListener('products:loaded', () => { if (filterAndRender) filterAndRender(); });

  /* ==========================================
     7. Polish: header, scroll reveal, add-to-cart feedback
     ========================================== */
  document.documentElement.classList.add('js');
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const revealEls = document.querySelectorAll('.section-title, .cat-card, .contact-box, .size-banner, .filter-bar');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    revealEls.forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--d', (i % 4) * 0.08 + 's'); io.observe(el); });
  }

  window.flashAdded = function(btn) {
    const label = btn.querySelector('span'); if (!label) return;
    const old = label.textContent;
    btn.classList.add('added'); label.textContent = currentLang === 'en' ? 'Added ✓' : 'تمت الإضافة ✓';
    setTimeout(() => { btn.classList.remove('added'); label.textContent = old; }, 1400);
  };

  // Initial Language Load
  applyLanguage(currentLang);
});