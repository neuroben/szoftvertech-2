interface Props {
  statementNumber: number;
  progress: number;
  answer: (boolean | null)[];
  classN?: string;
  onProgressClick?: (index: number) => void;
}

function ProgressBar({
  statementNumber,
  progress,
  answer,
  classN = "",
  onProgressClick,
}: Props) {
  const width = 100 / statementNumber;
  
  return (
    <div className={`progress ${classN}`} style={{ height: '30px' }}>
      {Array.from({ length: statementNumber }).map((_, idx) => {
        const isAnswered = answer[idx] !== null && answer[idx] !== undefined;
        const isCurrent = idx === progress;
        const isClickable = true; // Minden kérdés kattintható
        
        let barClass = 'progress-bar d-flex align-items-center justify-content-center';
        
        if (isCurrent) {
          barClass += ' bg-primary'; // Jelenlegi kérdés - kék
        } else if (isAnswered) {
          barClass += ' bg-info'; // Megválaszolt - sárga
        } else {
          barClass += ' bg-secondary'; // Még nem válaszolt - szürke
        }
        
        if (isClickable) {
          barClass += ' progress-bar-clickable';
        }
        
        return (
          <div
            key={idx}
            className={barClass}
            role="progressbar"
            style={{ 
              width: `${width}%`,
              cursor: isClickable ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              opacity: isCurrent ? 1 : 0.8,
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '1px 1px 1px rgba(0,0,0,0.5)'
            }}
            aria-valuenow={width}
            aria-valuemin={0}
            aria-valuemax={100}
            onClick={() => isClickable && onProgressClick?.(idx)}
            onMouseEnter={(e) => {
              if (isClickable) {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'scaleY(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (isClickable) {
                e.currentTarget.style.opacity = isCurrent ? '1' : '0.8';
                e.currentTarget.style.transform = 'scaleY(1)';
              }
            }}
            title={`Kérdés ${idx + 1}${isAnswered ? ' (megválaszolva)' : ''}${isCurrent ? ' (jelenlegi)' : ''}`}
          >
            {idx + 1}
          </div>
        );
      })}
    </div>
  );
}

export default ProgressBar;
