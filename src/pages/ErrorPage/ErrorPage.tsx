import { useRouteError } from 'react-router-dom'

function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string }
  console.error(error)

  return (
    <div id="error-page">
      <h1>¡Oops!</h1>
      <p>Lo sentimos, ha ocurrido un error inesperado.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}

export default ErrorPage