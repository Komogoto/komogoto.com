/*
-------------------------------------------------------------------------
* Template Name    : Lawind - Responsive One Page Tailwind Css Template * 
* Author           : ThemesBoss                                         *
* Version          : 1.0.0                                              *
* Created          : February 2023                                      * 
* File Description : Main JS file of the template                       *
*------------------------------------------------------------------------
*/
// Service Page - Partner Slider
var swiper = new Swiper(".partner-slider", {
    loop: true,
    slidesPerView: "auto",
    speed: 5000,
    spaceBetween: 30,
    shortSwipes: false,
    longSwipes: false,
    freeMode: true,
    autoplay: {
        delay: 1,
        disableOnInteraction: false,
    },
    breakpoints: {
        320: {
            slidesPerView: 0.7,
        },
        520: {
            slidesPerView: 1.1,
        },
        800: {
            slidesPerView: 1.5,
        },
        1100: {
            slidesPerView: 2,
        },
        1250: {
            slidesPerView: 2.2,
        },
        1450: {
            slidesPerView: 2.5,
        },
        1800: {
            slidesPerView: 3.2,
        },
        2560: {
            slidesPerView: 4.2,
        },
    },
});

// Client Slider
var swiper = new Swiper(".client-slider", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 24,
    delay: 3000,
    autoHeight: true,
    pagination: {
        el: ".client-slider-pagination",
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});

// Navbar
var navbar = document.querySelector("nav");
const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll(".mobile-nav ul li");
window.onscroll = function () {
    if (window.pageYOffset > 80) {
        navbar.classList.add("stickyadd");
    } else {
        navbar.classList.remove("stickyadd");
    }

    var current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 60) {
            current = section.getAttribute("id");
        }
    });

    navLi.forEach((li) => {
        li.classList.remove("active");
        if (li.classList.contains(current)) {
            li.classList.add("active");
        }
    });
};

// Menu Collepsed
const btn = document.querySelector("button.mobile-menu-button");
const menu = document.querySelector(".mobile-menu");

btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});
