import { useState } from "react";

const style = {
    form: `font-mono h-14 w-full max-w-[1024px] flex text-xl absolute bottom-0`,
    input: `font-mono w-full text-xl p-3 bg-[#f2f2f4] text-black outline-none border-none`,
    button: `font-mono w-[20%] bg-[#f5f5dc]`,
};

interface ChildProps {
    sessionUsername: string
}

const SendMessage: React.FC<ChildProps> = ({ sessionUsername }) => {
    const [input, setInput] = useState("")

    const sendMessage = async (e: any) => {
        e.preventDefault()
        if (input === '') {
            alert('Please enter a valid message')
            return
        }
        const username = sessionUsername
        try {
            const response = await fetch("http://localhost:8080/message/send", {
                method: 'POST',
                body: JSON.stringify({
                    id: 0,
                    text: input,
                    username: sessionUsername,
                    upvote: 0,
                    downvote: 0
                }),
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
                setInput("")
                console.log(data)
            })
        } catch (error) { 
            console.error('Error sending data:', error)
        }
    }
    return (
    <form onSubmit={sendMessage} className={style.form}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={style.input}
        type='text'
        placeholder='Message'
      />
      <button className={style.button} type='submit'>
        Send
      </button>
    </form>
  );
}

export default SendMessage