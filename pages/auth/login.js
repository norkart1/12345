import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../styles/login.module.css";
import { Api } from "../../api/base_api";
import { useRouter } from "next/router";
import Head from "next/head";
import baseApi from "../../api/baseApi";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState({ isError: false, message: "" });
  const [message, setMessage] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.getElementById('name').select(); // Focuses user name on load
  }, []);

  async function submitForm(event) {
    setLoading(true);
    event.preventDefault();
    const data = { username: username, password: password };

    try {
      const token = await baseApi.post('admin/login', data);
      if (token.data) {
        localStorage.setItem('token', token.data.data.access_token);
        localStorage.setItem('refreshToken', token.data.data.refresh_token);
        localStorage.setItem("sessionID", 1);
        router.push('/admin');
      } else {
        setError({ isError: true, message: token.data.message });
      }
    } catch (error) {
      setError({ isError: true, message: 'Invalid user name or password.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.login}>
        <div className={styles.login_form}>
          <div className={styles.btnBack} onClick={() => router.back()}>&larr; Back</div>
          <Image src="/assets/images/logo_rounded.png" width={150} height={150} alt="sibaq logo" />

          <form>
            <h1>Login to Sibaq portal</h1>

            <input
              type="text"
              className={styles.name}
              name="name"
              id="name"
              placeholder=" "
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <label className={styles.name_label} htmlFor="name">
              User Name
            </label>
            <input
              type="password"
              className={styles.password}
              name="password"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className={styles.password_label} htmlFor="password">
              Password
            </label>

            <div className={styles.forgotArea}>
              <a href="/forgot-password" className={styles.forgot}>
                Forgot Password?
              </a>
            </div>

            <div className={`${styles.error_show} ${error.isError ? styles.isError : ""}`}>
              <p>{error.message}</p>
            </div>

            <button type="button" className={styles.login_btn} onClick={submitForm}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
