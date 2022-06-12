import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { comparePassword } from '../../../lib/auth';

import connectToDatabase from '../../../lib/db';

export default NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const client = await connectToDatabase();
                const { email, password } = credentials;

                if (!email || !password) {
                    throw new Error('Invalid credentials');
                }

                const db = client.db();
                let user = await db.collection('users').findOne({ email });
                if (!user) {
                    throw new Error('Invalid credentials');
                }

                const valid = await comparePassword(password, user.password);
                if (!valid) {
                    throw new Error('Invalid password.');
                }

                client.close();
                return { email };
            },
        }),
    ],
});
