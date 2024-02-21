import React from 'react'
import {useRequest} from 'ahooks'
import { getPlatformConfig, getUserInfo } from '../apis'
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../store/configure';

function Config() {
  const token = useSelector(selectAccessToken);
  const { data, error, loading } = useRequest(async () => await getPlatformConfig(token));
  console.log(data, error, loading)

  return (
    <div>Config</div>
  )
}

export default Config