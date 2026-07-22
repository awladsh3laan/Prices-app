// ================================================================
//  الوظائف المشتركة
// ================================================================

// عرض رسالة Toast
function showToast(message, type = 'success') {
  const toast = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');
  const icon = toast.querySelector('i');
  
  toastText.textContent = message;
  
  if (type === 'success') {
    icon.className = 'fas fa-check-circle';
    icon.style.color = '#22c55e';
  } else if (type === 'error') {
    icon.className = 'fas fa-exclamation-circle';
    icon.style.color = '#ef4444';
  } else if (type === 'warning') {
    icon.className = 'fas fa-triangle-exclamation';
    icon.style.color = '#f59e0b';
  }
  
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// أيقونة المنتج
function getProductIcon(name) {
  if (name.includes('صابون')) return 'fa-soap';
  if (name.includes('فرشاة') || name.includes('فرشة')) return 'fa-brush';
  if (name.includes('معجون')) return 'fa-toothbrush';
  if (name.includes('ليفة')) return 'fa-hand-sparkles';
  if (name.includes('بخور')) return 'fa-leaf';
  if (name.includes('كلوركس') || name.includes('بريكس')) return 'fa-bottle-water';
  if (name.includes('مكن')) return 'fa-bolt';
  if (name.includes('شفرات') || name.includes('امواس')) return 'fa-cut';
  if (name.includes('مناديل')) return 'fa-box';
  if (name.includes('ديتول')) return 'fa-shield-halved';
  if (name.includes('بخاخ')) return 'fa-spray-can-sparkles';
  if (name.includes('كريم')) return 'fa-cream';
  if (name.includes('شاور')) return 'fa-shower';
  if (name.includes('مسواك')) return 'fa-tooth';
  if (name.includes('حفاضات')) return 'fa-baby';
  if (name.includes('مبيد') || name.includes('حشرات')) return 'fa-bug';
  if (name.includes('بريل') || name.includes('منظف')) return 'fa-bucket';
  if (name.includes('ملمع')) return 'fa-spray-can';
  if (name.includes('جل')) return 'fa-droplet';
  if (name.includes('بودرة')) return 'fa-flask';
  if (name.includes('فوط')) return 'fa-heart';
  if (name.includes('شامبو')) return 'fa-shampoo';
  if (name.includes('معطر')) return 'fa-wind';
  if (name.includes('ديتول')) return 'fa-shield-virus';
  return 'fa-cube';
}

// تنسيق الأرقام
function formatPrice(price) {
  if (typeof price === 'string') return price;
  if (typeof price === 'number') return price.toFixed(2);
  return price;
}

// توليد ID فريد
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

// التحقق من صحة البيانات
function validateProduct(data) {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('اسم المنتج مطلوب');
  }
  
  if (!data.wholesalePrice || data.wholesalePrice <= 0) {
    errors.push('سعر الجملة مطلوب وقيمة صحيحة');
  }
  
  if (!data.retailPrice || data.retailPrice.trim() === '') {
    errors.push('سعر البيع للمستهلك مطلوب');
  }
  
  return errors;
}

// تصدير المنتجات كـ HTML
function exportProductsHTML(products) {
  const productsArray = Object.values(products);
  
  let html = `const products = [\n`;
  
  productsArray.forEach((p, index) => {
    const id = String(p.id || index + 1).padStart(3, '0');
    const name = p.name || '';
    const unit = p.unit || '';
    const unitQty = p.unitQty || '';
    const wholesalePrice = p.wholesalePrice || 0;
    const retailPrice = p.retailPrice || '';
    const piecePrice = p.piecePrice || '';
    const unitPrice = p.unitPrice || '';
    
    html += `  {\n`;
    html += `    id: "${id}",\n`;
    html += `    name: "${name}",\n`;
    html += `    unit: "${unit}",\n`;
    html += `    unitQty: "${unitQty}",\n`;
    html += `    wholesalePrice: ${wholesalePrice},\n`;
    html += `    retailPrice: "${retailPrice}",\n`;
    html += `    piecePrice: "${piecePrice}",\n`;
    html += `    unitPrice: "${unitPrice}",\n`;
    html += `    status: "متوفر",\n`;
    html += `    minOrder: 1,\n`;
    html += `    maxOrder: 999,\n`;
    html += `    storeType: "both",\n`;
    html += `    description: "",\n`;
    html += `    imageUrl: ""\n`;
    html += `  }${index < productsArray.length - 1 ? ',' : ''}\n`;
  });
  
  html += `];\n`;
  
  return html;
}

// تحميل ملف HTML
function downloadHTML(content, filename = 'index.html') {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// تشغيل/إيقاف الهامبرجر
function toggleHamburger() {
  const nav = document.getElementById('navMenu');
  nav.classList.toggle('open');
}

// إغلاق المينيو عند الضغط على رابط
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const nav = document.getElementById('navMenu');
      if (nav && window.innerWidth <= 768) {
        nav.classList.remove('open');
      }
    });
  });
});
