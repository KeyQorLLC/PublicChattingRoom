import React from 'react'

interface Style {
  wrapper: string
  button: string
}

const style: Style = {
  wrapper: "flex justify-center",
  button: `w-[100px] bg-[#f2f2f4] px-4 py-2 hover:bg-gray-100 font-mono`
}

interface ChildProps {
    setisLogin: (value: boolean) => void
    setisRegister: (value: boolean) => void
    setisUser: (value: boolean) => void
}


const SignIn: React.FC<ChildProps> = ({ setisLogin, setisRegister, setisUser }) => {
    const handleLogin = () => {
        setisLogin(true)
        setisRegister(false)
    }
    return (
        <button onClick={handleLogin} className={style.button}>
            Login
        </button>
    )
}

export default SignIn