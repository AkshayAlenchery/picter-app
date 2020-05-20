import styled, { css, keyframes } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Card component styles
 */
const changeColor = keyframes`
  from {background-color: white;}
  to {background-color: #F8DFDA;}
`
export const Card = styled.section`
  background: #fff;
  border: 1px solid #dddfe2;
  border-radius: 3px;
  margin: 0;
  margin-bottom: ${(props) => props.bottom};
  ${(props) =>
    props.animate &&
    css`
      animation: ${changeColor} 1s infinite alternate;
    `};
  ${(props) =>
    props.shadow &&
    css`
      -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 64, 128, 0.15);
      -moz-box-shadow: 0px 0px 10px 0px rgba(0, 64, 128, 0.15);
      box-shadow: 0px 0px 10px 0px rgba(0, 64, 128, 0.15);
    `};
`

export const CardHeader = styled.header`
  background: #f5f6f7;
  border-radius: 3px 3px 0 0;
  padding: 10px;
  margin: 0;
`

export const CardTitle = styled.p`
  margin: 0;
  color: #504f52;
  font-size: 0.9em;
  font-weight: 500;
  letter-spacing: 0.02em;
`

export const CardBody = styled.div`
  padding: 10px;
  margin: 0;
`

/**
 * Font awesome icons
 */
export const Icon = styled(FontAwesomeIcon)`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
  margin: 0;
  ${(props) =>
    props.blend &&
    css`
      mix-blend-mode: difference;
    `}
  ${(props) =>
    props.cursor &&
    css`
      cursor: pointer;
    `}
`

/**
 * Blue Button
 */
export const Btn = styled.button`
  padding: ${(props) => props.padding};
  width: ${(props) => props.width};
  font-size: 0.8em;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #333;
  border-radius: 3px;
  cursor: pointer;
  background: #f5f6f7;
  border: 1px solid #ccd0d5;
  &:disabled {
    background: #eae8ec;
    cursor: default;
  }
  &:hover {
    background: #e7e7e7;
  }
  ${(props) =>
    props.blue &&
    css`
      background: #4168b4;
      border: 1px solid #4168b4;
      color: white;
      &:hover {
        background: #365899;
      }
      &:disabled {
        background: #9db7d2;
        border: 1px solid #9db7d2;
        cursor: default;
      }
    `};
`
