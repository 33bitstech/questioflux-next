import React from 'react'

const ArrowSvg = ({color}: {color:string}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6" fill="none">
  <path d="M1 1L5.5 4L10 1" stroke={color} strokeWidth="2" strokeLinecap="round"/>
</svg>
    )
}

export default ArrowSvg