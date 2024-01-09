import { isEmail, useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Checkbox,
  Stack,
  Center,
  Box,
  Popover,
  Progress,
  rem,
} from "@mantine/core";

import {} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

import Link from "next/link";

import styles from "./index.module.css";
import axios from "axios";
import { useState } from "react";

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text
      c={meets ? "teal" : "red"}
      style={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? (
        <IconCheck style={{ width: rem(14), height: rem(14) }} />
      ) : (
        <IconX style={{ width: rem(14), height: rem(14) }} />
      )}{" "}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
  let multiplier = password.length > 11 && password.length < 129 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export default function AuthenticationForm(props: PaperProps) {
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      role: "",
      avatarUrl: "",
      username: "",
      password: "",
      terms: true,
    },

    validate: {
      name: (value) =>
        value.split(" ").length < 2 ? "Enter a minimum of 2 names" : null,
      email: isEmail("Invalid email!"),
    },
  });

  const [loading, setLoading] = useState(false);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const strength = getStrength(form.values.password);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.values.password)}
    />
  ));

  async function hasEmailAvailable(email: string) {
    const res = await axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_APP_URL, 
      url: "/api/email",
      data: {
        email,
      },
    });

    return res.data.emailAvailable;
  }

  async function hasUsernameAvailable(username: string) {
    const res = await axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_APP_URL, 
      url: "/api/username",
      data: {
        username,
      },
    });

    return res.data.usernameAvailable;
  }

  async function handleSubmitForm(
    name: string,
    username: string,
    role: string,
    avatarUrl: string,
    email: string,
    password: string
  ) {
    setLoading(true);

    if (strength < 100) {
      setLoading(false);
      return form.setFieldError("password", "Password does not meet the requirements");
    }

    const emailAvailable = await hasEmailAvailable(email);
    if (!emailAvailable) {
      setLoading(false);
      return form.setFieldError("email", "Email already used!");
    }

    const usernameAvailable = await hasUsernameAvailable(username);
    if (!usernameAvailable) {
      setLoading(false);
      return form.setFieldError("username", "Username already used!");
    }

    form.values.name = "";
    form.values.username = "";
    form.values.role = "";
    form.values.avatarUrl = "";
    form.values.email = "";
    form.values.password = "";

    const userData = {
      name,
      email,
      role,
      avatarUrl,
      username,
      password,
    };

    try {
      await axios({
        method: "POST",
        baseURL: process.env.NEXT_PUBLIC_APP_URL, 
        url: "/api/signup",
        data: userData,
      }).then((res) => {
        setLoading(false);
        if (res.status === 200) {
          console.log(res.data);
        } else {
          console.log(res.data);
        }
      }).catch((err) => {
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <Center maw="100%" h="100vh" bg="var(--mantine-color-gray-light)">
      <Paper radius="md" p="xl" withBorder {...props} maw={500}>
        <Text ta="center" size="lg" mb="md" mt="md" fw={500}>
          Registe-se:
        </Text>

        <form
          onSubmit={form.onSubmit(
            ({ name, username, role, avatarUrl, email, password }) => {
              handleSubmitForm(
                name,
                username,
                role,
                avatarUrl,
                email,
                password
              );
            }
          )}
        >
          <Stack>
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              error={form.errors.name}
              radius="md"
            />

            <TextInput
              label="Username"
              placeholder="Your username"
              value={form.values.username}
              onChange={(event) =>
                form.setFieldValue("username", event.currentTarget.value)
              }
              error={form.errors.username}
              radius="md"
            />

            <TextInput
              label="Avatar Url"
              placeholder="https://github.com/jsilva071.png"
              value={form.values.avatarUrl}
              onChange={(event) =>
                form.setFieldValue("avatarUrl", event.currentTarget.value)
              }
              error={form.errors.avatarUrl && "Invalid avatar url"}
              radius="md"
            />

            <TextInput
              label="Role"
              placeholder="Software Engineer"
              value={form.values.role}
              onChange={(event) =>
                form.setFieldValue("role", event.currentTarget.value)
              }
              error={form.errors.role && "Invalid role"}
              radius="md"
            />

            <TextInput
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email}
              radius="md"
            />

            <Popover
              opened={popoverOpened}
              position="bottom"
              width="target"
              transitionProps={{ transition: "pop" }}
            >
              <Popover.Target>
                <div
                  onFocusCapture={() => setPopoverOpened(true)}
                  onBlurCapture={() => setPopoverOpened(false)}
                >
                  <PasswordInput
                    withAsterisk
                    label="Password"
                    placeholder="Your password"
                    value={form.values.password}
                    onChange={(event) =>
                      form.setFieldValue("password", event.currentTarget.value)
                    }
                    error={form.errors.password}
                    radius="md"
                  />
                </div>
              </Popover.Target>
              <Popover.Dropdown>
                <Progress color={color} value={strength} size={5} mb="xs" />
                <PasswordRequirement
                  label="Includes at least 12 characters"
                  meets={form.values.password.length > 11}
                />
                <PasswordRequirement
                  label="Includes up to 128 characters"
                  meets={form.values.password.length < 128}
                />
                {checks}
              </Popover.Dropdown>
            </Popover>

            <Checkbox
              color="blue"
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Link
              href="/login"
              style={{
                fontSize: "0.75rem",
                color: "var(--mantine-color-dimmed)",
              }}
              className={styles.link}
            >
              Already have an account? Login
            </Link>
            <Button loading={loading} color="blue" type="submit" radius="xl">
              Registar
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}
