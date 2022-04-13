import { ICategory } from "../atoms";

function Category({ name }: ICategory) {
  return <option value={name}>{name}</option>;
}

export default Category;
