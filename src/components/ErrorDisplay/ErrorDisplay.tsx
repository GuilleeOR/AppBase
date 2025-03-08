
interface ErrorDisplayProps {
  title?: string;
  message?: string;
  error?: Error;
}

function ErrorDisplay({ 
  title = '¡Ups! Algo salió mal', 
  message = 'Ha ocurrido un error. Por favor, intenta nuevamente más tarde.',
  error
}: ErrorDisplayProps) {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#ffebee', 
      color: '#c62828',
      borderRadius: '4px',
      margin: '20px 0'
    }}>
      <h3>{title}</h3>
      <p>{message}</p>
      {error && (
        <details>
          <summary>Detalles del error</summary>
          <pre>{error.message}</pre>
        </details>
      )}
    </div>
  );
}

export default ErrorDisplay;
