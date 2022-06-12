import { getSession } from 'next-auth/react';
import { comparePassword, hashPassword } from '../../../lib/auth';
import connectToDatabase from '../../../lib/db';

export default async function useHandler(req, res) {
    const session = await getSession({ req });
    const { method, body } = req;

    if (!session) {
        return res.status(403).json({
            status: 'fail',
            message: 'Please log in to use this route.',
        });
    }

    switch (method) {
        case 'PATCH':
            const { password, nextPassword } = body;
            if (!password || !nextPassword) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Missing params for request.',
                });
            }
            const client = await connectToDatabase();
            const db = client.db();
            let user = await db
                .collection('users')
                .findOne({ email: session.user.email });
            if (!user) {
                client.close();
                return res.status(404).json({
                    status: 'fail',
                    message: 'User does not exist.',
                });
            }

            const valid = await comparePassword(password, user.password);
            if (!valid) {
                client.close();
                return res.status(403).json({
                    status: 'fail',
                    message: 'Invalid credentials',
                });
            }

            const hashedPassword = await hashPassword(nextPassword);
            await db.collection('users').updateOne(
                {
                    email: session.user.email,
                },
                {
                    $set: {
                        password: hashedPassword,
                    },
                }
            );

            client.close();
            return res
                .status(200)
                .json({ status: 'success', message: 'Password updated!' });
        default:
            res.setHeader('ALLOW', ['PATCH']);
            res.status(403).send(`Method ${method} not allowed.`);
    }
}
