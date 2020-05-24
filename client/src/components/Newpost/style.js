import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const Caption = styled.textarea`
  outline: none;
  border: none;
  resize: none;
  font-size: 0.9em;
  letter-spacing: 0.02em;
  font-family: 'Roboto', sans-serif;
`

export const PreviewCont = styled.section`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: 450px) {
    margin-bottom: 10px;
  }
`

export const ImgContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 10px 10px 0;
  overflow: hidden;
  @media (max-width: 450px) {
    width: 46%;
    margin: 5px;
  }
`

export const Img = styled.img`
  width: 100%;
  object-fit: cover;
`

export const Icon = styled(FontAwesomeIcon)`
  font-size: ${(props) => props.fontSize};
  color: #fff;
  position: absolute;
  top: 5px;
  right: 5px;
  margin: 0;
  cursor: pointer;
`
export const P = styled.p`
  font-size: 0.8rem;
  letter-spacing: 0.01em;
  font-weight: bold;
  color: #333;
  margin-bottom: 1em;
  margin-left: 0.2em;
`
