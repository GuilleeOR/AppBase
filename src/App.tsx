import './App.css'
import Layout from '@core/Layout/Layout'
import { PrimeReactProvider } from 'primereact/api';
function App() {

  return (
    <>
      <PrimeReactProvider>
        <Layout />
      </PrimeReactProvider>
    </>
  )
}

export default App
