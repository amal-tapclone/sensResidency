function adminLogout() {
  Swal.fire({
    title: "Logout",
    text: "Are you sure you want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, logout",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "logout-popup",
    },
    width: "400px",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/admin/logout",
        method: "get",
        success: (res) => {
          //   location.reload();
          window.location.href = "/admin/login";
        },
      });
    }
  });
}

//clear file input add images
function clearInputFile(str) {
  $(`#${str}`).replaceWith($(`#${str}`).val("").clone(true));
  $(`#${str}Prev`).attr("src", "/images/no-image - Copy.png");
}

function viewImgPreview(event, id) {
  console.log(event.target.files[0], id);
  let image = document.getElementById(id);
  image.src = URL.createObjectURL(event.target.files[0]);
}

function deleteImage(id, no) {
  Swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete Imgage no ${no}`,
    // icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/admin/delete-image/" + id,
        method: "post",
        success: (response) => {
          if (response.success) {
            location.reload();
          }
        },
      });
      // Swal.fire("Deleted!", "success");
    }
  });
}

// add image form

// document.addEventListener("DOMContentLoaded", function () {
//   const addImgForm = document.getElementById("addImage-form");

//   if (addImgForm) {
//     const showLoading = function () {
//       Swal.fire({
//         title: "Uploading Images!",
//         // html: "I will close in <b></b> milliseconds.",
//         html: "<p><i>converting images in to webp format</i></p>",
//         // timer: 5000,
//         timerProgressBar: true,
//         didOpen: () => {
//           Swal.showLoading();
//           const b = Swal.getHtmlContainer().querySelector("b");
//           timerInterval = setInterval(() => {
//             b.textContent = Swal.getTimerLeft();
//           }, 100);
//         },
//         willClose: () => {
//           clearInterval(timerInterval);
//         },
//       });
//     };

//     addImgForm.addEventListener("submit", (event) => {
//       event.preventDefault();
//       showLoading();

//     });
//   }
// });
