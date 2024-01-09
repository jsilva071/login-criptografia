import jwt from 'jsonwebtoken'

export default function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (error: any) {
    console.error('Erro ao verificar o token:', error.message);
    return null;
  }
}