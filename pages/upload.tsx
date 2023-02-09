/* BASIC */
import React, { useEffect, useState } from 'react';
import { SanityAssetDocument } from '@sanity/client';
import axios from 'axios';

/* NEXT */
import { useRouter } from 'next/router';

/* UTILS */
import { client } from '../utils/client';
import { topics } from '../utils/constants';

/* STORE */
import useAuthStore from '../store/authStore';

/* ANTD */
import {
    Button,
    Card,
    Input,
    List,
    message,
    Progress
} from 'antd'

/* FIREBASE */
import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage'
import { storage } from '../firebaseConfig'


const Upload = () => {
    const [caption, setCaption] = useState('');
    const [topic, setTopic] = useState<String>(topics[0].name);
    const [isUploading, setIsUploading] = useState(false)
    const [savingPost, setSavingPost] = useState<Boolean>(false);
    const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | any>();
    const [wrongFileType, setWrongFileType] = useState<Boolean>(false);
    const [imageFile, setImageFile] = useState<File>()
    const [progressUpload, setProgressUpload] = useState(0)
    const [downloadURL, setDownloadURL] = useState('')

    const userProfile: any = useAuthStore((state: any) => state.userProfile);
    const router = useRouter();

    const handleSelectedFile = (files: any) => {
        if (files && files[0].size < 10000000000000000) {
            setImageFile(files[0])

            // console.log(files[0])
        } else {
            message.error('File size to large')
        }
    }

    const uploadVideo = async (e: any) => {
        const selectedFile = e.target.files[0];
        const fileTypes = ['video/mp4', 'video/webm', 'video/ogg'];

        if (fileTypes.includes(selectedFile.type)) {
            setWrongFileType(false);
            setIsUploading(true);

            client.assets
                .upload('file', selectedFile, {
                    contentType: selectedFile.type,
                    filename: selectedFile.name,
                })
                .then((data) => {
                    setVideoAsset(data);
                    setIsUploading(false);
                });
        } else {
            setIsUploading(false);
            setWrongFileType(true);
        }
    };

    const handleUploadFile = (files: any) => {
        if (imageFile) {
            const name = imageFile.name
            const storageRef = ref(storage, `image/${name}`)
            const uploadTask = uploadBytesResumable(storageRef, imageFile)

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress: any =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100

                    setProgressUpload(progress.toFixed())

                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused')
                            break
                        case 'running':
                            console.log('Upload is running')
                            break
                    }
                },
                (error) => {
                    message.error(error.message)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        //url is download url of file
                        setDownloadURL(url)
                    })
                },
            )
        } else {
            message.error('File not found')
        }
    }

    const handleRemoveFile = () => {
            setImageFile(undefined)
            setDownloadURL('')
            setProgressUpload(0)
    }

    useEffect(() => {
        if (!userProfile) router.push('/');
    }, [userProfile, router]);


    const handlePost = async () => {
        if (caption && videoAsset?._id && topic) {
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
                topic,
            };

            await axios.post("http://localhost:3000/api/post", doc)

            router.push('/');
        }
    };

    const handleDiscard = () => {
        setSavingPost(false);
        setVideoAsset(undefined);
        setDownloadURL('')
        setCaption('');
        setTopic('');
    };

    return (
        <div className='flex w-full h-full absolute left-0 top-[60px] lg:top-[70px] mb-10 pt-10 lg:pt-20 bg-[#F8F8F8] justify-center'>
            <div className='bg-white rounded-lg xl:h-[80vh] flex gap-6 flex-wrap justify-center items-center p-14 pt-6'>
                <div>
                    <div>
                        <p className='text-2xl font-bold'>Upload Video</p>
                        <p className='text-md text-gray-400 mt-1'>Post a video to your account</p>
                    </div>
                    <div className='border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center  outline-none mt-10 w-[260px] h-[458px] cursor-pointer hover:border-red-300 hover:bg-gray-100'>
                        {downloadURL && (
                            <>
                                <video
                                    src={downloadURL}
                                    controls
                                    controlsList='nodownload nofullscreen'
                                    loop
                                    autoPlay
                                    className='rounded-xl h-[460px]'
                                >
                                </video>
                            </>
                        )}
                    </div>
                    {wrongFileType && (
                        <p className='text-center text-xl text-red-400 font-semibold mt-4 w-[260px]'>
                            Please select an video file (mp4 or webm or ogg)
                        </p>
                    )}
                </div>
                <div className='h-[470px]'>
                    <Input
                        type="file"
                        placeholder="Select file to upload"
                        accept=""
                        className='w-[100%]'
                        onChange={(files) => {
                            handleSelectedFile(files.target.files)
                            uploadVideo(files)
                        }}
                    />

                    <Card className='w-[100%] h-[180px] mb-10'>
                        {imageFile && (
                            <>
                                <List.Item
                                    className='font-semibold w-full mb-5 flex flex-wrap justify-center items-center flex-col'
                                    extra={[
                                        <Button
                                            key="btnRemoveFile"
                                            onClick={(e:any) => {
                                                handleRemoveFile()
                                            }}
                                            type="text"
                                            icon={<i className="fas fa-times"></i>}
                                            className='bg-[#F51997] text-white text-md font-medium rounded w-28  outline-none flex justify-center mt-2'
                                        >
                                            Remove
                                        </Button>,
                                    ]}
                                >

                                    <List.Item.Meta
                                        title={imageFile.name}
                                        description={`Size: ${imageFile.size}`}
                                    />
                                </List.Item>
                                <div>
                                    <div className='flex justify-center items-center'>
                                        <Button
                                            loading={isUploading}
                                            type="primary"
                                            onClick={handleUploadFile}
                                            className='bg-[#F51997] text-white text-md font-medium rounded w-28  outline-none flex justify-center'
                                        >
                                            Upload
                                        </Button>
                                    </div>

                                    <Progress className='w-[100%] flex items-center mt-6 ml-3' percent={progressUpload} />
                                </div>

                            </>

                        )}

                    </Card>
                    <div className='flex flex-col gap-3 pb-10'>
                        <label className='text-md font-medium '>Caption</label>
                        <input
                            type='text'
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className='rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2'
                        />
                        <label className='text-md font-medium '>Choose a topic</label>

                        <select
                            onChange={(e) => {
                                setTopic(e.target.value);
                            }}
                            className='outline-none lg:w-650 border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer'
                        >
                            {topics.map((item) => (
                                <option
                                    key={item.name}
                                    className=' outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'
                                    value={item.name}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        <div className='flex gap-6 mt-10'>
                            <button
                                onClick={handleDiscard}
                                type='button'
                                className='border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
                            >
                                Discard
                            </button>
                            <button
                                disabled={videoAsset?.url ? false : true}
                                onClick={handlePost}
                                type='button'
                                className='bg-[#F51997] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
                            >
                                {savingPost ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Upload;