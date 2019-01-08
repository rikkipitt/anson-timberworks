$(document).ready ->
  $(document).on 'mousedown', '.save-action', (e) ->
    for instance of CKEDITOR.instances
      editor = CKEDITOR.instances[instance]
      if editor.checkDirty()
        editor.updateElement()
    return true
