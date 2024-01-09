import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Stack,
  Center,
} from "@mantine/core";
import Link from "next/link";

import styles from "./index.module.css";
import { useState } from "react";
import axios from "axios";

import { useRouter } from 'next/router'

export default function AuthenticationForm(props: PaperProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    }
  });

  async function handleSubmitForm(
    username: string,
    password: string
  ) {
    setLoading(true);
    form.values.username = "";
    form.values.password = "";

    const userData = {
      username,
      password,
    };

    try {
      await axios({
        method: "POST",
        baseURL: process.env.NEXT_PUBLIC_APP_URL, 
        url: "/api/login",
        data: userData,
      }).then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            router.push('/')
          }, 500);
        } else {
          setLoading(false);
          console.log(res.data)
        }
      });
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }

  return (
    <Center maw="100%" h="100vh" bg="var(--mantine-color-gray-light)">
      <Paper radius="md" p="xl" withBorder {...props} maw={500}>
        <Text ta="center" size="lg" mb="md" mt="md" fw={500}>
          Bem-vindo de Volta! Faça login:
        </Text>

        <form
          onSubmit={form.onSubmit(
            ({ username, password }) => {
              handleSubmitForm(username, password);
            }
          )}
        >
          <Stack>
            <TextInput
              required
              label="Username"
              placeholder="hello@mantine.dev"
              value={form.values.username}
              onChange={(event) =>
                form.setFieldValue("username", event.currentTarget.value)
              }
              error={form.errors.username && "Invalid username"}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Link
              href="/signup"
              style={{
                fontSize: "0.75rem",
                color: "var(--mantine-color-dimmed)",
              }}
              className={styles.link}
            >
              Don&apos;t have an account? Register
            </Link>
            <Button loading={loading} color="blue" type="submit" radius="xl">
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}
