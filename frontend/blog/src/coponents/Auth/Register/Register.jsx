"use client";

import Image from "next/image";
import css from "./styles.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import Popup from "./Popup/Popup";
import { toast } from "sonner";

const Register = () => {
  const router = useRouter();
  const { isAuthenticated, register, codeSubmit } = useAuthStore();
  const [code, setCode] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    password: "",
  });
  const [repeatPassword, setRepeatPassword] = useState("");

  const checkPasswords = () => {
    if (formData.password !== repeatPassword) {
      toast.error("Passwords do not match!");
      return false;
    }
    return true;
  };

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkPasswords()) {
      try {
        await register(formData);
        toast.success("Verify your email");
      } catch (error) {
        toast.error("Something went wrong...");
        console.log(error);
      }
    } else {
      toast.error("Passwords don't match!");
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const userData = {
      code: code,
      email: formData.email,
      fullname: formData.fullname,
      password: formData.password
    };
    console.log(userData);
    try {
      await codeSubmit(userData);
      toast.success("Email verified. User created successfully.");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log(error);
    } finally {
      setCode("")
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

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
            <form className={css.form} onSubmit={handleSubmit}>
              <label className={css.input__wrapper}>
                <label className={css.input__label}>fullname</label>
                <input
                  className={css.input}
                  type="text"
                  placeholder="fullname"
                  required
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInput}
                />
              </label>
              <label className={css.input__wrapper}>
                <label className={css.input__label}>Email address</label>
                <input
                  className={css.input}
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInput}
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
                  value={formData.password}
                  onChange={handleInput}
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
                  value={repeatPassword}
                  onChange={handleRepeatPassword}
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
        <Popup>
          <div>
            <form className={css.code__form} onSubmit={handleCodeSubmit}>
              <h3 className={css.code__title}>Verify your email</h3>
              <label className={css.input__wrapper}>
                <input
                  className={css.input}
                  type="text"
                  placeholder="Enter your code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </label>
              <button className={css.button} type="submit">
                Verify email
              </button>
            </form>
          </div>
        </Popup>
      </div>
    </div>
  );
};

export default Register;
