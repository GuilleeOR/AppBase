
interface LoadingSpinnerProps {
  message?: string;
}

function LoadingSpinner({ message = 'Cargando...' }: LoadingSpinnerProps) {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2>{message}</h2>
      <div style={{ 
        display: 'inline-block',
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;
