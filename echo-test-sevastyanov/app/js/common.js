$( document ).ready(function() {
    // validation
    $('#form').validate({
        rules: {
            email: {
                required: true,
                email: true
            },
        },
        messages: {
            email: "Please enter a valid email address!"
        },
        submitHandler: function(form) {
            // ajax and reset
            $(form)[0].reset();
            $.ajax({
                url: form.action,
                type: form.method,
                data: $(form).serialize(),
                success: function(response) { alert('Thanks, message was sent!'); },
                error: function(err) { console.log('Message was not sent!'); }
            });
        }
    });

    // init slider
    var swiper = new Swiper('.swiper-container', {
        speed: 700,
        loop: true,
        slidesPerView: 3,
        parallax: true,
        simulateTouch:false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            767: {
                slidesPerView: 2,
            },
            575:{
                slidesPerView: 1
            }
        }
    });
});




