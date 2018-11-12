$(window).on 'load resize', (e) ->
  more = document.getElementById('js-more')
  if $(more).length > 0
    windowWidth = $(window).width()
    moreLeftSideToPageLeftSide = $(more).offset().left
    moreLeftSideToPageRightSide = windowWidth - moreLeftSideToPageLeftSide
    if moreLeftSideToPageRightSide < 330
      $('#js-more .submenu .submenu').removeClass 'fly-out-right'
      $('#js-more .submenu .submenu').addClass 'fly-out-left'
    if moreLeftSideToPageRightSide > 330
      $('#js-more .submenu .submenu').removeClass 'fly-out-left'
      $('#js-more .submenu .submenu').addClass 'fly-out-right'
  menuToggle = $('#js-navigation-mobile-menu').unbind()
  $('#js-navigation-menu').removeClass 'show'
  menuToggle.on 'click', (e) ->
    e.preventDefault()
    $('#js-navigation-menu').slideToggle ->
      if $('#js-navigation-menu').is(':hidden')
        $('#js-navigation-menu').removeAttr 'style'
      return
    return
  return
