import React from 'react';

const Wave = ({ className }: { className?: string }) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="1920" height="240" viewBox="0 0 1920 240" fill="none">
  <g filter="url(#filter0_d_280_51)">
    <path d="M-15 79.6045C703.881 269.071 946.206 66.622 1920 79.6045" stroke='var(--background-primary)' strokeWidth="127"/>
  </g>
  <defs>
    <filter id="filter0_d_280_51" x="-46.1836" y="0.501953" width="1982.03" height="238.996" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="7.5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_280_51"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_280_51" result="shape"/>
    </filter>
  </defs>
</svg>
  );
};

export default Wave;