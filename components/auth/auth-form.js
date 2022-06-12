import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';

import withFetch from '../../hooks/with-fetch';
import classes from './auth-form.module.css';

function AuthForm() {
    const router = useRouter();
    const { doRequest, data, error, loading } = withFetch();
    const [isLogin, setIsLogin] = useState(true);
    const emailRef = useRef('');
    const passwordRef = useRef('');

    function switchAuthModeHandler() {
        setIsLogin(prevState => !prevState);
    }

    async function submitHandler(e) {
        e.preventDefault();
        const email = emailRef.current?.value?.trim();
        const password = passwordRef.current?.value?.trim();
        if (email === '' || password === '') return;
        try {
            if (!isLogin) {
                await doRequest('/api/auth/signup', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                });
            }

            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
            if (!result.error) {
                emailRef.current.value = '';
                passwordRef.current.value = '';
                router.push('/');
            }
        } catch (err) {
            console.log('ERROR: ', err.message);
        }
    }

    return (
        <section className={classes.auth}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor='email'>Your Email</label>
                    <input type='email' id='email' ref={emailRef} required />
                </div>
                <div className={classes.control}>
                    <label htmlFor='password'>Your Password</label>
                    <input
                        type='password'
                        id='password'
                        ref={passwordRef}
                        required
                    />
                </div>
                <div className={classes.actions}>
                    <button>{isLogin ? 'Login' : 'Create Account'}</button>
                    <button
                        type='button'
                        className={classes.toggle}
                        onClick={switchAuthModeHandler}>
                        {isLogin
                            ? 'Create new account'
                            : 'Login with existing account'}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default AuthForm;
