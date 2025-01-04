import Image from "next/image";
import css from "./styles.module.css";
import Link from "next/link";

const Register = () => {
  return (
    <div className={css.register}>
      <div className="container">
        <div className={css.register__wrapper}>
          <div className={css.register__inner}>
            <div className={css.register__header}>
              <h3 className={css.register__title}>Wellcome Back!</h3>
              <p className={css.register__subtitle}>
                Enter your Credentials to access your account
              </p>
            </div>
            <form className={css.form}>
              <label className={css.input__wrapper}>
                <label className={css.input__label}>Email address</label>
                <input
                  className={css.input}
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                />
              </label>
              <label className={css.input__wrapper}>
                <label className={css.input__label}>Password</label>
                <input
                  className={css.input}
                  type="password"
                  placeholder="Password"
                  required
                  name="password1"
                />
              </label>
              <label className={css.input__wrapper}>
                <label className={css.input__label}>Repeat Password</label>
                <input
                  className={css.input}
                  type="password"
                  placeholder="Repeat Password"
                  required
                  name="password2"
                />
              </label>
              <label className={css.checkbox__wrapper}>
                <input type="checkbox" required />
                <label>
                  I agree to the{" "}
                  <span>
                    <Link href={"/"}>terms</Link>
                  </span>{" "}
                  &{" "}
                  <span>
                    <Link href={"/"}>policy</Link>
                  </span>
                </label>
              </label>
              <button className={css.button} type="submit">
                Register
              </button>
            </form>
            <p className={css.or}>or</p>
            <ul className={css.social__media__list}>
              <li>
                <button className={css.social__media__item}>
                  <Image
                    src="/icons/github.svg"
                    alt="github"
                    width={24}
                    height={24}
                  />
                  <p>Sign in with Google</p>
                </button>
              </li>
              <li>
                <button className={css.social__media__item}>
                  <Image
                    src="/icons/google.svg"
                    alt="google"
                    width={24}
                    height={24}
                  />
                  <p>Sign in with Github</p>
                </button>
              </li>
            </ul>
            <p className={css.register}>
              Have an account?{" "}
              <span className={css.register__link}>
                <Link className={css.register__link} href={"/auth/register"}>
                  Login
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
