document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("hero-form");
  const stage1 = document.querySelector(".form-stage-1");
  const stage2 = document.querySelector(".form-stage-2");
  const stage3 = document.querySelector(".form-stage-3");
  const formBox = document.getElementById("hero-form-box");

  // ================= LOCK FORM BOX HEIGHT =================
  function lockFormBoxHeight() {
    if (!formBox) return;
    formBox.style.minHeight = '';
    const stages = [stage1, stage2, stage3].filter(Boolean);
    const originalStates = stages.map(s => s.classList.contains('hidden'));
    stages.forEach(s => s.classList.remove('hidden'));
    let maxHeight = 0;
    stages.forEach((s, i) => {
      stages.forEach((other, j) => {
        if (j !== i) other.style.display = 'none';
      });
      const h = formBox.scrollHeight;
      if (h > maxHeight) maxHeight = h;
      stages.forEach((other, j) => {
        if (j !== i) other.style.display = '';
      });
    });
    stages.forEach((s, i) => {
      if (originalStates[i]) s.classList.add('hidden');
      else s.classList.remove('hidden');
    });
    if (maxHeight > 0) {
      formBox.style.minHeight = maxHeight + 'px';
    }
  }
  
  lockFormBoxHeight();
  
  document.querySelectorAll(".project-type-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".project-type-btn").forEach((b) => {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      if (document.getElementById("project-type")) {
        document.getElementById("project-type").value = btn.dataset.type;
      }
      if (stage1 && stage2) {
        stage1.classList.add("hidden");
        stage2.classList.remove("hidden");
        updateProgressIndicator(2);
      }
    });
  });
  
  window.addEventListener('resize', lockFormBoxHeight);

  // ================= INPUT VALIDATION =================
  const firstNameInput = form.elements["first_name"];
  const lastNameInput = form.elements["last_name"];
  const phoneInput = form.elements["phone"];

  function validateNameInput(input) {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/[0-9]/g, "");
    });
  }

  function validatePhoneInput(input) {
    input.addEventListener("input", function () {
      let value = this.value.replace(/[^0-9]/g, "");
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
      if (value.length > 0) {
        if (value.length <= 3) {
          this.value = value;
        } else if (value.length <= 6) {
          this.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
          this.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
        }
      } else {
        this.value = "";
      }
    });
  }

  if (firstNameInput) validateNameInput(firstNameInput);
  if (lastNameInput) validateNameInput(lastNameInput);
  if (phoneInput) validatePhoneInput(phoneInput);

  // ================= PROGRESS INDICATOR =================
  function updateProgressIndicator(stage) {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
      const percentage = (stage / 3) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  }

  // ================= STAGE NAVIGATION =================
  const stage1Next = document.getElementById("form-stage1-next");
  if (stage1Next) stage1Next.addEventListener("click", (e) => {
    e.preventDefault();
    const { first_name, last_name, email, phone } = form.elements;
    if (!first_name.value.trim() || !last_name.value.trim() || !email.value.trim() || !phone.value.trim()) {
      Swal.fire({ title: "Missing Info 😕", text: "Please fill in all required fields.", icon: "warning", confirmButtonColor: "#eab313" });
      return;
    }
    stage1.classList.add("hidden");
    stage3.classList.remove("hidden");
    updateProgressIndicator(3);
  });

  const stage3Prev = document.getElementById("form-stage3-prev");
  if (stage3Prev) stage3Prev.addEventListener("click", (e) => {
    e.preventDefault();
    stage3.classList.add("hidden");
    stage1.classList.remove("hidden");
    updateProgressIndicator(1);
  });

  const step2Next = document.getElementById("step2-next");
  if (step2Next) step2Next.addEventListener("click", (e) => {
    e.preventDefault();
    const { first_name, last_name, email, phone } = form.elements;
    if (!first_name.value.trim() || !last_name.value.trim() || !email.value.trim() || !phone.value.trim()) {
      Swal.fire({ title: "Missing Info 😕", text: "Please fill in all required fields.", icon: "warning", confirmButtonColor: "#eab313" });
      return;
    }
    stage2.classList.add("hidden");
    stage3.classList.remove("hidden");
    updateProgressIndicator(3);
  });

  const step2Prev = document.getElementById("step2-prev");
  if (step2Prev) step2Prev.addEventListener("click", (e) => {
    e.preventDefault();
    stage2.classList.add("hidden");
    stage1.classList.remove("hidden");
    updateProgressIndicator(1);
  });

  const step3Prev = document.getElementById("step3-prev");
  if (step3Prev) step3Prev.addEventListener("click", (e) => {
    e.preventDefault();
    stage3.classList.add("hidden");
    stage2.classList.remove("hidden");
    updateProgressIndicator(2);
  });

  // ================= SEND EMAIL =================
  async function sendEmail(form) {
    if (form.dataset.sending === "true") return;

    const fd = new FormData(form);
    const street = (fd.get("street_address") || "").toString().trim();
    const city = (fd.get("city") || "").toString().trim();
    const state = (fd.get("state") || "").toString().trim();
    const zip = (fd.get("zip_code") || "").toString().trim();

    if (!street || !city || !state || !zip) {
      Swal.fire({
        title: "Missing Info 😕",
        text: "Please fill in all required fields.",
        icon: "warning",
        confirmButtonColor: "#eab313"
      });
      return;
    }

    form.dataset.sending = "true";

    const submitBtn = document.getElementById("form-submit");
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';

    const payload = {
      first_name: fd.get("first_name"),
      last_name: fd.get("last_name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      street_address: street,
      city: city,
      state: state,
      zip_code: zip
    };

    // Send to Frappe backend
    fetch('https://propstarportal.com/api/method/funnelplaneapp.flooring_bull.create_flooring_lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Success - show success modal
      Swal.fire({
        title: `Thank you, ${fd.get("first_name")}! 🎉`,
        html: `
          <p>We’ve received your request.</p>
          <p class="font-semibold mt-2">Our team will contact you shortly.</p>
          <p class="mt-4 font-bold">– The Flooring Bull Team</p>
        `,
        icon: "success",
        confirmButtonColor: "#eab313",
        didOpen: () => {
          if (window.party) {
            const popup = document.querySelector(".swal2-popup");
            party.confetti(popup, {
              count: party.variation.range(60, 80),
              size: party.variation.range(1, 2),
              speed: party.variation.range(400, 700),
              spread: 120
            });
          }
        }
      });

      form.reset();
      stage3.classList.add("hidden");
      stage1.classList.remove("hidden");
      updateProgressIndicator(1);

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.dataset.sending = "false";
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        title: "Oops 😕",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#eab313"
      });
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.dataset.sending = "false";
    });
  }

  // ================= FINAL SUBMIT =================
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    sendEmail(this);
  });

  // ================= ADDRESSZEN AUTOCOMPLETE =================
  if (typeof AddressZen !== "undefined" && AddressZen.AddressLookup) {
    try {
      AddressZen.AddressLookup.setup({
        apiKey: 'ak_mkrc7w2a3CLaH3SHj9efnBcrg7s9T',
        outputFields: {
          line_1: '#hero-form input[name="street_address"]',
          city: '#hero-form input[name="city"]',
          state: '#hero-form input[name="state"]',
          zip_plus_4_code: '#hero-form input[name="zip_code"]'
        },
        searchField: '#hero-form input[name="street_address"]',
        autoSelect: true,
        country: 'US'
      });
    } catch (err) {
      console.warn("AddressZen initialization failed:", err);
    }
  } else {
    console.warn("AddressZen library not loaded");
  }
});