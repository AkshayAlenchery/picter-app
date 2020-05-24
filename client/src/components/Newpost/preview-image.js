import React from 'react'
import { ImgContainer, Img, Icon } from './style'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const PreviewImage = ({ image, index, removePic }) => {
  return (
    <ImgContainer>
      <Icon icon={faTimesCircle} onClick={() => removePic(index)} />
      <Img src={image} />
    </ImgContainer>
  )
}

export default PreviewImage
