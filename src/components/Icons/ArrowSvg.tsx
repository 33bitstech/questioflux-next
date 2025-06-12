import React from 'react';

// Removemos a prop 'color' e adicionamos 'className' para flexibilidade.
const ArrowSvg = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="6"
      viewBox="0 0 11 6"
      fill="none"
    >
      <path
        d="M1 1L5.5 4L10 1"
        // O 'stroke' agora é controlado pela nossa variável CSS.
        stroke="var(--text-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ArrowSvg;