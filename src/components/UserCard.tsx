import { Avatar, Text, Button, Paper, Center } from "@mantine/core";
import axios from "axios";

interface UserProps {
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  avatarUrl: string;
}

import { useRouter } from 'next/router'

export default function UserCard(props: UserProps) {
  const { firstName, lastName, username, role, avatarUrl } = props;
  
  let url;

  try {
    url = String(new URL(avatarUrl));
  } catch(err) {
    url = null
  }

  const router = useRouter();

  async function handleLogout() {
    try {
      await axios({
        method: "POST",
        url: "/api/logout"
      }).then((res) => {
        if (res.status === 200) {
          router.push('/')
        } else {
          console.log(res.data)
        }
      });
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Center maw="100%" h="100vh" bg="var(--mantine-color-gray-light)">
      <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
        <Avatar
          src={url}
          size={120}
          radius={120}
          mx="auto"
        />
        <Text ta="center" fz="lg" fw={500} mt="md">
          {firstName} {lastName}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          @{username} • {role}
        </Text>

        <Button onClick={handleLogout} variant="default" fullWidth mt="md">
          Logout
        </Button>
      </Paper>
    </Center>
  );
}
