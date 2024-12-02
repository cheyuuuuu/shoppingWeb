import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { For, Stack, Table, Flex, Box } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import SideBar from "@/components/sideBar";

export default function Edit() {
  const [commodities, setCommodities] = useState([]);
  const [updates, setUpdates] = useState({});

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/commodities`,
          {
            method: "GET",
            cache: "no-store",
          }
        );
        const data = await response.json();
        setCommodities(data);
        // 初始化更新的資料結構
        const initialUpdates = data.reduce((acc, item) => {
          acc[item._id] = {
            price: item.price,
            number: item.number,
            isSelected: false,
          };
          return acc;
        }, {});
        setUpdates(initialUpdates);
      } catch (e) {
        console.error("獲取商品資料失敗", e);
      }
    };
    fetchCommodities();
  }, []);

  const handleInputChange = (id, field, value) => {
    setUpdates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleCheckBoxChange = (id) => {
    setUpdates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isSelected: !prev[id].isSelected, //切換選取狀態
      },
    }));
  };

  const handleDelete = async () => {
    const selectedDelete = Object.keys(updates).filter(
      (id) => updates[id].isSelected
    );

    if (selectedDelete.length === 0) {
      alert("請先勾選需要刪除的商品");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deletes: selectedDelete }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        console.log("刪除成功", result);
        alert("刪除成功");
        setCommodities((prev) =>
          prev.filter((item) => !selectedDelete.includes(item._id))
        );
      } else {
        console.error("刪除失敗", result.message);
      }
    } catch (e) {
      console.error("刪除商品失敗", e);
    }
  };

  const handleUpdate = async () => {
    const selectedUpdates = Object.keys(updates)
      .filter((id) => updates[id].isSelected)
      .reduce((acc, id) => {
        acc[id] = { price: updates[id].price, number: updates[id].number };
        return acc;
      }, {});

    if (Object.keys(selectedUpdates).length === 0) {
      alert("請先勾選需要修改的商品");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/edit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates: selectedUpdates }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        console.log("更新成功", result);
        alert("修改成功！");
      } else {
        console.error("更新失敗", result.message);
      }
    } catch (e) {
      console.error("更新商品資料失敗", e);
    }
  };

  return (
    <div>
      <Flex p={3} direction="row" h="100vh" w="100%">
        <Box w="10%" h="100%" p={3} borderRadius="md" bg="gray">
          <SideBar></SideBar>
        </Box>
        <Box w="90%" h="100%" p={3}>
          <Stack gap="10" m={5}>
            <For each={["outline"]}>
              {(variant) => (
                <Table.Root
                  key={variant}
                  size="sm"
                  variant={variant}
                  showColumnBorder
                  stickyHeader
                  borderRadius="md"
                  shadow="5px 5px 5px black, -5px 5px 5px gray"
                  bg="gray"
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader p={3} textAlign="center" width="5%">
                        勾選欄
                      </Table.ColumnHeader>
                      <Table.ColumnHeader p={3} textAlign="center" width="20%">
                        商品名稱
                      </Table.ColumnHeader>
                      <Table.ColumnHeader p={3} textAlign="center" width="20%">
                        商品描述
                      </Table.ColumnHeader>
                      <Table.ColumnHeader p={3} textAlign="center" width="3%">
                        商品價格
                      </Table.ColumnHeader>

                      <Table.ColumnHeader p={3} textAlign="center" width="3%">
                        商品庫存
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {commodities.map((commodity) => (
                      <Table.Row key={commodity.id}>
                        <Flex
                          align="center"
                          justify="center"
                          w="100%"
                          h="100%"
                          marginTop="4"
                        >
                          <Checkbox
                            variant="subtle"
                            colorPalette="gray"
                            type="checkbox"
                            size="md"
                            checked={updates[commodity._id].isSelected || false}
                            onCheckedChange={() =>
                              handleCheckBoxChange(commodity._id)
                            }
                          ></Checkbox>
                        </Flex>
                        <Table.Cell textAlign="center">
                          {commodity.name}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {commodity.description}
                        </Table.Cell>

                        <Table.Cell p={2}>
                          <NumberInputRoot
                            size="lg"
                            value={updates[commodity._id]?.price || ""}
                            onValueChange={(e) =>
                              handleInputChange(commodity._id, "price", e.value)
                            }
                            disabled={!updates[commodity._id]?.isSelected}
                            min={0}
                            w={20}
                          >
                            <NumberInputField />
                          </NumberInputRoot>
                        </Table.Cell>
                        <Table.Cell p={3}>
                          <NumberInputRoot
                            size="lg"
                            value={updates[commodity._id]?.number || ""}
                            onValueChange={(e) =>
                              handleInputChange(
                                commodity._id,
                                "number",
                                e.value
                              )
                            }
                            disabled={!updates[commodity._id]?.isSelected}
                            min={0}
                            w={20}
                          >
                            <NumberInputField />
                          </NumberInputRoot>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              )}
            </For>
          </Stack>
          <Button
            onClick={handleUpdate}
            size="sm"
            m={5}
            p={2}
            variant="surface"
          >
            <FaEdit />
            修改
          </Button>
          <Button
            onClick={handleDelete}
            size="sm"
            m={5}
            p={2}
            variant="surface"
          >
            <FaTrashAlt />
            刪除
          </Button>
        </Box>
      </Flex>
    </div>
  );
}
