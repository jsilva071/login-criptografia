export async function validateToken(token?: string): Promise<{ response?: Response; error?: string }> {
  if (!token) return {};

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/verify/${token}`)

    if (!response.ok) throw response;

    return {response};
    
  } catch (err: any) {
    return {error: 'Error validating token'}
  }
}