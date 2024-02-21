import React from 'react'
import { getUserInfo } from '../apis'
import { useSelector, useDispatch } from 'react-redux'
import { selectIsLogin, onLogin } from '../store/configure'

export enum AuthStatus {
  Loading = 'loading',
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated'
}

function useAuth() {
    // 检查redux登录态， 发送getUserInfo请求
    const [status, setStatus] = React.useState<AuthStatus>(AuthStatus.Loading)
    const isLogin = useSelector(selectIsLogin)
    const dispatch = useDispatch()
    
  React.useEffect(() => {
    if (isLogin) {
      setStatus(AuthStatus.Authenticated)
      return
    }
    const token = localStorage.getItem("token")
    if (!token) {
      setStatus(AuthStatus.Unauthenticated)
      return
    }
    (async () => {
      try {
        const { data: res } = await getUserInfo(token || '')
        if (res.errorCode != 1) {
          throw new Error(res.data.errorMessage)
        } else {
          res.data.token = token
          dispatch(onLogin(res.data))
          setStatus(AuthStatus.Authenticated)
        }
      } catch (error) {
        setStatus(AuthStatus.Unauthenticated)
      }
    })()
  })

  return status;
}

export default useAuth