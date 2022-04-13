import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  categoryState,
  toDoState,
  TODO_LOCALSTORAGE_KEY,
  IToDo,
} from "../atoms";

interface IForm {
  toDo: string;
}

function CreateToDo() {
  const category = useRecoilValue(categoryState);
  const setToDos = useSetRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const handleValid = ({ toDo }: IForm) => {
    console.log("add to do", toDo);
    setToDos((prev) => {
      const newToDos = [
        { text: toDo, id: Date.now(), category: { name: category } } as IToDo,
        ...prev,
      ];
      localStorage.setItem(TODO_LOCALSTORAGE_KEY, JSON.stringify(newToDos));
      return newToDos;
    });
    setValue("toDo", "");
  };
  return (
    <form onSubmit={handleSubmit(handleValid)}>
      <input
        {...register("toDo", { required: "Please write a To Do." })}
        placeholder="Write a to do"
      />
      <button>Add</button>
    </form>
  );
}

export default CreateToDo;
