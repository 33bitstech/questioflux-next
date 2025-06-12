import styles from './QuizIcon.module.scss';

const QuizIcon = ({ className }: { className?: string }) => {
  return <div className={`${styles.icon} ${className || ''}`} />;
};

export default QuizIcon;