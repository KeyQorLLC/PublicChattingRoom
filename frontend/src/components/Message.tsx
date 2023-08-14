import { useState } from 'react'
import { HiOutlineThumbUp, HiThumbUp, HiOutlineThumbDown, HiThumbDown} from 'react-icons/hi'

interface ChildProps {
    id: number
    sessionUsername: string
    username: string
    message: string
    upvote: number
    downvote: number
}

const style = {
    message: `relative font-mono flex items-center shadow-xl m-6 py-2 px-3 rounded-tl-full rounded-tr-full`,
    name: `font-mono absolute mt-[-4rem] text-gray-600 text-xs`,
    sent: `font-mono bg-[#f5f5dc] text-black flex-row-reverse text-end float-right rounded-bl-full`,
    received: `font-mono bg-[#d4a6d9] text-black float-left rounded-br-full`,
  };


const Message: React.FC<ChildProps> =  ({ id, sessionUsername, username, message, upvote, downvote }) => {
    const [isUpvote, setisUpvote] = useState(false)
    const [isDownvote, setisDownvote] = useState(false)
    const messageClass = username === sessionUsername ? `${style.sent}` : `${style.received}`

    const handleUpvote = async (e: any) => {
        e.preventDefault()
        try {
            var baseUrl : string = "http://localhost:8080/message/upvote/"
            var endUrl = baseUrl.concat(id.toString())
            const response = await fetch(endUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain',
                    'Accept': '*/*'
                },
            })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText)
                }
                return response.json()
            })
            .then((data) => {
                setisUpvote(true)
                console.log(data)
            })
        } catch (error) { 
            console.error('Error sending data:', error)
        }
    }

    const handleDownvote = async (e: any) => {
        e.preventDefault()
        try {
            var baseUrl : string = "http://localhost:8080/message/downvote/"
            var endUrl = baseUrl.concat(id.toString())
            const response = await fetch(endUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain',
                    'Accept': '*/*'
                },
            })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText)
                }
                return response.json()
            })
            .then((data) => {
                setisDownvote(true)
                console.log(data)
            })
        } catch (error) { 
            console.error('Error sending data:', error)
        }
    }

    return (
        <div>
            <div className={`${style.message} ${messageClass}`}>
                <p className={style.name}>{username}</p>
                <p>{message}</p>
                <div className="absolute mt-[+4rem] flex flex-row cursor-pointer">
                    {isUpvote ?
                        <>
                            <HiThumbUp />
                            <p>{upvote}</p>
                        </>
                        : 
                        <>
                            <HiOutlineThumbUp onClick={handleUpvote}/>
                            <p>{upvote}</p>
                        </>}
                    {isDownvote ?
                        <>
                            <HiThumbDown />
                            <p>{downvote}</p>
                        </>
                        : 
                        <>
                            <HiOutlineThumbDown onClick={handleDownvote}/>
                            <p>{downvote}</p>
                        </>}
                </div>
            </div>
        </div>
    )
}

export default Message