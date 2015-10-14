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

    var $gallery = $('.img-gallery');
    imagesLoaded( $gallery, function() {

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