$ ->
  $('#carousel').slick
    autoplay: true
    infinite: false
    slidesToShow: 1
    slidesToScroll: 1
    arrows: false
    dots: true

  $('#carousel .slick-dots li button').html('')

  $('.split-carousel').slick
    autoplay: false
    infinite: true
    slidesToShow: 1
    slidesToScroll: 1
    arrows: true
    dots: false

  # Process carousel

  $('.process-slider--for').slick
    arrows: false
    asNavFor: '.process-slider--nav'
    centerMode: true
    fade: true
    slidesToShow: 1
    slidesToScroll: 1
  $('.process-slider--nav').slick
    asNavFor: '.process-slider--for'
    arrows: true
    centerMode: true
    mobileFirst: true
    slidesToShow: 1
    slidesToScroll: 1
    focusOnSelect: true
    responsive: [
      {
        breakpoint: 599
        settings:
          arrows: true
          slidesToShow: $('.process-slider__nav-item').length
      }
    ]
