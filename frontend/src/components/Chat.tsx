import { useEffect, useRef, useState } from "react"
import Message from "./Message"
import SendMessage from "./SendMessage"

interface ChildProps {
    setisUser: (value: boolean) => void
    sessionUsername: string
    setsessionUsername: (value: string) => void
}

const Chat: React.FC<ChildProps> =  ({ setisUser, sessionUsername, setsessionUsername }) => {
    const messageEl = useRef(null)
    const [messages, setMessages] = useState<any[]>([])
    const scroll = useRef(null)

    useEffect(() => {
        if (messageEl) {
            const current : any = messageEl.current
            current.addEventListener('DOMNODEInserted', (e: any) => {
                const { currentTarget: target } = e;
                target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            })
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/message/getall", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'text/plain',
                        'Accept': '*/*'
                    },
                })
                .then((response) => {
                    if (!response.ok) {
                        setisUser(false)
                        setsessionUsername("")
                        throw Error(response.statusText)
                    }
                    return response.json()
                })
                .then((data) => {
                    setMessages(data)
                    console.log(data)
                })
            } catch (error) { 
                console.error('Error sending data:', error)
            }
        }
        fetchData()
            .catch(console.error)
    })

    return (
        <>
            <main className={`flex flex-col p-[10px] overflow-y-scroll max-h-[900px]`} ref={messageEl}>
                {messages && messages.map((message) => (
                    <Message id={message.id} sessionUsername={sessionUsername} username={message.username} message={message.text} upvote={message.upvote} downvote={message.downvote} />
                ))}
            </main>
            <SendMessage sessionUsername={sessionUsername} />
            <span ref={scroll}></span>
        </>
    )
}

export default Chat