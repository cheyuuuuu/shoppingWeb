import Link from "next/link";
import { Stack } from "@chakra-ui/react"

export default function SideBar(){
    return(
      <Stack>
        <Link href='/manner/upload'>新增商品</Link>
        <Link href='/manner/edit'>編輯商品</Link>
      </Stack>
    )
}