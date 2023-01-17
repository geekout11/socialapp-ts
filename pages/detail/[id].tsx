import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { GoVerified } from 'react-icons/go'
import { MdOutlineCancel } from 'react-icons/md'
import { BsFillPlayFill } from 'react-icons/bs'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import axios from 'axios'
import { Video } from '../../types'

type PostDetails = {
    postDetails: Video
}

const Detail = ({ postDetails }: PostDetails) => {
    const [post, setPost] = useState(postDetails)
    const [playing, setPlaying] = useState(false)
    const [isVideoMuted, setIsVideoMuted] = useState(false)
    const router = useRouter()

    const videoRef = useRef<HTMLVideoElement>(null);

    const onVideoClick = () => {
        if (playing) {
            videoRef?.current?.pause();
            setPlaying(false);
        } else {
            videoRef?.current?.play();
            setPlaying(true);
        }
    };

    useEffect(() => {
        if (post && videoRef?.current) {
            videoRef.current.muted = isVideoMuted;
        }
    }, [post, isVideoMuted]);

    if (!post) {
        return null
    }

    return (
        <div className='flex w-full abosulte left-0 top-0 bg-white flex-wrap lg:flex-nowrap'>
            <div className='relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black'>
                <div className='absolute top-6 left-2 lg:left-6 gap-6 z-50'>
                    <p className='cursor-pointer'
                        onClick={() => router.back()}>
                        <MdOutlineCancel className='text-white text-[35px]' />
                    </p>
                </div>
                <div className='relative'>
                    <div className='lg:h-[100vh] h-[60vh]'>
                        <video
                            ref={videoRef}
                            onClick={onVideoClick}
                            loop
                            src={post?.video?.asset.url}
                            className='h-full cursor-pointer'
                        ></video>
                    </div>

                    <div className='absolute top-[45%] left-[40%]  cursor-pointer'>
                        {!playing && (
                            <button onClick={onVideoClick}>
                                <BsFillPlayFill className='text-white text-6xl lg:text-8xl' />
                            </button>
                        )}
                    </div>
                </div>
                <div className='absolute bottom-5 lg:bottom-10 right-10 cursor-pointer'>
                    {isVideoMuted ? (
                        <button onClick={() => setIsVideoMuted(false)}>
                            <HiVolumeOff className='text-white text-2xl lg:text-4xl' />
                        </button>
                    ) : (
                        <button onClick={() => setIsVideoMuted(true)}>
                            <HiVolumeUp className='text-white text-2xl lg:text-4xl' />
                        </button>
                    )}
                </div>
            </div>
            <div className='relative w-[1000px] md:w-[900px] lg:w-[700px]'>
                <div className='lg:mt-20 mt-10'>
                    <Link href={`/profile/${post.postedBy._id}`}>
                        <div className='flex gap-4 mb-4 bg-white w-full pl-10 cursor-pointer'>
                            <Image
                                width={60}
                                height={60}
                                alt='user-profile'
                                className='rounded-full'
                                src={post.postedBy.image}
                            />
                            <div>
                                <div className='mt-2 text-xl font-bold lowercase tracking-wider flex gap-2 items-center justify-center'>
                                    {post.postedBy.userName.replace(/\s+/g, '')}{' '}
                                    <GoVerified className='text-blue-400 text-xl' />
                                </div>
                            </div>
                        </div>
                    </Link>
                    <div className='px-10'>
                        <p className=' text-md text-gray-600'>{post.caption}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = async ({
    params: { id }
}: {
    params: { id: string }
}) => {
    const { data } = await axios.get(`http://localhost:3000/api/post/${id}`)

    return {
        props: { postDetails: data }
    }
}

export default Detail;