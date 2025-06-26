import React from 'react';

const MoreIcon = ({ active, theme}: {active: boolean, theme:string | undefined}) => {
 
  return (
    <>
      {theme === 'light' && !active && <svg xmlns="http://www.w3.org/2000/svg" width="5" height="19" viewBox="0 0 5 19" fill="none">
  <circle cx="2.5" cy="2.5" r="2.5" fill="#0A0A0A"/>
  <circle cx="2.5" cy="9.5" r="2.5" fill="#0A0A0A"/>
  <circle cx="2.5" cy="16.5" r="2.5" fill="#0A0A0A"/>
</svg>}
            {theme === 'light' && active && <svg xmlns="http://www.w3.org/2000/svg" width="5" height="19" viewBox="0 0 5 19" fill="none">
  <circle cx="2.5" cy="2.5" r="2.5" fill="url(#paint0_linear_1136_212)"/>
  <circle cx="2.5" cy="9.5" r="2.5" fill="url(#paint1_linear_1136_212)"/>
  <circle cx="2.5" cy="16.5" r="2.5" fill="url(#paint2_linear_1136_212)"/>
  <defs>
    <linearGradient id="paint0_linear_1136_212" x1="2.5" y1="0" x2="2.5" y2="5" gradientUnits="userSpaceOnUse">
      <stop stopColor="#0047FF"/>
      <stop offset="1" stopColor="#00E4FF"/>
    </linearGradient>
    <linearGradient id="paint1_linear_1136_212" x1="2.5" y1="7" x2="2.5" y2="12" gradientUnits="userSpaceOnUse">
      <stop stopColor="#0047FF"/>
      <stop offset="1" stopColor="#00E4FF"/>
    </linearGradient>
    <linearGradient id="paint2_linear_1136_212" x1="2.5" y1="14" x2="2.5" y2="19" gradientUnits="userSpaceOnUse">
      <stop stopColor="#0047FF"/>
      <stop offset="1" stopColor="#00E4FF"/>
    </linearGradient>
  </defs>
</svg>}
            {theme === 'dark' && !active && <svg xmlns="http://www.w3.org/2000/svg" width="5" height="19" viewBox="0 0 5 19" fill="none">
  <circle cx="2.5" cy="2.5" r="2.5" fill="white"/>
  <circle cx="2.5" cy="9.5" r="2.5" fill="white"/>
  <circle cx="2.5" cy="16.5" r="2.5" fill="white"/>
</svg>}
            {theme === 'dark' && active && <svg xmlns="http://www.w3.org/2000/svg" width="5" height="19" viewBox="0 0 5 19" fill="none">
  <circle cx="2.5" cy="2.5" r="2.5" fill="url(#paint0_linear_1136_212)"/>
  <circle cx="2.5" cy="9.5" r="2.5" fill="url(#paint1_linear_1136_212)"/>
  <circle cx="2.5" cy="16.5" r="2.5" fill="url(#paint2_linear_1136_212)"/>
  <defs>
    <linearGradient id="paint0_linear_1136_212" x1="2.5" y1="0" x2="2.5" y2="5" gradientUnits="userSpaceOnUse">
      <stop stopColor="#0047FF"/>
      <stop offset="1" stopColor="#00E4FF"/>
    </linearGradient>
    <linearGradient id="paint1_linear_1136_212" x1="2.5" y1="7" x2="2.5" y2="12" gradientUnits="userSpaceOnUse">
      <stop stopColor="#0047FF"/>
      <stop offset="1" stopColor="#00E4FF"/>
    </linearGradient>
    <linearGradient id="paint2_linear_1136_212" x1="2.5" y1="14" x2="2.5" y2="19" gradientUnits="userSpaceOnUse">
      <stop stopColor="#0047FF"/>
      <stop offset="1" stopColor="#00E4FF"/>
    </linearGradient>
  </defs>
</svg>}
    </>
  );
};

export default MoreIcon;