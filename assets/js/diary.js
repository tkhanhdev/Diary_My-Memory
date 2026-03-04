document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  renderDiaries();

  // Sự kiện Đổi màu Theme
  const themeDots = document.querySelectorAll(".theme-dot");
  themeDots.forEach((dot) => {
    dot.addEventListener("click", function () {
      const rgb = this.getAttribute("data-color");
      updateTheme(rgb);
    });
  });

  // Nút Lưu tâm sự
  document.getElementById("save-btn")?.addEventListener("click", () => {
    const content = document.getElementById("diary-content").value.trim();
    if (content) {
      const newDiary = {
        id: Date.now(),
        content: content,
        date: new Date().toLocaleString("vi-VN"),
      };
      addDiary(newDiary);
      document.getElementById("diary-content").value = "";
    }
  });

  document.getElementById("update-btn")?.addEventListener("click", saveEdit);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});

function updateTheme(rgb) {
  document.documentElement.style.setProperty("--primary-rgb", rgb);
  document.documentElement.style.setProperty("--primary-color", `rgb(${rgb})`);

  document
    .querySelectorAll(".theme-dot")
    .forEach((d) => d.classList.remove("active"));
  document.querySelector(`[data-color="${rgb}"]`)?.classList.add("active");

  localStorage.setItem("userThemeRGB", rgb);
}

function loadTheme() {
  const savedRGB = localStorage.getItem("userThemeRGB") || "45, 107, 92";
  updateTheme(savedRGB);
}

function renderDiaries() {
  const list = document.getElementById("diary-list");
  const diaries = JSON.parse(localStorage.getItem("myDiaries") || "[]");
  list.innerHTML = diaries
    .map(
      (item) => `
        <div class="diary__item">
            <small style="color: #888;">${item.date}</small>
            <div class="item__content" id="content-${item.id}">${item.content}</div>
            <div class="item__actions">
                <button class="action-btn view" onclick="viewDetail(${item.id})">
                    <i class='bx bx-expand-alt'></i>
                </button>
                <button class="action-btn edit" onclick="openEditModal(${item.id})">
                    <i class='bx bx-edit-alt'></i>
                </button>
                <button class="action-btn delete" onclick="deleteDiary(${item.id})">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

function addDiary(item) {
  let diaries = JSON.parse(localStorage.getItem("myDiaries") || "[]");
  diaries.unshift(item);
  localStorage.setItem("myDiaries", JSON.stringify(diaries));
  renderDiaries();
}

window.deleteDiary = (id) => {
  if (confirm("Xóa tâm sự này?")) {
    let diaries = JSON.parse(localStorage.getItem("myDiaries") || "[]");
    localStorage.setItem(
      "myDiaries",
      JSON.stringify(diaries.filter((d) => d.id !== id)),
    );
    renderDiaries();
  }
};

let currentEditId = null;
window.openEditModal = (id) => {
  const diaries = JSON.parse(localStorage.getItem("myDiaries") || "[]");
  const diary = diaries.find((d) => d.id === id);
  if (diary) {
    currentEditId = id;
    document.getElementById("edit-textarea").value = diary.content;
    document.getElementById("edit-modal").classList.add("active");
  }
};

function saveEdit() {
  const newContent = document.getElementById("edit-textarea").value.trim();
  if (newContent && currentEditId) {
    let diaries = JSON.parse(localStorage.getItem("myDiaries") || "[]");
    const idx = diaries.findIndex((d) => d.id === currentEditId);
    diaries[idx].content = newContent;
    localStorage.setItem("myDiaries", JSON.stringify(diaries));
    renderDiaries();
    closeModal();
  }
}

window.viewDetail = (id) => {
  const el = document.getElementById(`content-${id}`);
  el.style.display = el.style.display === "block" ? "-webkit-box" : "block";
};

window.closeModal = () =>
  document.getElementById("edit-modal").classList.remove("active");
