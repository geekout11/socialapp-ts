import { NextPage } from 'next';
import axios from 'axios';
import { Video } from '../types'
import VideoCard from '../components/VideoCard';
import NoResults from '../components/NoResults';

interface VideoProps {
  videos: Video[]
}

const Home = ({ videos }: VideoProps) => {
  // console.log(videos)
  return (
    <div className='flex flex-col gap-10 videos h-full'>
      {videos.length 
        ? videos?.map((video: Video) => (
          <VideoCard post={video} isShowingOnHome key={video._id} />
        )) 
        : <NoResults text={`No Videos`} />}
    </div>
  )
}

// export const getServerSideProps = async () => {
//   const { data } = await axios.get('http://localhost:3000/api/post')

//   return {
//     props: {
//       videos: data
//     }
//   }
// }

export const getServerSideProps = async ({
  query: { topic },
}: {
  query: { topic: string };
}) => {
  let response = await axios.get(`http://localhost:3000/api/post`);

  return {
    props: { videos: response.data },
  };
};

export default Home;