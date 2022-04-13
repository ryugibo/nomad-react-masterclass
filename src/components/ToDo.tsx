import React from "react";
import {
  categoryTypeState,
  IToDo,
  toDoState,
  TODO_LOCALSTORAGE_KEY,
} from "../atoms";
import { useRecoilState, useRecoilValue } from "recoil";

function ToDo({ text, category, id }: IToDo) {
  const categoryTypes = useRecoilValue(categoryTypeState);
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
          return { id, text, category: { name } } as IToDo;
        }
      });
      localStorage.setItem(TODO_LOCALSTORAGE_KEY, JSON.stringify(newToDos));
      return newToDos;
    });
  };
  const onClickDelete = () => {
    setToDos((oldToDos) => {
      const newToDos = oldToDos.filter((oldToDo) => {
        return oldToDo.id !== id;
      });
      localStorage.setItem(TODO_LOCALSTORAGE_KEY, JSON.stringify(newToDos));
      return newToDos;
    });
  };
  return (
    <li>
      <span>{text}</span>

      {categoryTypes.map(
        (categoryType, index) =>
          categoryType.name !== category.name && (
            <button key={index} name={categoryType.name} onClick={onClick}>
              {categoryType.name}
            </button>
          )
      )}
      <button onClick={onClickDelete}>Delete</button>
    </li>
  );
}

export default ToDo;
