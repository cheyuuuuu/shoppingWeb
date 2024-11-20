import { Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
export default function Demo() {
  const { handleSubmit, register } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
  };
  const types = ["dog", "cat", "shrimp", "fish"];
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select
          name="pets"
          style={{ backgroundColor: "gray" }}
          defaultValue=""
          {...register("pets", {
            required: "請選擇一個寵物",
          })}
        >
          <option value="" disabled>
            請選擇你最愛的寵物
          </option>
          {types.map((type) => (
            <option value={type}>{type}</option>
          ))}
        </select>
        <Button type="submit" m={3}>
          送出
        </Button>
      </form>
    </div>
  );
}
