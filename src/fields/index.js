import React from 'react'

import { TextArea } from 'semantic-ui-react'

import { Editor } from '@tinymce/tinymce-react'

export const RTField = (props)  => {	
  return(
    <Editor
      apikey="fb3pb0ana4mvi60jwhefs3g2u3501d9s915efud2rh6ax2ek"
      init={{
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
            ],
      }}
      initalValue='None'
      value={props.field}
      textareaName={props.field}
      onChange={props.handleEditorChange}
      disabled={props.disabled}
      inline={props.inline}
    />
  )
}

export const Textfield = (props) =>{
  return(
    <TextArea
      autoHeight
      name={props.name}
      value={props.field}
      onChange={props.handleChange}
    />
  )
}

