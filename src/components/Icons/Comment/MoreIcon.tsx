// MoreIcon.js
import React from 'react';
import styles from './MoreIcon.module.scss'; // Importe o novo SCSS

// O componente agora só precisa da prop 'active'
const MoreIcon = ({ active }: {active: boolean}) => {
  // A lógica de tema foi removida. O CSS cuida disso.
  // A classe 'active' é adicionada ou removida com base na prop.
  const iconClassName = `${styles.icon} ${active ? styles.active : ''}`;

  return (
    // Um único SVG para todos os estados e temas
    <svg xmlns="http://www.w3.org/2000/svg" width="5" height="19" viewBox="0 0 5 19" className={iconClassName}>
      {/* O <defs> define o gradiente. 
        Ele é referenciado pela variável --icon-gradient no CSS.
      */}
      <defs>
        <linearGradient id="icon-gradient-fill" x1="2.5" y1="0" x2="2.5" y2="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--fixed-blue)" />
          <stop offset="1" stopColor="var(--fixed-cyan)" />
        </linearGradient>
      </defs>
      
      {/* Os círculos não precisam mais de um 'fill' individual. 
        Eles herdarão a cor do <svg> pai, que é controlada pela classe.
      */}
      <circle cx="2.5" cy="2.5" r="2.5" />
      <circle cx="2.5" cy="9.5" r="2.5" />
      <circle cx="2.5" cy="16.5" r="2.5" />
    </svg>
  );
};

export default MoreIcon;