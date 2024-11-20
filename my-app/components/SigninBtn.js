import { useSession, signIn } from "next-auth/react";
import { Button, Box } from "@chakra-ui/react";

export default function Component() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <>
        <Button bg="none" textStyle="xl" mb={1} ml={3} onClick={() => signIn()}>
          登入
        </Button>
      </>
    );
  }
}
