import React, { useMemo, useState } from 'react'
import colorString from 'color-string'
import { css } from 'emotion'

export interface IColorProps {
  color: string;
  label?: string;

  className?: string;
  style?: React.CSSProperties;
}

const Color: React.FunctionComponent<IColorProps> = props => {
  const { color, style, className = '', label = '' } = props
  const [copied, setCopied] = useState('')
  const [rgb, hex, fontColor] = useMemo(() => {
    const desc = colorString.get(color)
    const value = desc && desc.value || [255, 255, 255, 1]
    const isLight = (0.213 * value[0] + 0.715 * value[1] + 0.072 * value[2]) * value[3] > 255 / 2
    const fontColor = isLight ? '#000' : '#FFF'
    return [
      colorString.to.rgb(value),
      colorString.to.hex(value),
      fontColor,
    ]
  }, [color])

  const handleMouseOut = () => {
    setCopied('')
  }

  const handleCopy = (type: 'rgb' | 'hex') => () => {
    const target = type === 'rgb' ? rgb : hex
    navigator.clipboard.writeText(target)
      .then(() => {
        setCopied(type)
      })
      .catch(console.error)
  }

  return (
    <div
      style={style}
      onMouseOut={handleMouseOut}
      className={[wrapper, className].join(' ')}
    >
      <main
        className={placeholder}
        style={{ background: rgb, color: fontColor }}
      >
        { label ? label : hex }
      </main>
      <section style={{ background: rgb, color: fontColor }} className={[popWrapper, 'visible'].join(' ')}>
        <div onClick={handleCopy('rgb')}>{copied === 'rgb' ? 'copied' : rgb}</div>
        <div onClick={handleCopy('hex')}>{copied === 'hex' ? 'copied' : hex}</div>
      </section>
    </div>
  )
}

const popWrapper = css`
  position: absolute;
  top: 24px;
  left: 0;
  width: 100%;
  transition: all ease-out .2s;
  font-size: 12px;
  padding: 3px 5px;
  box-sizing: border-box;
  z-index: 1;
  div {
    cursor: pointer;
  }
`

const placeholder = css`
  height: 24px;
  padding: 3px 5px;
  text-align: center;
`

const wrapper = css`
  position: relative;
  font-size: 16px;
  height: 24px;
  line-height: 24px;
  .visible {
    visibility: hidden;
    opacity: 0;
    transform: translateY(-10px);
  }
  :hover {
    .visible {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export default Color