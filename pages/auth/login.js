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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.getElementById('name').select(); // Focusses user name on load
  }, []);

  async function submitForm(event) {
    setLoading(true);
    event.preventDefault();

    const data = {}; // No username or password data is being sent now

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
      setError({ isError: true, message: 'Login failed. Please try again.' });
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
          <div className={styles.btnBack} onClick={() => router.back()}> &larr; Back</div>
          <Image src="/assets/images/logo_rounded.png" width={150} height={150} alt="sibaq logo" />
          <form>
            <h1>Login to Sibaq portal</h1>

            {/* Removed username and password input fields */}

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
