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

export const getServerSideProps: GetServerSideProps = (async () => {
  
  return { props: { profile: {
    name: "José",
    username: "jsilva",
    role: "Web",
    avatarUrl: "A"
  } } }
})