import { getSession } from 'next-auth/react';
import UserProfile from '../components/profile/user-profile';

function ProfilePage(props) {
    return <UserProfile currentUser={props.session?.user} />;
}

export async function getServerSideProps({ req }) {
    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/auth',
            },
        };
    }

    return {
        props: {
            session,
        },
    };
}

export default ProfilePage;
