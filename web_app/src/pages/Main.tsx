import React from 'react'
import useWebSocket, {ReadyState} from 'react-use-websocket'
import { Button } from 'antd'

function Main() {
    const [socketUrl, setSocketUrl] = React.useState('ws://localhost:3000/websocket/1')
    const [message, setMessage] = React.useState('')
    const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl)

    React.useEffect(() => {
        if (lastMessage !== null) {
            setMessage(lastMessage.data)
        }
    }, [lastMessage])

    const handleClickChangeSocketUrl = React.useCallback(
        () => setSocketUrl('wss://demos.kaazing.com/echo'),
        []
      );
    
      const handleClickSendMessage = React.useCallback(() => sendMessage('Hello'), []);
    
      const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }[readyState];
    

  return (
    <div className='flex flex-col'>
        Main
        {message}
        <Button onClick={handleClickSendMessage}>send hello</Button>
        <span>state: {connectionStatus}</span>
    </div>
  )
}

export default Main