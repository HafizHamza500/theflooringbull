
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("hero-form");
  const stage1 = document.querySelector(".form-stage-1");
  const stage2 = document.querySelector(".form-stage-2");
  const stage3 = document.querySelector(".form-stage-3");
  const formBox = document.getElementById("hero-form-box");

  // ================= LOCK FORM BOX HEIGHT =================
  function lockFormBoxHeight() {
    if (!formBox) return;
    // Reset min-height first
    formBox.style.minHeight = '';
    
    // Temporarily show all stages to measure
    const stages = [stage1, stage2, stage3];
    const originalStates = stages.map(s => s.classList.contains('hidden'));
    
    // Show all stages
    stages.forEach(s => s.classList.remove('hidden'));
    
    // Measure the box height with each stage individually
    let maxHeight = 0;
    stages.forEach((s, i) => {
      // Hide all others
      stages.forEach((other, j) => {
        if (j !== i) other.style.display = 'none';
      });
      const h = formBox.scrollHeight;
      if (h > maxHeight) maxHeight = h;
      // Restore display
      stages.forEach((other, j) => {
        if (j !== i) other.style.display = '';
      });
    });
    
    // Restore original hidden states
    stages.forEach((s, i) => {
      if (originalStates[i]) s.classList.add('hidden');
      else s.classList.remove('hidden');
    });
    
    // Apply the max height
    if (maxHeight > 0) {
      formBox.style.minHeight = maxHeight + 'px';
    }
  }
  
  // Lock height on load and resize
  lockFormBoxHeight();
  window.addEventListener('resize', lockFormBoxHeight);
  let selectedProjectType = null;

  // ================= PROJECT TYPE SELECTION =================
  document.querySelectorAll(".project-type-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".project-type-btn").forEach((b) => {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      selectedProjectType = btn.dataset.type;
      document.getElementById("project-type").value = selectedProjectType;
      
      // Auto-advance to Step 2
      stage1.classList.add("hidden");
      stage2.classList.remove("hidden");
      updateProgressIndicator(2);
    });
  });

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

  // ================= SCROLL TO TOP ON STEP CHANGE (Optional Helper) =================
  // Removing old Step 1 -> Step 2 button handler since it's now automatic

  // ================= STAGE 2 → STAGE 3 =================
  document.getElementById("step2-next").addEventListener("click", (e) => {
    e.preventDefault();
    const { first_name, last_name, email, phone } = form.elements;

    if (!first_name.value.trim() || !last_name.value.trim() || !email.value.trim() || !phone.value.trim()) {
      Swal.fire({
        title: "Missing Info 😕",
        text: "Please fill in all required fields.",
        icon: "warning",
        confirmButtonColor: "#eab313"
      });
      return;
    }

    stage2.classList.add("hidden");
    stage3.classList.remove("hidden");
    updateProgressIndicator(3);
  });

  // ================= STAGE 2 BACK =================
  document.getElementById("step2-prev").addEventListener("click", (e) => {
    e.preventDefault();
    stage2.classList.add("hidden");
    stage1.classList.remove("hidden");
    updateProgressIndicator(1);
  });

  // ================= STAGE 3 BACK =================
  document.getElementById("step3-prev").addEventListener("click", (e) => {
    e.preventDefault();
    stage3.classList.add("hidden");
    stage2.classList.remove("hidden");
    updateProgressIndicator(2);
  });

  // ================= SEND EMAIL =================
  async function sendEmail(form) {
    if (form.dataset.sending === "true") return;

    // Validate address before sending
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
      projectType: selectedProjectType,
      fullName: `${fd.get("first_name")} ${fd.get("last_name")}`.trim(),
      email: fd.get("email"),
      phone: fd.get("phone"),
      address: `${fd.get("street_address") || ""}, ${fd.get("city") || ""}, ${fd.get("state") || ""} ${fd.get("zip_code") || ""}`.replace(/\s*,\s*/g, ", ").trim(),
      message: ""
    };

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbwjbLZ4cTlpX3qOVYE3LtI5ZQ1oumDTesh2P4lndD_OEJW0VirgV4uiuSbiKqiC7Aih/exec", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.status === "success") {
        // ================= SUCCESS MODAL WITH PARTY =================
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
            // ================= PARTY.JS CONFETTI ON POPUP =================
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
        selectedProjectType = null;
        document.querySelectorAll(".project-type-btn").forEach((b) => {
          b.classList.remove("active");
        });
        updateProgressIndicator(1);
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      Swal.fire({
        title: "Oops 😬",
        text: err.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#9e0e0e"
      });
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.dataset.sending = "false";
    }
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
