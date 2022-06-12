import connectToDatabase from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

export default async function useHandler(req, res) {
    const { method, body } = req;
    const { email, password } = body;

    if (!email?.includes('@') || password?.trim().length < 7) {
        return res
            .status(400)
            .json({ status: 'fail', message: 'Invalid request params.' });
    }

    switch (method) {
        case 'POST':
            const client = await connectToDatabase();
            const db = client.db();
            let user = await db.collection('users').findOne({ email });
            if (user) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'A user with that email is already registered.',
                });
            }

            const hashedPassword = await hashPassword(password);
            await db.collection('users').insertOne({
                email,
                password: hashedPassword,
            });

            return res
                .status(201)
                .json({ status: 'success', message: 'Account created.' });
        default:
            res.setHeader('ALLOW', ['POST']);
            res.status(403).send(`Method ${method} not allowed.`);
    }
}
