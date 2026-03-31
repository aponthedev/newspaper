'use strict';
(function ($) {
    /* ==================== Ready Function Start ========================== */
    $(document).ready(function () {
        /* ==================== Header Navbar Collapse JS Start ===================== */
        function hideNavbarCollapse() {
            new bootstrap.Collapse($('.navbar-collapse')[0]).hide();
            $('.navbar-collapse').trigger('hide.bs.collapse');
        }

        $('.navbar-collapse').on({
            'show.bs.collapse': function () {
                $('body').addClass('scroll-hide');
                $('.body-overlay').addClass('show').on('click', hideNavbarCollapse);
            },
            'hide.bs.collapse': function () {
                $('body').removeClass('scroll-hide');
                $('.body-overlay').removeClass('show').unbind('click', hideNavbarCollapse);
            },
        });
        /* ==================== Header Navbar Collapse JS End ======================= */

       

        /* ==================== Offcanvas Sidebar JS Start ======================== */
        $('[data-toggle="offcanvas-sidebar"]').each(function (index, toggler) {
            let id = $(toggler).data('target');
            let sidebar = $(id);
            let sidebarClose = sidebar.find('.btn--close');
            let sidebarOverlay = $('.sidebar-overlay');

            let hideSidebar = function () {
                sidebar.removeClass('show');
                sidebarOverlay.removeClass('show');
                $(toggler).removeClass('active');
                $('body').removeClass('scroll-hide');
                $(document).unbind('keydown', EscSidbear);
            }

            let EscSidbear = function (e) {
                if (e.keyCode === 27) {
                    hideSidebar();
                }
            }

            let showSidebar = function () {
                $(toggler).addClass('active');
                sidebar.addClass('show');
                sidebarOverlay.addClass('show');
                $('body').addClass('scroll-hide');
                $(document).on('keydown', EscSidbear);
            }

            $(toggler).on('click', showSidebar);
            $(sidebarOverlay).on('click', hideSidebar);
            $(sidebarClose).on('click', hideSidebar);
        });

        $('.dashboard-sidebar__body').on('scroll', function () {
            if ($(this).scrollTop() > 0) {
                $(this).addClass('scrolling');
            } else {
                $(this).removeClass('scrolling');
            }
        });
        /* ==================== Offcanvas Sidebar JS End ========================== */

        // editorial__ start
$('.editorial__slider').slick({
  dots: false, // ❌ remove pagination
  infinite: false,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 1,

  prevArrow: `<button class="slick-prev custom-arrow">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 33 32" fill="none">
  <g stroke="currentColor" stroke-width="2.5" fill="none">
    <circle cx="16.913" cy="16" r="14.498"></circle>
    <path d="M22.212 16h-13M14.277 11.136 9.413 16l4.864 4.864"></path>
  </g>
</svg>
  </button>`,

  nextArrow: `<button class="slick-next custom-arrow">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" x="0" y="0" viewBox="0 0 33 32" style="enable-background:new 0 0 512 512" xml:space="preserve" fill-rule="evenodd" class=""><g><g fill="none"><path d="M.913 0h32v32h-32z" fill="" opacity="1"></path><g stroke="currentColor" stroke-width="2.5"><circle cx="16.913" cy="16" r="14.498" fill="" opacity="1"></circle><path d="M9.614 16h13M18.549 20.864 23.413 16l-4.864-4.864" fill="" opacity="1"></path></g></g></g></svg>
  </button>`,

  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true
        
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});
        // editorial__ ends

        /*===================== Dynamically Add Active Class JS Start ============================== */
        function dynamicActiveMenuClass(selector) {
            let fileName = window.location.pathname.split('/').reverse()[0];

            selector.find('li').each(function () {
                let anchor = $(this).find('a');
                if ($(anchor).attr('href') == fileName) {
                    $(this).addClass('active');
                }
            });

            // if any li has active element add class
            selector.children('li').each(function () {
                if ($(this).find('.active').length) {
                    $(this).addClass('active');
                }

                //if any li.active has bootstrap's collapse component open it  
                if ($(this).hasClass('active')) {
                    $(this).find('.collapse').addClass('show');
                    $(this).find('[data-bs-toggle="collapse"]').removeClass('collapsed');
                    $(this).find('[data-bs-toggle="collapse"]').attr('aria-expanded', 'false');
                }
            });

            // if no file name return
            if (fileName == '') {
                selector.find('li').eq(0).addClass('active');
            }
        }
        // dynamicActiveMenuClass($('.header .nav-menu'));
        dynamicActiveMenuClass($('.dashboard-sidebar-menu'));
        /*===================== Dynamically Add Active Class JS End ================================ */

        /* ==================== Dynamically Add BG Image JS Start ====================== */
        $('.bg-img').css('background-image', function () {
            return `url(${$(this).data('background-image')})`;
        });
        /* ==================== Dynamically Add BG Image JS End ========================= */

        /* ==================== Dynamically Add Mask Image JS Start ====================== */
        $('.mask-img').css('mask-image', function () {
            return `url(${$(this).data('mask-image')})`;
        });
        /* ==================== Dynamically Add Mask Image JS End ======================== */

        /* ==================== Add A Class In Select Input JS Start ===================== */
        $('.form-select.form--select').each((index, select) => {
            if ($(select).val()) {
                $(select).addClass('selected');
            }

            $(select).on('change', function () {
                if ($(this).val()) {
                    $(this).addClass('selected')
                } else {
                    $(this).removeClass('selected')
                }
            });
        });
        /* ==================== Add A Class In Select Input JS End ======================== */

        /* ==================== Select2 Initialization JS Start ==================== */
        $('.select2').each((index, select) => {
            $(select).wrap('<div class="select2-wrapper"></div>').select2({
                dropdownParent: $(select).closest('.select2-wrapper')
            });
        });
        /* ==================== Select2 Initialization JS End ==================== */

        /* ==================== Lifestyle Tabs JS Start ==================== */
        $('.lifestyle-tabs').each(function (index, tabs) {
            let tabWrapper = $(tabs);
            let buttons = tabWrapper.find('.lifestyle-tabs__btn');
            let sidebar = tabWrapper.closest('.lifestyle-sidebar');
            let lists = sidebar.find('.lifestyle-sidebar__list');

            function activateTab(target) {
                buttons.removeClass('is-active').attr('aria-selected', 'false');
                buttons
                    .filter(`[data-tab-target="${target}"]`)
                    .addClass('is-active')
                    .attr('aria-selected', 'true');

                lists.removeClass('is-active').attr('aria-hidden', 'true');
                lists
                    .filter(`[data-tab="${target}"]`)
                    .addClass('is-active')
                    .attr('aria-hidden', 'false');
            }

            let initialTarget =
                buttons.filter('.is-active').data('tab-target') ||
                buttons.first().data('tab-target');

            if (initialTarget) {
                activateTab(initialTarget);
            }

            buttons.on('click', function () {
                activateTab($(this).data('tab-target'));
            });
        });
        /* ==================== Lifestyle Tabs JS End ==================== */

        /* ==================== Slick Slider Initialization JS Start ==================== */
        const sliderConfig = {
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 2000,
            speed: 1500,
            dots: true,
            pauseOnHover: true,
            arrows: false,
            prevArrow:
                '<button type="button" class="slick-prev"><i class="fas fa-long-arrow-alt-left"></i></button>',
            nextArrow:
                '<button type="button" class="slick-next"><i class="fas fa-long-arrow-alt-right"></i></button>',
        };

        $('.testimonial-slider').slick({
            ...sliderConfig,
            slidesToShow: 3,
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        arrows: false,
                        slidesToShow: 2,
                        dots: true,
                    },
                },
                {
                    breakpoint: 991,
                    settings: {
                        arrows: false,
                        slidesToShow: 2,
                    },
                },
                {
                    breakpoint: 464,
                    settings: {
                        arrows: false,
                        slidesToShow: 1,
                    },
                },
            ],
        });
        /* ==================== Slick Slider Initialization JS End ====================== */

        /* ==================== Password Toggle JS Start ================================ */
        $('.input--group-password').each(function (index, inputGroup) {
            let inputGroupBtn = $(inputGroup).find('.input-group-btn');
            let formControl = $(inputGroup).find('.form-control.form--control');

            inputGroupBtn.on('click', function () {
                if (formControl.attr('type') === 'password') {
                    formControl.attr('type', 'text');
                    $(this).find('i').removeClass('fa-eye-slash').addClass('fa-eye');
                } else {
                    formControl.attr('type', 'password');
                    $(this).find('i').removeClass('fa-eye').addClass('fa-eye-slash');
                }
            });
        });
        /* ==================== Password Toggle JS End ================================== */

        /* ==================== Input Group Copy JS Start =============================== */
        $('.input--group-copy').each((index, element) => {
            let copyBtn = $(element).find('.copy-btn');
            let copyInput = $(element).find('.copy-input');

            copyBtn.on('click', function () {
                // Select the text field
                copyInput.select()
                copyInput[0].setSelectionRange(0, 99999); // For mobile devices

                // Copy the text inside the text field
                if (navigator.clipboard.writeText(copyInput.val())) {
                    $(this).addClass('copied');

                    let timer = setTimeout(() => {
                        $(this).removeClass('copied');
                        clearTimeout(timer);
                    }, 1000);
                }
            });

        });
        /* ==================== Input Group Copy JS End ================================= */

        /* ==================== Dashboard Collapse JS Start ==================== */
        $('.dashboard-collapse').on({
            'show.bs.collapse': function (e) {
                $('.dashboard-collapse').each((index, collapse) => {
                    if (e.target != collapse && $(collapse).hasClass('show')) {
                        new bootstrap.Collapse(collapse).hide();
                    }
                });
            }
        })
        /* ==================== Dashboard Collapse JS End ====================== */
    });
    /* ==================== Ready Function End ============================ */

    /* ==================== Header Fixed JS Start ========================= */
    $(window).on('scroll', function () {
        if ($(window).scrollTop() >= 300) {
            $('.header').addClass('fixed-header');
        } else {
            $('.header').removeClass('fixed-header');
        }
    });
    /* ==================== Header Fixed JS End ============================= */

    /* ==================== Scroll To Top Button JS Start ==================== */
    let scrollTopBtn = $('.scroll-top');

    if (scrollTopBtn.length) {
        let progressPath = scrollTopBtn.find('.scroll-top-progress path');
        let pathLength = progressPath[0].getTotalLength();
        let offset = 250;
        let duration = 550;

        progressPath.css({
            transition: 'none',
            WebkitTransition: 'none',
            strokeDasharray: `${pathLength} ${pathLength}`,
            strokeDashoffset: pathLength,
            transition: 'stroke-dashoffset 10ms linear',
            WebkitTransition: 'stroke-dashoffset 10ms linear',
        });

        function updateProgress() {
            let scroll = $(window).scrollTop();
            let height = $(document).height() - $(window).height();
            let progress = pathLength - (scroll * pathLength / height);
            progressPath.css('strokeDashoffset', progress)
        }

        updateProgress();

        $(window).on('scroll', function () {
            updateProgress();
            if ($(this).scrollTop() > offset) {
                scrollTopBtn.addClass('active');
            } else {
                scrollTopBtn.removeClass('active');
            }
        });

        scrollTopBtn.on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, duration);
            return false;
        });
    }

    // Disabled scroll top for account pages
    if ($(scrollTopBtn).next(':is(.page-wrapper)').find('.account').length) {
        $(scrollTopBtn).hide();
    }
    /* ==================== Scroll To Top Button JS End ==================== */

    /* ==================== Preloader JS Start ============================== */
    $(window).on('load', () => $('.preloader').fadeOut());
    /* ==================== Preloader JS End ================================ */

})(jQuery);








