import React, { useEffect } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import {
  Categories,
  categoryState,
  toDoSelector,
  toDoState,
  TODO_LOCALSTORAGE_KEY,
} from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";

function ToDoList() {
  const toDos = useRecoilValue(toDoSelector);
  const setToDos = useSetRecoilState(toDoState);
  const [category, setCategory] = useRecoilState(categoryState);
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    setCategory(event.currentTarget.value as Categories);
  };

  useEffect(() => {
    const localToDos = localStorage.getItem(TODO_LOCALSTORAGE_KEY);
    if (localToDos !== null) {
      setToDos(JSON.parse(localToDos));
    }
  }, []);

  return (
    <div>
      <h1>To Dos</h1>
      <hr />
      <select value={category} onInput={onInput}>
        <option value={Categories.TO_DO}>To Do</option>
        <option value={Categories.DOING}>Doing</option>
        <option value={Categories.DONE}>Done</option>
      </select>
      <CreateToDo />
      {toDos.map((toDo) => (
        <ToDo key={toDo.id} {...toDo} />
      ))}
    </div>
  );
}

export default ToDoList;
