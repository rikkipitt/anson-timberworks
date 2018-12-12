$ ->
  $('a[data-modal]').click (e) ->
    e.preventDefault()
    modal = $(this).parents('.grid__box').find '.modal'

    modal.find('.modal__state').trigger 'click'
    return
