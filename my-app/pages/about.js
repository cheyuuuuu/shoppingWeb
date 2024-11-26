import { Flex, Box, List } from "@chakra-ui/react";

export default function About() {
  return (
    <div>
      <List.Root variant="marker" colorPalette="blue" align="start">
        <List.Item _marker={{ color: "red" }}>First order item</List.Item>
        <List.Item _marker={{ color: "red" }}>First order item</List.Item>
        <List.Item _marker={{ color: "red" }}>
          First order item with list
          <List.Root ps="5">
            <List.Item _marker={{ color: "red" }}>Nested item</List.Item>
            <List.Item _marker={{ color: "red" }}>Nested item</List.Item>
            <List.Item _marker={{ color: "red" }}>Nested item</List.Item>
          </List.Root>
        </List.Item>
        <List.Item _marker={{ color: "red" }}>First order item</List.Item>
      </List.Root>
    </div>
  );
}
