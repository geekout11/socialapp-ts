/* BASIC */
import { useState } from 'react'
import Discover from './Discover';
import SuggestedAccounts from './SuggestedAccounts';
import Footer from './Footer';

/* NEXT */
import Link from 'next/link'

/* ICONS */
import { AiFillHome, AiOutlineMenu } from 'react-icons/ai'
import { ImCancelCircle } from 'react-icons/im'

const Sidebar = ({ allUsers, fetchAllUsers }: any) => {
    const [showSidebar, setShowSidebar] = useState(true);

    const normalLink = 'flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold text-[#F51997] rounded'

    return (
        <div>
            <div className='block xl:hidden m-2 ml-4 mt-4 text-xl px-3 cursor-pointer' onClick={() => setShowSidebar((prev) => !prev)}>
                {showSidebar ? <ImCancelCircle /> : <AiOutlineMenu />}
            </div>
            {showSidebar && (
                <div className='xl:w-400 w-20 flex flex-col justify-start mb-10 mt-3 border-r-2 border-gray-100 px-4'>

                    <div className='xl:border-b-2 border-gray-200 xl:pb-4'>
                        <Link href='/'>
                            <div className={normalLink}>
                                <p className='text-2xl'>
                                    <AiFillHome />
                                </p>
                                <span className='text-xl hidden xl:block'>
                                    For You
                                </span>
                            </div>
                        </Link>
                    </div>

                    <Discover />
                    <SuggestedAccounts fetchAllUsers={fetchAllUsers}
                        allUsers={allUsers} />
                    <Footer />
                </div>
            )}
        </div>
    )
}


export default Sidebar;