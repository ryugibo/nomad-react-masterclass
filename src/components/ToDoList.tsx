import React, { useEffect } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import {
  categoryState,
  categoryTypeState,
  CATEGORYTYPES_LOCALSTORAGE_KEY,
  ICategory,
  toDoSelector,
  toDoState,
  TODO_LOCALSTORAGE_KEY,
} from "../atoms";
import AddToDoCategory from "./AddToDoCategory";
import Category from "./Category";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";

function ToDoList() {
  const [categoryTypes, setCategoryTypes] = useRecoilState(categoryTypeState);
  const toDos = useRecoilValue(toDoSelector);
  const setToDos = useSetRecoilState(toDoState);
  const [category, setCategory] = useRecoilState(categoryState);
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    setCategory(event.currentTarget.value);
  };

  useEffect(() => {
    const localCategoryTypes = localStorage.getItem(
      CATEGORYTYPES_LOCALSTORAGE_KEY
    );
    if (localCategoryTypes !== null) {
      const categoryTypes = JSON.parse(localCategoryTypes);
      setCategory(categoryTypes[0].name);
      setCategoryTypes(categoryTypes);
    }
    const localToDos = localStorage.getItem(TODO_LOCALSTORAGE_KEY);
    if (localToDos !== null) {
      setToDos(JSON.parse(localToDos));
    }
  }, []);

  const onClickDeleteCategory = () => {
    setCategoryTypes((prev) => {
      const newCategoryTypes = prev.filter(({ name }) => name !== category);
      if (newCategoryTypes.length === 0) {
        return prev;
      }
      if (newCategoryTypes.length === prev.length) {
        return prev;
      }
      localStorage.setItem(
        CATEGORYTYPES_LOCALSTORAGE_KEY,
        JSON.stringify(newCategoryTypes)
      );
      return newCategoryTypes;
    });
    setCategory(categoryTypes[0].name);
  };
  return (
    <div>
      <h1>To Dos</h1>
      <hr />
      <AddToDoCategory />
      <hr />
      <select value={category} onInput={onInput}>
        {categoryTypes.map((categoryType, index) => (
          <Category key={index} {...categoryType} />
        ))}
      </select>
      <button onClick={onClickDeleteCategory}>DELETE CATEGORY</button>
      <CreateToDo />
      {toDos.map((toDo) => (
        <ToDo key={toDo.id} {...toDo} />
      ))}
    </div>
  );
}

export default ToDoList;
