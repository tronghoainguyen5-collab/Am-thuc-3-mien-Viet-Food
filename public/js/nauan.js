const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let steps = [];
let current = 0;
let auto = null;

fetch("./data/db.json")
  .then(res => res.json())
  .then(data => {
    const recipe = data.recipes.find(r => r.id == id);

    document.getElementById("cook-title").innerText = recipe.name;
    document.getElementById("cook-img").src = recipe.image;

    steps = recipe.steps || [
      "Chuẩn bị nguyên liệu",
      "Sơ chế nguyên liệu",
      "Tiến hành nấu",
      "Trang trí & thưởng thức"
    ];

    renderStep();
  });

// render step
function renderStep() {
  const stepBox = document.getElementById("cook-step");

  stepBox.innerHTML = `
    <h2>Bước ${current + 1}/${steps.length}</h2>
    <p>${steps[current]}</p>
  `;

  stepBox.classList.remove("fade");
  setTimeout(() => stepBox.classList.add("fade"), 10);

  // progress
  let percent = ((current + 1) / steps.length) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
}

// next
document.getElementById("next-step").onclick = () => {
  if (current < steps.length - 1) {
    current++;
    renderStep();
  }
};

// prev
document.getElementById("prev-step").onclick = () => {
  if (current > 0) {
    current--;
    renderStep();
  }
};

// 🔥 auto cook
document.getElementById("auto-play").onclick = () => {
  if (auto) {
    clearInterval(auto);
    auto = null;
    showToast("⏸ Đã dừng auto");
    return;
  }

  auto = setInterval(() => {
    if (current < steps.length - 1) {
      current++;
      renderStep();
    } else {
      clearInterval(auto);
      showToast("🍽 Hoàn thành!");
    }
  }, 3000);

  showToast("▶ Đang auto nấu...");
};

// 🔥 toast
function showToast(msg) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 200);
  }, 2000);
}