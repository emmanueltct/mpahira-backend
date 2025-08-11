import jwt from 'jsonwebtoken';

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_SECRET!, { expiresIn: '15h' });
  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_SECRET!, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};
