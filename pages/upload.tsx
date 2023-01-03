import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import axios from 'axios'
import { SanityAssetDocument } from '@sanity/client'
import useAuthStore from '../store/authStore'
import { client } from '../utils/client'
import { topics } from '../utils/constants'


const Upload = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>()
    const [wrongFileType, setWrongFileType] = useState(false)
    const [caption, setCatpion] = useState('')
    const [category, setCategory] = useState(topics[0].name)
    const [savingPost, setSavingPost] = useState(false)

    const { userProfile }: { userProfile: any } = useAuthStore();
    const router = useRouter()

    const handlePost = async () => {
        if (caption && videoAsset?._id && category) {
            setSavingPost(true);

            const doc = {
                _type: 'post',
                caption,
                video: {
                    _type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: videoAsset?._id,
                    },
                },
                userId: userProfile?._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: userProfile?._id,
                },
                category,
            };

            await axios.post(`http://localhost:3000/api/post`, doc);

            router.push('/');
        }
    };

    const uploadVideo = async (e: any) => {
        const selectedFile = e.target.files[0]
        const filesTypes = ['video/mp4', 'video/webm', 'video/ogg']

        if (filesTypes.includes(selectedFile.type)) {
            client.assets.upload('file', selectedFile, {
                contentType: selectedFile.type,
                filename: selectedFile.name
            })
                .then((data) => {
                    setVideoAsset(data)
                    setIsLoading(false)
                })
        } else {
            setIsLoading(false)
            setWrongFileType(true)
        }
    }
    return (
        <div className='flex w-full h-full absolute left-0 top-[60px] lg:top-[70px] mb-10 pt-10 lg:pt-20 bg-[#F8F8F8] justify-center'>
            <div className='bg-white rounded-lg xl:h-[80vh] flex gap-6 flex-wrap justify-center items-center p-14 pt-6'>
                <div>
                    <div>
                        <p className='text-2xl font-bold'>Upload video</p>
                        <p className='text-md text-gray-400 mt-1'>Post a video to your account</p>
                    </div>
                    <div className='border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[460px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100'>
                        {isLoading ? (
                            <p>Uploading..</p>
                        ) : <div>
                            {videoAsset ? (
                                <div className='w-[254px]'>
                                    <video
                                        src={videoAsset?.url}
                                        loop
                                        controls
                                        className='rounded-xl bg-black h-[450px]'>

                                    </video>
                                </div>
                            ) : (
                                <label className='cursor-pointer'>
                                    <div className='flex flex-col items-center justify-center h-full'>
                                        <div className='flex flex-col items-center justify-center'>
                                            <p>
                                                <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                                            </p>
                                            <p className='text-xl font-semibold'>
                                                Upload video
                                            </p>
                                        </div>
                                        <p className='text-gray-400 text-center mt-2 text-sm leading-10'>
                                            MP4, WebM or OGG
                                        </p>
                                        <p className='bg-[#F51997] text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none'>
                                            Select file
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        name="upload-video"
                                        onChange={(e) => uploadVideo(e)}
                                        className='w-0 h-0'
                                    />
                                </label>)}
                        </div>}
                        {wrongFileType && (
                            <p className='text-center text-md text-red-400 font-semibold mt-4 w-[250px]'>
                                Please select correct video file
                            </p>
                        )}
                    </div>
                </div>
                <div className='flex flex-col gap-3 pb-10'>
                    <label className='text-md font-medium'>Caption</label>
                    <input
                        type='text'
                        value={caption}
                        onChange={(e) => setCatpion(e.target.value)}
                        className='rounded outline-none text-md border-2 border-gray-200 p-2' />
                    <label className='text-md font-medium'>Choose a category</label>
                    <select
                        // value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className='otuline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer'
                    >
                        {topics.map((topic) => (
                            <option key={topic.name}
                                className='otuline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                    <div className='flex gap-6 mt-10'>
                        <button
                            onClick={() => { }}
                            type='button'
                            className='border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'>
                            Discard
                        </button>
                        <button
                            disabled={videoAsset?.url ? false : true}
                            onClick={handlePost}
                            type='button'
                            className='bg-[#F51997] text-white border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'>
                            
                            {savingPost ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Upload;