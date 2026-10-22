import React from 'react';

// Prancheta com um "certo": ícone da prova online
const ExamSvg = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="31"
      height="30"
      viewBox="0 0 31 30"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 4.5H23.5C25.157 4.5 26.5 5.843 26.5 7.5V27C26.5 28.657 25.157 30 23.5 30H7.5C5.843 30 4.5 28.657 4.5 27V7.5C4.5 5.843 5.843 4.5 7.5 4.5ZM9.3 17.6L11.5 15.4L14.3 18.2L20.7 11.8L22.9 14L14.3 22.6Z"
        fill="var(--primary-icon-color)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 0.5H18.5C19.605 0.5 20.5 1.395 20.5 2.5V6C20.5 7.105 19.605 8 18.5 8H12.5C11.395 8 10.5 7.105 10.5 6V2.5C10.5 1.395 11.395 0.5 12.5 0.5ZM13 2.5V4.5H18V2.5Z"
        fill="var(--primary-icon-color)"
      />
    </svg>
  );
};

export default ExamSvg;
