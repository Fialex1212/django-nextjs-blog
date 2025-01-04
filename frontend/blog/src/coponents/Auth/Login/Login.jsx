import Image from "next/image";
import css from "./styles.module.css";
import Link from "next/link";

const Login = () => {
  return (
    <div className={css.login}>
      <div className="container">
        <div className={css.login__wrapper}>
          <div className={css.login__inner}>
            <div className={css.login__header}>
              <h3 className={css.login__title}>Wellcome Back!</h3>
              <p className={css.login__subtitle}>
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
                  name="password"
                />
              </label>
              <label className={css.checkbox__wrapper}>
                <input type="checkbox" required />
                <label>Remember for 30 days</label>
              </label>
              <button className={css.button} type="submit">
                Login
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
              Don’t have an account?{" "}
              <span className={css.register__link}>
                <Link className={css.register__link} href={"/auth/register"}>
                  Register
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
