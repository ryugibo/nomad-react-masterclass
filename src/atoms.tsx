import { atom, selector } from "recoil";

export const CATEGORYTYPES_LOCALSTORAGE_KEY = "CATEGORY_TYPES";
export const TODO_LOCALSTORAGE_KEY = "TODO";

export interface ICategory {
  name: string;
}

export const categoryTypeState = atom<ICategory[]>({
  key: "categoryType",
  default: [{ name: "TO_DO" }, { name: "DOING" }, { name: "DONE" }],
});

export interface IToDo {
  text: string;
  id: number;
  category: ICategory;
}

export const categoryState = atom<string>({
  key: "category",
  default: "TO_DO",
});

export const toDoState = atom<IToDo[]>({
  key: "toDo",
  default: [],
});

export const toDoSelector = selector<IToDo[]>({
  key: "toDoSelector",
  get: ({ get }) => {
    const category = get(categoryState);
    const toDos = get(toDoState);
    return toDos.filter((toDo) => toDo.category.name === category);
  },
});
