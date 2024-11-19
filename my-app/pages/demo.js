import { Button } from "@chakra-ui/react";
import { createStandaloneToast } from "@chakra-ui/toast";

export default function Demo() {
  const { toast } = createStandaloneToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      }
    >
      Show Toast
    </Button>
  );
}
