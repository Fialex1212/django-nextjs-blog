import React from "react";
import css from "./styles.module.css";
import Link from "next/link";

const Header = () => {
  return (
    <header className={css.header}>
      <div className="container">
        <nav className={css.nav}>
          <h2 className={css.nav__title}>
            <Link className={css.nav__link} href={"/"}>
              Blog
            </Link>
          </h2>
          <ul className={css.nav__list}>
            <li className={css.nav__item}>
              <Link href={"/profile"} className={css.nav__link}>
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
