import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { categoryState, toDoState, TODO_LOCALSTORAGE_KEY } from "../atoms";

interface IForm {
  toDo: string;
}

function CreateToDo() {
  const category = useRecoilValue(categoryState);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const handleValid = ({ toDo }: IForm) => {
    console.log("add to do", toDo);
    setToDos((prev) => {
      const newToDos = [{ text: toDo, id: Date.now(), category }, ...prev];
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
