$(document).ready(function () {
  $(window).scroll(function () {
    // sticky navbar on scroll script
    if (this.scrollY > 20) {
      $(".navbar").addClass("sticky");
    } else {
      $(".navbar").removeClass("sticky");
    }

    // scroll-up button show/hide script
    if (this.scrollY > 500) {
      $(".scroll-up-btn").addClass("show");
    } else {
      $(".scroll-up-btn").removeClass("show");
    }
  });

  // slide-up script
  $(".scroll-up-btn").click(function () {
    $("html").animate({ scrollTop: 0 });
    // removing smooth scroll on slide-up button click
    $("html").css("scrollBehavior", "auto");
  });

  $(".navbar .menu li a").click(function () {
    // applying again smooth scroll on menu items click
    $("html").css("scrollBehavior", "smooth");
  });

  // toggle menu/navbar script
  $(".menu-btn").click(function () {
    $(".navbar .menu").toggleClass("active");
    $(".menu-btn i").toggleClass("active");
  });

  // typing text animation script
  var typed = new Typed(".typing", {
    strings: ["Student", "Developer", "Blogger", "Youtuber", "Freelancer"],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true,
  });

  var typed = new Typed(".typing-2", {
    strings: ["Student", "Developer", "Blogger", "Youtuber", "Freelancer"],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true,
  });

  // owl carousel script
  $(".carousel").owlCarousel({
    margin: 20,
    loop: true,
    autoplayTimeOut: 2000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
        nav: false,
      },
      600: {
        items: 2,
        nav: false,
      },
      1000: {
        items: 3,
        nav: false,
      },
    },
  });

  // Custom Contact Form JS
  function getElement(id) {
    return document.getElementById(id).value;
  }

  document
    .getElementById("contact-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      var name = getElement("name");
      var email = getElement("email");
      var subject = getElement("subject");
      var message = getElement("message");

      fetch("/api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      })
        .then((res) => res.json())
        .then((data) => {
          document.getElementById("contact-form").reset();
          $("#infoMessage").addClass("block bg-success").text(data?.message);

          setTimeout(function () {
            $("#infoMessage").removeClass("block bg-success");
          }, 5000);
        })
        .catch((error) => {
          document.getElementById("contact-form").reset();
          $("#infoMessage").addClass("block bg-danger").text(data?.message);

          setTimeout(function () {
            $("#infoMessage").removeClass("block bg-danger");
          }, 5000);
        });
    });
});
