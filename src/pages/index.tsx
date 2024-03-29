import UserCard from "@/components/UserCard";
import { GetServerSideProps } from "next";

interface ProfileProps {
  profile: {
    name: string,
    username: string,
    role: string,
    avatarUrl: string
  }
}

export default function Home(props: ProfileProps) {
  const { name, username, avatarUrl, role } = props.profile;
  const [firstName, lastName] = name.split(" ");

  return (
    <UserCard firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} role={role} username={username} />
  );
}

export const getServerSideProps: GetServerSideProps = (async ({req}) => {
  const token = req.cookies['token'];
  if (!token) return {props: { test: 'a' }};

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user`, {
    headers: {
      'Authorization': token
    }
  }).then(r => r.json())
  // Pass data to the page via props
  return { props: { profile: res } }
})