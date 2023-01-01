import { NextPage } from 'next';
import axios from 'axios';

// interface IProps {
//   videos: 
// }

const Home: NextPage = ({ videos }) => {
  console.log(videos)
  return (
    <p className="text-3xl font-bold underline">
      Hello world!
    </p>
  )
}

export const getServerSideProps = async () => {
  const { data } = await axios.get('http://localhost:3000/api/post')

  return {
    props: {
      videos: data
    }
  }
}

export default Home;