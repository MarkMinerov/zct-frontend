import "./style.scss";
import { Heading } from '@chakra-ui/react'

const Home = () => {
  return <div className="home">
    <Heading>Welcome to Draw.io! 🖌️</Heading>
    <br />
    <br />
    <p>Using this tool you can draw a number and we will guess what the number is!</p>
    <p>Firstly, register or login please, then click <b>Draw</b> button and enjoy!</p>
    <br />
    <p>Examples of drawings:</p>
    <img src="https://production-media.paperswithcode.com/datasets/MNIST-0000000001-2e09631a_09liOmx.jpg" alt="" />
  </div>;
};

export default Home;
