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
    centerMode: true
    slidesToShow: 1
    slidesToScroll: 1
    arrows: false
    fade: true
    asNavFor: '.process-slider--nav'
  $('.process-slider--nav').slick
    centerMode: true
    slidesToShow: 7
    slidesToScroll: 1
    asNavFor: '.process-slider--for'
    focusOnSelect: true
