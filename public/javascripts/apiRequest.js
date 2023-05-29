document.addEventListener("DOMContentLoaded", function () {
  var mySwiper = new Swiper(".swiper-container", {
    loop: true,
    spaceBetween: 50,
    speed: 1000,
    effect: "cards",
    // cards cube flip
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    on: {
      init: function () {
        // Trigger animation on the initial slide
        var initialSlide = this.slides[this.activeIndex];
        animateSlideContent(initialSlide);

        // // Trigger animation on the next slide
        // var nextSlideIndex = this.activeIndex === this.slides.length - 1 ? 0 : this.activeIndex + 1;
        // var nextSlide = this.slides[nextSlideIndex];
        // animateSlideContent(nextSlide);
      },
      slideChange: function () {
        // Reset animation on the previous slide
        var previousSlide = this.slides[this.previousIndex];
        resetSlideContent(previousSlide);
        // Trigger animation on the active slide
        var activeSlide = this.slides[this.activeIndex];
        animateSlideContent(activeSlide);
      },
    },
  });

  function animateSlideContent(slide) {
    var slideContent = slide.querySelector(".slide-content");
    slideContent.classList.add("slide-content-animate");
  }

  function resetSlideContent(slide) {
    var slideContent = slide.querySelector(".slide-content");
    slideContent.classList.remove("slide-content-animate");
  }
});

const resultDiv = document.querySelector("#message");

document.addEventListener("DOMContentLoaded", function () {
  const reservation = document.querySelector("#reservation");

  if (reservation) {
    reservation.addEventListener("submit", (event) => {
      const name = reservation.getElementsByTagName("input")[0].value;
      const email = reservation.getElementsByTagName("input")[1].value;
      const phone = reservation.getElementsByTagName("input")[2].value;
      const arrivalDate = reservation.getElementsByTagName("input")[3].value;
      const departureDate = reservation.getElementsByTagName("input")[4].value;
      const adultsNo = reservation.getElementsByTagName("select")[0].value;
      const childNo = reservation.getElementsByTagName("select")[1].value;

      event.preventDefault();
      if (checkAllFields() && validatePhone() && validateEmail()) {
        sendEmail(
          name,
          email,
          phone,
          arrivalDate,
          departureDate,
          adultsNo,
          childNo
        );
      }

      function checkAllFields() {
        if (
          name == "" ||
          email == "" ||
          arrivalDate == "" ||
          departureDate == "" ||
          phone == ""
        ) {
          resultDiv.classList.add("error");
          resultDiv.innerHTML = "Please fill all the fields";
          return false;
        }
        return true;
      }

      function validatePhone() {
        const phoneValue = phone.trim();
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneValue)) {
          resultDiv.classList.add("error");
          resultDiv.textContent = "Phone number should be 10 digits";
          return false;
        } else {
          resultDiv.classList.remove("error");
          resultDiv.textContent = "";
          return true;
        }
      }

      function validateEmail() {
        const emailValue = email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
          resultDiv.classList.add("error");
          resultDiv.textContent = "Invalid email address";
          return false;
        } else {
          resultDiv.classList.remove("error");
          resultDiv.textContent = "";
          return true;
        }
      }
    });
  }
});

function sendEmail(
  name,
  email,
  phone,
  arrivalDate,
  departureDate,
  adultsNo,
  childNo
) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      arrivalDate,
      departureDate,
      adultsNo,
      childNo,
    }),
  };

  Swal.fire({
    position: "center",
    icon: "success",
    title: "Thank you for filling out your information!",
    showConfirmButton: false,
    timer: 1900,
  });
  resultDiv.innerHTML = "Please... wait";
  return fetch("/reservation-form", options).then((res) => {
    if (res.status === 200) {
      resultDiv.innerHTML = "Thanks,.. You will recieve confirmation shortly";
      reservation.reset();
      return;
    }
    resultDiv.classList.add("error");
    resultDiv.innerHTML = "oops, something went wrong";
  });
}
