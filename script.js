// 🔹 التحكم في عرض الصفحات
document.querySelectorAll(".menu-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active");
    });
    document.getElementById(target).classList.add("active");
  });
});

// 🔹 حماية لوحة الإدارة بكلمة سر
document.getElementById("adminBtn").addEventListener("click", () => {
  const password = prompt("🔒 أدخل كلمة السر للوصول إلى لوحة الإدارة:");
  if (password === "admin123") {
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    document.getElementById("admin").classList.add("active");
    loadAppointments();
  } else {
    alert("❌ كلمة السر غير صحيحة!");
  }
});

// 🔹 خلفية متغيرة تلقائيًا
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".background-slideshow .bg");
  let current = 0;

  function nextSlide() {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }

  slides[current].classList.add("active");
  setInterval(nextSlide, 6000);
});
// 🔹 تحميل المواعيد داخل لوحة الإدارة
function loadAppointments() {
  const container = document.getElementById('appointments');
  container.innerHTML = "";

  let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

  if (appointments.length === 0) {
    container.innerHTML = "<p>لا توجد مواعيد حالياً.</p>";
    return;
  }

  appointments.forEach((a, index) => {
    const div = document.createElement('div');
    div.className = 'appointment';

    let statusHTML = "";

    if (a.status === "تم القبول") {
      statusHTML = `
        <span class="accepted">✅ تم قبول الموعد المحدد</span>
        <button class="delete-btn" onclick="deleteAppointment(${index})">🗑️ حذف</button>
      `;
    } else if (a.status === "تم الرفض") {
      statusHTML = `
        <span class="rejected">❌ تم رفض الموعد المحدد</span>
        <button class="delete-btn" onclick="deleteAppointment(${index})">🗑️ حذف</button>
      `;
    } else {
      statusHTML = `
        <button class="accept-btn" onclick="updateStatus(${index}, 'تم القبول')">✅ قبول</button>
        <button class="reject-btn" onclick="updateStatus(${index}, 'تم الرفض')">❌ رفض</button>
      `;
    }

    div.innerHTML = `
      <p><b>الاسم:</b> ${escapeHtml(a.name)}</p>
      <p><b>الإيميل:</b> ${escapeHtml(a.email)}</p>
      <p><b>الهاتف:</b> ${escapeHtml(a.phone)}</p>
      <p><b>الخدمة المطلوبة:</b> ${escapeHtml(a.request)}</p>
      <p><b>التاريخ:</b> ${escapeHtml(a.date)}</p>
      <p><b>الحالة الحالية:</b> ${escapeHtml(a.status)}</p>
      <div class="status-area">${statusHTML}</div>
    `;
    container.appendChild(div);
  });
}

// 🔹 إرسال الحجز
document.getElementById("bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const booking = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    reason: document.getElementById("reason").value,
    service: document.getElementById("service").value,
    date: document.getElementById("date").value,
    status: "قيد المراجعة",
  };

  let data = JSON.parse(localStorage.getItem("appointments")) || [];
  data.push(booking);
  localStorage.setItem("appointments", JSON.stringify(data));

  document.getElementById("confirmMsg").style.display = "block";
  setTimeout(() => (document.getElementById("confirmMsg").style.display = "none"), 2500);

  e.target.reset();
});

// 🔹 تحميل المواعيد في لوحة الإدارة
function loadAppointments() {
  const container = document.getElementById("appointments");
  container.innerHTML = "";

  const data = JSON.parse(localStorage.getItem("appointments")) || [];

  if (data.length === 0) {
    container.innerHTML = "<p>لا توجد مواعيد بعد.</p>";
    return;
  }

  data.forEach((a, index) => {
    const div = document.createElement("div");
    div.classList.add("appointment");

    div.innerHTML = `
      <p><b>الاسم:</b> ${a.name}</p>
      <p><b>الهاتف:</b> ${a.phone}</p>
      <p><b>البريد:</b> ${a.email}</p>
      <p><b>السبب:</b> ${a.reason}</p>
      <p><b>الخدمة:</b> ${a.service}</p>
      <p><b>التاريخ:</b> ${a.date}</p>
      <p><b>الحالة:</b> ${a.status}</p>
      ${
        a.status === "قيد المراجعة"
          ? `
          <button class="accept-btn" onclick="updateStatus(${index}, 'تم القبول')">✅ قبول</button>
          <button class="reject-btn" onclick="updateStatus(${index}, 'تم الرفض')">❌ رفض</button>
          `
          : `<button class="delete-btn" onclick="deleteAppointment(${index})">🗑️ حذف</button>`
      }
    `;

    container.appendChild(div);
  });
}

// 🔹 تحديث الحالة
function updateStatus(index, newStatus) {
  let data = JSON.parse(localStorage.getItem("appointments")) || [];
  data[index].status = newStatus;
  localStorage.setItem("appointments", JSON.stringify(data));
  loadAppointments();
}

// 🔹 حذف الموعد
function deleteAppointment(index) {
  if (!confirm("هل تريد حذف هذا الموعد؟")) return;
  let data = JSON.parse(localStorage.getItem("appointments")) || [];
  data.splice(index, 1);
  localStorage.setItem("appointments", JSON.stringify(data));
  loadAppointments();
}
// 🔹 عرض حالة المستخدم عند دخوله لصفحة الحجز
function showUserStatus() {
  const email = localStorage.getItem('lastUserEmail');
  if (!email) return;

  const status = localStorage.getItem(`status_${email}`);
  const msgBox = document.getElementById('statusMessage');

  if (status) {
    msgBox.textContent = status === "تم القبول"
      ? "✅ تم قبول موعدك!"
      : "❌ تم رفض موعدك.";
    msgBox.className = status === "تم القبول" ? "accepted-msg" : "rejected-msg";
    msgBox.style.display = "block";
  } else {
    msgBox.style.display = "none";
  }
}

// 🔹 تعديل صغير داخل showTab لتفعيلها عند الدخول إلى صفحة الحجز
function showTab(tabId) {
  const tabs = document.querySelectorAll('.page');
  tabs.forEach(tab => tab.classList.remove('active'));
  const el = document.getElementById(tabId);
  if (el) el.classList.add('active');

  if (tabId === 'booking') showUserStatus();
}