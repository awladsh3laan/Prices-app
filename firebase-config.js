// ================================================================
//  إعدادات Firebase
// ================================================================

const firebaseConfig = {
  apiKey: "AIzaSyArXk6SRMaPKX506mDWLiFLpZfb0FSM1WA",
  authDomain: "prices-abdo.firebaseapp.com",
  databaseURL: "https://prices-abdo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "prices-abdo",
  storageBucket: "prices-abdo.firebasestorage.app",
  messagingSenderId: "606381855134",
  appId: "1:606381855134:web:23663e90376546c1e3868f"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// مراجع قواعد البيانات
const db = firebase.database();
const auth = firebase.auth();

// ================================================================
//  دوال مساعدة
// ================================================================

// جلب جميع المنتجات
async function getProducts() {
  try {
    const snapshot = await db.ref('products').once('value');
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  } catch (error) {
    console.error('خطأ في جلب المنتجات:', error);
    return [];
  }
}

// جلب بيانات المدير
async function getAdmin() {
  try {
    const snapshot = await db.ref('admins').once('value');
    const data = snapshot.val();
    return data || null;
  } catch (error) {
    console.error('خطأ في جلب بيانات المدير:', error);
    return null;
  }
}

// حفظ المنتجات
async function saveProducts(products) {
  try {
    await db.ref('products').set(products);
    return true;
  } catch (error) {
    console.error('خطأ في حفظ المنتجات:', error);
    return false;
  }
}

// تحديث منتج واحد
async function updateProduct(productId, productData) {
  try {
    await db.ref(`products/${productId}`).update(productData);
    return true;
  } catch (error) {
    console.error('خطأ في تحديث المنتج:', error);
    return false;
  }
}

// حذف منتج
async function deleteProduct(productId) {
  try {
    await db.ref(`products/${productId}`).remove();
    return true;
  } catch (error) {
    console.error('خطأ في حذف المنتج:', error);
    return false;
  }
}

// إضافة منتج جديد
async function addProduct(productData) {
  try {
    const newRef = db.ref('products').push();
    await newRef.set(productData);
    return newRef.key;
  } catch (error) {
    console.error('خطأ في إضافة المنتج:', error);
    return null;
  }
}

// تسجيل الدخول
async function loginAdmin(username, password) {
  try {
    const admin = await getAdmin();
    if (admin && admin.username === username && admin.password === password) {
      // تحديث آخر تسجيل دخول
      await db.ref('admin/lastLogin').set(new Date().toISOString());
      // حفظ جلسة
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', username);
      return true;
    }
    return false;
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    return false;
  }
}

// تسجيل الخروج
function logout() {
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('username');
  window.location.href = 'login.html';
}

// التحقق من حالة الدخول
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  if (!isLoggedIn || isLoggedIn !== 'true') {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// تحديث بيانات المدير
async function updateAdmin(newData) {
  try {
    await db.ref('admin').update(newData);
    return true;
  } catch (error) {
    console.error('خطأ في تحديث بيانات المدير:', error);
    return false;
  }
}
