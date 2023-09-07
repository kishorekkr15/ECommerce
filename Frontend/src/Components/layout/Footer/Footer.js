import Appstore from "../../../images/Appstore.png"
import playstore from "../../../images/playstore.png"
import "./Footer.css"

const Footer = () => {
  return (
    <footer id="footer">
        <div className="leftFooter">
            <h4>Download Our App</h4>
            <p>Downoad app for android and ios mobilePhone</p>
            <img src={playstore} alt="playstore"/>
            <img src={Appstore} alt="appstore"/>
        </div>        
        <div className="midFooter">
            <h1>E-Commerce</h1>
            <p>Copyrights 2021 &copy; Kishorekumar</p>
        </div>
        <div className="rightFooter">
            <h4>Follow us</h4>
            <a href="https://www.instagram.com/kishore_kumar_raji/">Instagram</a>
            <a href="https://www.instagram.com/kishore_kumar_raji/">Youtube</a>
            <a href="https://www.instagram.com/kishore_kumar_raji/">Facebook</a>
        </div>
    </footer>
  )
}
export default Footer