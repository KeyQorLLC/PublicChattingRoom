interface Style {
    button: string
}

const style: Style = {
    button: `w-[100px] bg-[#f2f2f4] px-4 py-2 hover:bg-gray-100 font-mono`
}

interface ChildProps {
    setisLogin: (value: boolean) => void
    setisRegister: (value: boolean) => void
    setisUser: (value: boolean) => void
    setsessionUsername: (value: string) => void
}
  
const LogOut: React.FC<ChildProps> = ({ setisLogin, setisRegister, setisUser, setsessionUsername }) => {
    const handleLogout = () => {
        setisLogin(false)
        setisRegister(false)
        setisUser(false)
        setsessionUsername("")
    }
  
    return (
      <button onClick={handleLogout} className={style.button}>
        Logout
      </button>
    )
  }
  
  export default LogOut