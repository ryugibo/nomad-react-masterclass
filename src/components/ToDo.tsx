import React from "react";
import { Categories, IToDo, toDoState, TODO_LOCALSTORAGE_KEY } from "../atoms";
import { useRecoilState } from "recoil";

function ToDo({ text, category, id }: IToDo) {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;

    setToDos((oldToDos) => {
      const newToDos = oldToDos.map((oldToDo) => {
        if (oldToDo.id !== id) {
          return oldToDo;
        } else {
          return { id, text, category: name } as IToDo;
        }
      });
      localStorage.setItem(TODO_LOCALSTORAGE_KEY, JSON.stringify(newToDos));
      return newToDos;
    });
  };
  return (
    <li>
      <span>{text}</span>
      {category !== Categories.DOING && (
        <button name={Categories.DOING} onClick={onClick}>
          Doing
        </button>
      )}
      {category !== Categories.TO_DO && (
        <button name={Categories.TO_DO} onClick={onClick}>
          To Do
        </button>
      )}
      {category !== Categories.DONE && (
        <button name={Categories.DONE} onClick={onClick}>
          Done
        </button>
      )}
    </li>
  );
}

export default ToDo;
