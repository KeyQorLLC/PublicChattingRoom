interface Style {
    button: string
}

const style: Style = {
    button: `w-[100px] bg-[#f2f2f4] px-4 py-2 hover:bg-gray-100 font-mono`
}

interface ChildProps {
    setisLogin: (value: boolean) => void
    setisRegister: (value: boolean) => void
}
  
const RegisterButton: React.FC<ChildProps> = ({ setisLogin, setisRegister }) => {
    const handleregister = () => {
        setisLogin(false)
        setisRegister(true)
    }
  
    return (
      <button onClick={handleregister} className={style.button}>
        Register
      </button>
    )
  }
  
  export default RegisterButton