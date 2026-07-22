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
    // إنشاء ID جديد
    const products = await getProducts();
    const maxId = products.reduce((max, p) => {
      const numId = parseInt(p.id);
      return numId > max ? numId : max;
    }, 0);
    const newId = String(maxId + 1).padStart(3, '0');
    
    productData.id = newId;
    
    // إضافة المنتج إلى القائمة
    products.push(productData);
    
    // حفظ القائمة كاملة
    const success = await saveProducts(products);
    return success ? newId : null;
  } catch (error) {
    console.error('خطأ في إضافة المنتج:', error);
    return null;
  }
}

// ================================================================
//  دوال المصادقة (Firebase Auth)
// ================================================================

// تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
async function loginAdmin(email, password) {
  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    const user = result.user;
    
    // تخزين بيانات الجلسة
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userEmail', user.email);
    sessionStorage.setItem('userId', user.uid);
    
    // تحديث آخر تسجيل دخول في قاعدة البيانات
    await db.ref(`admin/users/${user.uid}/lastLogin`).set(Date.now());
    
    return true;
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    return false;
  }
}

// تسجيل الخروج
async function logout() {
  try {
    await auth.signOut();
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userId');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
  }
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

// جلب بيانات المستخدم من Firebase Auth
function getCurrentUser() {
  return auth.currentUser;
}

// تحديث بيانات المستخدم (الاسم)
async function updateUserProfile(displayName) {
  try {
    const user = auth.currentUser;
    if (user) {
      await user.updateProfile({
        displayName: displayName
      });
      
      // تحديث في قاعدة البيانات أيضاً
      await db.ref(`admin/users/${user.uid}/displayName`).set(displayName);
      return true;
    }
    return false;
  } catch (error) {
    console.error('خطأ في تحديث الملف الشخصي:', error);
    return false;
  }
}

// تحديث كلمة المرور
async function updateUserPassword(newPassword) {
  try {
    const user = auth.currentUser;
    if (user) {
      await user.updatePassword(newPassword);
      return true;
    }
    return false;
  } catch (error) {
    console.error('خطأ في تحديث كلمة المرور:', error);
    return false;
  }
}

// جلب بيانات المستخدم من قاعدة البيانات (للمعلومات الإضافية)
async function getUserData() {
  try {
    const user = auth.currentUser;
    if (user) {
      const snapshot = await db.ref(`admin/users/${user.uid}`).once('value');
      const data = snapshot.val();
      return data || null;
    }
    return null;
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error);
    return null;
  }
}
