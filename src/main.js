/**
 * File:    main.js
 * Author:  @juancarlosfarah
 * Date:    14/10/15
 */

// This function positions the element in the middle of the browser window.
function addSpace($element) {
    var $windowHeight = $(window).height();
    var $elementHeight = $element.outerHeight();
    var $space = $('#space');

    $space.css({
        'height': ($windowHeight - $elementHeight) / 2 + 'px'
    });
}

$(document).ready(function() {
    addSpace($('#main'));

    // Load images gallery.
    var $grid = $('.grid');
    imagesLoaded($grid, function() {
        // Initialise Masonry
        $grid.masonry({

            // set itemSelector so .grid-sizer is not used in layout
            itemSelector: '.grid-item',
            stamp: '.stamp',

            // use element for option
            columnWidth: '.grid-sizer',
            percentPosition: true
        });

        // Ease in the grid.
        $grid.animate({
            "opacity": 1
        }, "slow");
    });


    // Load projects gallery.
    var $gallery = $('.img-gallery');
    imagesLoaded($gallery, function() {

        // Ease in the grid.
        $gallery.animate({
            "opacity": 1
        }, "slow");

        // Bind event handlers to each grid item.
        $gallery.children('.project').each(function() {
            var $hover = $(this).children('.project-hover');
            $(this).hover(
                function() {
                    $hover.css({
                        visibility: 'visible'
                    });
                },
                function() {
                    $hover.css({
                        visibility: 'hidden'
                    });
                }
            );
            $hover.click(function() {
                window.location = $(this).attr('data-nav');
            });
            $(this).click(function() {
                window.location = $hover.attr('data-nav');
            });
        });
    });

    // Initialise carousel.
    $('.carousel').slick({
        dots: true,
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 3000
    });

});

$(window).resize(function() {
    addSpace($('#main'));
});

function toggleNav() {
    var threshold = $('.project-gallery').height() - $('.navbar').height();
    if ($(window).scrollTop() > threshold) {
        $('.project-nave').finish();
        $('.project-nav').fadeOut();
    } else {
        $('.project-nav').fadeIn();
    }
}

$(window).scroll(_.throttle(toggleNav, 1000));