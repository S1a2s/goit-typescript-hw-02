import { LoadMoreType } from "./LoadMoreBtn.types";

const LoadMoreBtn: React.FC<LoadMoreType> = ({ onClick }: LoadMoreType) => {
  return <button onClick={onClick}>Load more</button>;
};

export default LoadMoreBtn;