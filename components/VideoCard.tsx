/* BASIC */
import { useState, useEffect, useRef } from 'react'
 
/* NEXT */
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

/* ICONS */
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { BsFillPlayFill, BsFillPauseFill, BsPlay } from 'react-icons/bs'
import { GoVerified } from 'react-icons/go'

/* TYPES */
import { Video } from '../types'

interface VideoProps {
  post: Video;
  isShowingOnHome?: boolean;
}

const VideoCard: NextPage<VideoProps> = ({ post: { caption, postedBy, video, _id, likes }, isShowingOnHome }) => {
  const [playing, setPlaying] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoPress = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  if (!isShowingOnHome) {
    return (
      <div>
        <Link href={`/detail/${_id}`}>
          <video
            loop
            src={video.asset.url}
            className='w-[250px] md:w-full rounded-xl cursor-pointer'
          ></video>
        </Link>
        <div className='flex gap-2 mt-8 items-center ml-4'>
          <p className='text-white text-lg font-medium flex gap-1 items-center'>
            <BsPlay className='text-2xl' />
            {likes?.length || 0}
          </p>
        </div>
        <Link href={`/detail/${_id}`}>
          <p className='mt-5 text-md text-gray-800 cursor-pointer w-210'>
            {caption}
          </p>
        </Link>
      </div>
    )
  }

  return (
    <div className='flex flex-col border-b-2 border-gray-200 pb-6 items-center'>
      <div>
        <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded lg:ml-[-120%] md:ml-[-70%] sm:ml-[-85%] ml-[-45%]'>
          <div className='md:w-16 md:h-16 w-12 h-12'>
            <Link href={`/profile/${postedBy?._id}`}>
              <>
                <Image
                  width={62}
                  height={62}
                  className='rounded-full'
                  src={postedBy?.image}
                  alt='user-profile'
                />
              </>
            </Link>
          </div>
          <div>
            <Link href={`/profile/${postedBy?._id}`}>
              <div className='flex items-center gap-2'>
                <p className='flex gap-2 items-center md:text-md font-bold text-primary'>
                  {postedBy?.userName}{' '}
                  <GoVerified className='text-blue-400 text-md' />
                </p>
              </div>
            </Link>
            <Link href={`/detail/${_id}`}>
              <p className='mt-2 font-normal '>{caption}</p>
            </Link>
          </div>
        </div>
      </div>

      <div className='lg:ml-18 flex gap-4 relative mr-5'>
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className='rounded-3xl'
        >
          <Link href={`/detail/${_id}`}>
            <video
              loop
              ref={videoRef}
              src={video.asset.url}
              className='lg:w-[600px] h-[500px] sm:h-[600px] md:h-[650px] lg:h-[690px] w-[400px] rounded-2xl cursor-pointer bg-gray-100'
            ></video>
          </Link>

          {/* {isHover && ( */}
            <div className='absolute bottom-6 cursor-pointer flex justify-between w-[100%] px-6'>
              {playing ? (
                <button className='text-pink-500 border border-pink-500 hover:bg-pink-500 hover:text-white active:bg-pink-600 font-bold uppercase px-3 py-1 rounded-full outline-none focus:outline-none ease-linear transition-all duration-150' onClick={onVideoPress}>
                  <BsFillPauseFill className='text-2xl' />
                </button>
              ) : (
                <button className='text-pink-500 border border-pink-500 hover:bg-pink-500 hover:text-white active:bg-pink-600 font-bold uppercase px-3 py-1 rounded-full outline-none focus:outline-none ease-linear transition-all duration-150' onClick={onVideoPress}>
                  <BsFillPlayFill className='text-2xl' />
                </button>
              )}
              {isVideoMuted ? (
                <button className='text-pink-500 border border-pink-500 hover:bg-pink-500 hover:text-white active:bg-pink-600 font-bold uppercase px-3 py-1 rounded-full outline-none focus:outline-none ease-linear transition-all duration-150' onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className='text-2xl' />
                </button>
              ) : (
                <button className='text-pink-500 border border-pink-500 hover:bg-pink-500 hover:text-white active:bg-pink-600 font-bold uppercase px-3 py-1 rounded-full outline-none focus:outline-none ease-linear transition-all duration-150' onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className='text-2xl' />
                </button>
              )}
            </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;