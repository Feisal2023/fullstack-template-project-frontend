import { useSelector } from "react-redux";
import "./Home.scss";

const Home = () => {
  const { name } = useSelector((state) => state.data);
  return (
    <div className="home">
      <div className="container">
        <h2>Home Page</h2>
        <p>
          welcome to the <b>Home</b> page
        </p>
        <p>
          this page has <b>Redux Toolkit</b> set up.
        </p>
        <p>
          the name: <b>{name}</b> is sorted in the dataSlice
        </p>
      </div>
    </div>
  );
};

export default Home;
