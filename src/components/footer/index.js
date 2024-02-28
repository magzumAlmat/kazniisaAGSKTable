import { Button, Typography } from "@mui/material";
import Image from "next/image";
import logo from "/public/image/cable/cable_logo.png";
import Link from "next/link";
import { Phone } from "@mui/icons-material";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container d-flex gap-5 align-items-start">
        <div className="header__left align-items-center d-flex gap-1">
          <Button className="btn">
            <div className="header__logo">
              <Image width="38" src={logo} alt="logo pizza" />
            </div>
          </Button>
          <Button className="btn">
            <div className="header__title">
            <div className="header__title-text">SCVolokno.kz</div>
                <div className="header__text">Cамые лучшие кабеля</div>
            </div>
          </Button>
        </div>
        {/* <div className="footer__links">
          <Link href="#">Доставка и оплата</Link>
          <Link href="#">О компании</Link>
        </div> */}
        <a href="tel:+78008008080" className="footer__phone">
          <Phone color="primary" />тел: +7 (777) 961 82 53
          
          
        </a>
        <Typography>email: stroyconnection@gmail.ru</Typography>
      </div>
    </footer>
  );
}
