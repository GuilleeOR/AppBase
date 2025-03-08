import './Layout.css';
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";


function Layout () {
  return (
    <>
      <div className="layout">
        <Header className="header" />
        <Main className="main" />
        <Footer className="footer" />
      </div>
    </>
  )
}

export default Layout