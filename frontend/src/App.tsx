import React, { useState } from 'react'
import Navbar from './components/Navbar'
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'
import Chat from './components/Chat'
import Icon from './assets/Icon.png'

interface Style {
  appContainer: string
  sectionContainer: string
  registerContainer: string
}

const style: Style = {
  appContainer: "max-w-[1024px] mx-auto text-center",
  sectionContainer: "flex flex-col h-[90vh] bg-[#f9d7e4] mt-10 shadow-xl border relative",
  registerContainer: "flex flex-col justify-center h-[90vh] bg-[#f9d7e4] shadow-xl border relative"
}

const App: React.FC = () => {
  const [isLogin, setisLogin] = useState<boolean>(false)
  const [isRegister, setisRegister] = useState<boolean>(false)
  const [isUser, setisUser] = useState<boolean>(false)
  const [sessionUsername, setsessionUsername] = useState<string>("")

  return (
    <div className={style.appContainer}>
      <section className={style.sectionContainer}>
        {/* NavBar */}
        <Navbar 
          isLogin={isLogin} 
          setisLogin={setisLogin}
          isRegister={isRegister}
          setisRegister={setisRegister}
          isUser={isUser}
          setisUser={setisUser}
          setsessionUsername={setsessionUsername}
        />
        {/* Chat component */}
          {isRegister ? 
            <div className={style.registerContainer}>
              <RegisterForm setisRegister={setisRegister}/>
            </div> 
          : null}
          {isLogin ?
            <div className={style.registerContainer}>
              <LoginForm setisLogin={setisLogin} setisUser={setisUser} setsessionUsername={setsessionUsername}/>
            </div> 
          : null}
          {isUser ?
          <div>
            <Chat setisUser={setisUser} sessionUsername={sessionUsername} setsessionUsername={setsessionUsername}/>
          </div>
          : null}
          {!isUser && !isLogin && !isRegister ?
            <div className="flex flex-col h-full justify-center bg-[#f9d7e4]">
              <div className="h-1/4 w-1/2 max-w-md mx-auto mb-10 bg-[#f5f5dc] text-[#171618] p-8 pt-0 rounded-lg shadow-lg">
                <div className='mt-[80px]'>
                  <img src={Icon} alt="icon"></img>
                </div>
              </div>
            </div>
          : null}
      </section>
    </div>
  )
}

export default App
