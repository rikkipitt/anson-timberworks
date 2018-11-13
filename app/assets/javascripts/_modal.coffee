$ ->
  $('#modal').on 'change', ->
    if $(this).is(':checked')
      $('body').addClass 'modal__open'
    else
      $('body').removeClass 'modal__open'
    return
  $('.modal__overlay, .modal__close').on 'click', ->
    $('.modal__state:checked').prop('checked', false).change()
    return
  $('.modal__inner').on 'click', (e) ->
    e.stopPropagation()
    return
  return
