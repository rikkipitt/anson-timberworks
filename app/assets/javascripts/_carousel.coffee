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
