// <--------------Inputs---------------------->
const userName = document.getElementById(`user-name`);
const userAge = document.getElementById(`user-age`);
const userEmail = document.getElementById(`user-email`);
const userpassword = document.getElementById(`user-password`);
// <--------------Inputs---------------------->

// <---------------BTNS------------>
const deleteBtn = document.getElementById(`delete-account`);
const verifyBtn = document.getElementById(`verify`);
const logoutBtn = document.getElementById(`logout`);
const changePassword = document.getElementById(`change-password-btn`);
// <---------------BTNS------------>

const passwordContainer = document.getElementById(`password-container`);
const verifyContainer = document.getElementById(`verify-container`);
const verifyMessage = document.getElementById(`verify-message`);
const verifyIcon = document.getElementById(`icon`);
const userInfo = JSON.parse(localStorage.getItem("temp"));

console.log(userInfo);
userName.textContent = `${userInfo.firstName}`;
userAge.textContent = `${userInfo.age}`;
userEmail.textContent = `${userInfo.email}`;

//  <---------------------BTN-Hendeler---------------------------->

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = `../index.html`;
});

verifyBtn.addEventListener("click", async () => {
  try {
    let temp = JSON.parse(localStorage.getItem(`temp`));
    const response = await fetch(
      "https://api.everrest.educata.dev/auth/verify_email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${JSON.stringify(localStorage.getItem(`accessToken`))}`,
        },
        body: JSON.stringify({
          email: `${temp.email}`,
        }),
      },
    );
    console.log(temp.email);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Error:", error);
  }
});
let temp = JSON.parse(localStorage.getItem("temp"));

if (temp.verified) {
  verifyMessage.textContent = `არის ვერიფიცირებული`;
  verifyIcon.classList.remove("fa-solid", "fa-x");
  verifyIcon.classList.add("fa-solid", "fa-check");
  verifyIcon.style.color = `green`;
  verifyBtn.disabled = `true`;
} else {
  verifyMessage.textContent = `არ არის ვერიფიცირებული`;
  verifyIcon.classList.remove("fa-solid", "fa-check");
  verifyIcon.classList.add("fa-solid", "fa-x");
  verifyIcon.style.color = `red`;
  // verifyBtn.disabled = `false`;
}

deleteBtn.addEventListener("click", async () => {
  const result = await Swal.fire({
    title: "დარწმუნებილი ხართ რომ გსურთ ანგარიშის გაუქმება?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "წაშლა",
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(
        "https://api.everrest.educata.dev/auth/delete",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("ანგარიშის გაუქმება უარყოფილია");
      }

      await Swal.fire({
        title: "წაშლილია",
        text: "თქვენი ანგარიშ გაუქმებილია",
        icon: "success",
      });

      localStorage.clear();
      window.location.href = "../index.html";
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Something went wrong.",
        icon: "error",
      });

      console.log(error);
    }
  }
});
console.log(changePassword);
// ------------------ Click handler ------------------
changePassword.addEventListener("click", async () => {
  const oldPasswordInput = document.getElementById("old-password");
  const newPasswordInput = document.getElementById("new-password");

  if (changePassword.textContent === "Save") {
    const oldPwd = oldPasswordInput.value.trim();
    const newPwd = newPasswordInput.value.trim();

    if (!oldPwd || !newPwd) {
      Swal.fire({
        text: "გთხოვთ შეავსეთ ორივე ველი",
        icon: "warning",
      });
      passwordContainer.style.display = `none`;
      changePassword.textContent = `Change`;
      return;
    }

    const success = await passwordChange(oldPwd, newPwd);

    if (success) {
      Swal.fire({
        text: "პაროლი შეიცვალა წარმატებით",
        icon: "success",
      });
      oldPasswordInput.value = "";
      newPasswordInput.value = "";
    } else {
      Swal.fire({
        text: "პაროლი შეიცვალა ვერ მოხერხდა",
        icon: "error",
      });
    }

    passwordContainer.style.display = "none";
    changePassword.textContent = "Change";
  } else if (changePassword.textContent === "Change") {
    passwordContainer.style.display = "flex";
    changePassword.textContent = "Save";
  }
});

// ------------------ Fixed passwordChange function ------------------
async function passwordChange(oldPassword, newPassword) {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("No access token found – user not logged in?");
      return false;
    }

    const response = await fetch(
      "https://api.everrest.educata.dev/auth/change_password",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      },
    );

    if (!response.ok) {
      let errorMsg = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg += ` → ${errorData.message || errorData.error || "no details"}`;
      } catch {}
      console.error(errorMsg);
      return false;
    }

    console.log("Password changed OK");
    return true;
  } catch (err) {
    console.error("Network / fetch error:", err.message);
    return false;
  }
}
