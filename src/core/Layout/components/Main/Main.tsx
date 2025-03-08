import { Outlet } from "react-router-dom"
interface MainProps {
  className?: string
}
const Main = ({className}: MainProps) => {
  return (
    <main className={className}>
      <Outlet />
    </main>
  )
}

export default Main