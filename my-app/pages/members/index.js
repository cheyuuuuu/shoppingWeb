import SinginBtn from "@/components/SigninBtn";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Register from "@/components/register";
import { Box, Flex } from "@chakra-ui/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <Flex justify="center" align="center" flexDirection="column">
          <Register />
        </Flex>
      </div>
    );
  }

  return (
    <div>
      <h1>歡迎, {session.user.name}</h1>
      {session.user.role === "admin" ? (
        <div>
          <h2>管理員控制台</h2>
          <p>這裡是只有管理員可以看到的內容。</p>
          <Link href="/members/oldOrder">歷史訂單</Link>
        </div>
      ) : (
        <div>
          <p>這裡可以瀏覽您的個人資料。</p>
          <Link href="/shoppingCart">查看購物車</Link>
        </div>
      )}
      <button onClick={() => signOut()}>登出</button>
    </div>
  );
}
