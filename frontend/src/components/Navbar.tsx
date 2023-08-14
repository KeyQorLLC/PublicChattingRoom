import React from 'react'
import SignIn from './SignIn'
import LogOut from './LogOut'
import RegisterButton from './RegisterBotton'
import SmallIcon from '../assets/smallIcon.png'

interface Style {
    nav: string
    doublenav: string
    heading: string
}

const style: Style = {
    nav: "bg-[#f2f2f4] h-20 flex justify-between items-center p-4",
    doublenav: "w-1/2 flex flex-row-reverse",
    heading: "font-mono text-[#171618] text-3xl mt-1/2 pl-3",
}

interface ChildProps {
    isLogin: boolean
    setisLogin: (value: boolean) => void
    isRegister: boolean
    setisRegister: (value: boolean) => void
    isUser: boolean
    setisUser: (value: boolean) => void
    setsessionUsername: (value: string) => void
}

const Navbar: React.FC<ChildProps> = ({ isLogin, setisLogin, isRegister, setisRegister, isUser, setisUser, setsessionUsername }) => {
    const handleIcon = () => {
        setisLogin(false)
        setisRegister(false)
    }
    return (
      <div className={style.nav}>
        <div className='flex flex-row text-center'>
            <div className="object-scale-down w-10 h-10 cursor-pointer" onClick={handleIcon}>
                <img src={SmallIcon} alt="logo" />
            </div>
            <h1 className={style.heading}>ChatApp</h1>
        </div>
        <div className={style.doublenav}>
            {!isUser && !isRegister ? <RegisterButton setisLogin={setisLogin} setisRegister={setisRegister}/> : null}
            {isUser ? <LogOut setisLogin={setisLogin} setisRegister={setisRegister} setisUser={setisUser} setsessionUsername={setsessionUsername}/> : 
            isLogin ? null : <SignIn setisLogin={setisLogin} setisRegister={setisRegister} setisUser={setisUser}/>}
        </div>
      </div>
    )
}

export default Navbar