import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import {
  categoryTypeState,
  CATEGORYTYPES_LOCALSTORAGE_KEY,
  ICategory,
} from "../atoms";

interface IForm {
  category: string;
}

function AddToDoCategory() {
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const setCategoryTypes = useSetRecoilState(categoryTypeState);
  const handleValid = ({ category }: IForm) => {
    setCategoryTypes((prev) => {
      const newCategoryTypes = [{ name: category } as ICategory, ...prev];
      localStorage.setItem(
        CATEGORYTYPES_LOCALSTORAGE_KEY,
        JSON.stringify(newCategoryTypes)
      );
      return newCategoryTypes;
    });
    setValue("category", "");
  };
  return (
    <form onSubmit={handleSubmit(handleValid)}>
      <input
        {...register("category", { required: "Please write a To Do." })}
        placeholder="Write a category to Add"
      />
      <button>Add</button>
    </form>
  );
}
export default AddToDoCategory;
