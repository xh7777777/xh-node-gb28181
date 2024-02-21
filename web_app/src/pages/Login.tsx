import React from 'react'

function Login() {
  return (
    <div className='h-screen w-screen flex justify-center align-center'>
      <div className=' w-4/5 md:w-80 bg-slate-200 rounded-lg block'>
        <h1 className='text-3xl text-center'>Login</h1>
          {/* <form action="submit">
            <input type="text" placeholder="username" />
            <input type="password" placeholder="password" />
            <input type="submit" value="login" className="bg-slate-300 rounded-lg w-full h-10 text-white" />
          </form> */}
      </div>
    </div>
  )
}

export default Login