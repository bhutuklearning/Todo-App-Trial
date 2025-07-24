import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const { JWT_SECRET } = process.env;

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: '7d', // Token expiration time
    });

    return token;
};

export default generateToken;