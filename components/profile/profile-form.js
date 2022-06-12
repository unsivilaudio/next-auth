import { useRef } from 'react';
import classes from './profile-form.module.css';

function ProfileForm(props) {
    const currentRef = useRef();
    const nextPwdRef = useRef();

    function submitHandler(e) {
        e.preventDefault();
        const current = currentRef.current.value;
        const next = nextPwdRef.current.value;

        if ([current, next].every(x => x !== '')) {
            props.onChangePassword(current, next);
        }
    }

    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.control}>
                <label htmlFor='new-password'>New Password</label>
                <input type='password' id='new-password' ref={nextPwdRef} />
            </div>
            <div className={classes.control}>
                <label htmlFor='old-password'>Old Password</label>
                <input type='password' id='old-password' ref={currentRef} />
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
        </form>
    );
}

export default ProfileForm;
