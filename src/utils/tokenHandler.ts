import jwt from 'jsonwebtoken';
function generatorAccessToken(user) {
    const accessToken = jwt.sign(
        {
            uid: user._id,
            role: user.role,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: '1d' }
    );
    return accessToken;
}

function generatorRefreshToken(user) {
    const refreshToken = jwt.sign(
        {
            uid: user._id,
            role: user.role,
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: '7d' }
    );
    return refreshToken;
}

export { generatorAccessToken, generatorRefreshToken };
