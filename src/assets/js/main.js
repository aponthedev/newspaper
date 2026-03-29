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

        /* ==================== Header Nav Scroll (8 Items) JS Start ===================== */
        function initHeaderNavScroll() {
            // 1) Find the nav scroll wrapper (if not found, just exit)
            const $wraps = $('.nav-scroll');
            if (!$wraps.length) return;

            $wraps.each(function () {
                // 2) Cache the important elements
                const $wrap = $(this);
                const $track = $wrap.find('.nav-scroll__track');
                const $menu = $wrap.find('.nav-menu');
                const $items = $menu.find('.nav-item');
                const $btnPrev = $wrap.find('.nav-scroll__btn--left');
                const $btnNext = $wrap.find('.nav-scroll__btn--right');

                // 3) We want exactly 7 items visible on desktop
                const visibleCount = 7;

                // 4) Helper to detect desktop only (we do nothing on mobile)
                const isDesktop = () => window.matchMedia('(min-width: 992px)').matches;

                // 5) Set each item width so 7 items + gap fit inside the track
                const setItemWidth = () => {
                    if (!isDesktop()) {
                        $items.css('flex', '');
                        $btnPrev.addClass('is-hidden');
                        $btnNext.addClass('is-hidden');
                        return;
                    }

                    const trackWidth = $track[0].clientWidth;
                    if (!trackWidth) return;

                    const menuStyle = window.getComputedStyle($menu[0]);
                    const gapValue = parseFloat(menuStyle.columnGap || menuStyle.gap || 0);
                    const totalGap = gapValue * (visibleCount - 1);
                    const itemWidth = Math.floor((trackWidth - totalGap) / visibleCount);
                    $items.css('flex', `0 0 ${itemWidth}px`);
                };

                // 6) Show the arrow only when there is more content to the right
                const updateButton = () => {
                    if (!isDesktop()) return;

                    const el = $track[0];
                    const canScroll = el.scrollWidth > el.clientWidth + 2;
                    const atStart = el.scrollLeft <= 2;
                    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;

                    if (canScroll && !atStart) {
                        $btnPrev.removeClass('is-hidden');
                    } else {
                        $btnPrev.addClass('is-hidden');
                    }

                    if (canScroll && !atEnd) {
                        $btnNext.removeClass('is-hidden');
                    } else {
                        $btnNext.addClass('is-hidden');
                    }
                };

                // 7) Scroll by one item width on each click
                const scrollNext = () => {
                    const el = $track[0];
                    const firstItem = $items[0];
                    const menuStyle = window.getComputedStyle($menu[0]);
                    const gapValue = parseFloat(menuStyle.columnGap || menuStyle.gap || 0);
                    const step = firstItem ? firstItem.getBoundingClientRect().width + gapValue : 120;

                    el.scrollBy({ left: step, behavior: 'smooth' });
                };

                const scrollPrev = () => {
                    const el = $track[0];
                    const firstItem = $items[0];
                    const menuStyle = window.getComputedStyle($menu[0]);
                    const gapValue = parseFloat(menuStyle.columnGap || menuStyle.gap || 0);
                    const step = firstItem ? firstItem.getBoundingClientRect().width + gapValue : 120;

                    el.scrollBy({ left: -step, behavior: 'smooth' });
                };

                // 8) Small helper to re-check after layout/Font load
                const refresh = () => {
                    setItemWidth();
                    updateButton();
                };

                // 9) Bind events
                $btnNext.on('click', scrollNext);
                $btnPrev.on('click', scrollPrev);
                $track.on('scroll', updateButton);
                $(window).on('resize', function () {
                    refresh();
                });
                $(window).on('load', function () {
                    // After fonts/images load, widths can change
                    refresh();
                });

                // 10) Initial run (also re-check after a tiny delay)
                refresh();
                setTimeout(refresh, 100);
            });
        }

        initHeaderNavScroll();
        /* ==================== Header Nav Scroll (8 Items) JS End ======================= */

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








