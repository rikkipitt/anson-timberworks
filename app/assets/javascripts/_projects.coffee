$ ->
  $('a[data-slide]').click (e) ->
    e.preventDefault()
    slide = $(this).data 'slide'
    modal = $(this).parents('.section').find '.modal'
    carousel = modal.find '.split-carousel'

    console.log modal

    carousel.slick 'slickGoTo', slide, true
    modal.find('.modal__state').trigger 'click'
    return
