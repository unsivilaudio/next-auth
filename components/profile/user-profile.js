import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import withFetch from '../../hooks/with-fetch';
import ProfileForm from './profile-form';
import classes from './user-profile.module.css';

function UserProfile({ currentUser }) {
    const { doRequest, data, error, loading } = withFetch();
    const router = useRouter();
    const { data: session, status } = useSession();
    // Redirect away if NOT auth

    useEffect(() => {
        if (status !== 'loading' && !session?.user) {
            router.push('/');
        }
    }, [status, session]);

    function onChangePassword(password, nextPassword) {
        doRequest('/api/user/change-password', {
            method: 'PATCH',
            body: JSON.stringify({ password, nextPassword }),
        });
    }

    if (status === 'loading') {
        return <p className={classes.profile}>Loading...</p>;
    }

    return (
        <section className={classes.profile}>
            <h1>Your User Profile</h1>
            <ProfileForm onChangePassword={onChangePassword} />
        </section>
    );
}

export default UserProfile;
