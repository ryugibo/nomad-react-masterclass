import { atom, selector } from "recoil";

type categories = "DONE" | "DOING" | "TO_DO";

export interface IToDo {
  text: string;
  id: number;
  category: categories;
}

export const categoryState = atom<categories>({
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
    return toDos.filter((toDo) => toDo.category === category);
  },
});
