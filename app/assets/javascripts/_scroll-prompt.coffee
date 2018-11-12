$ ->
  unless (typeof fullpage_api == "undefined")
    $('.scroll-icon').click ->
      fullpage_api.moveSectionDown()
      return
  return
