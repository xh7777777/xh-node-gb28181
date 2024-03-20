import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserInfo } from "../../apis";

export const fetchUserInfo = createAsyncThunk("/user/info", async (token:string) => {
  const res = await getUserInfo(token);
  return res.data;
});

export const userSlice = createSlice({
  name: "userInfo",
  initialState: {
    accessToken: "",
    username: "请先登录",
    user_type: 0,
    isLogin: false,
  },
  reducers: {
    onLogin: (state, action) => {
      state.accessToken = action.payload.token;
      state.username = action.payload.username;
      state.isLogin = true;
      state.user_type = action.payload.level;
    },
    onLogout: (state, action) => {
      (state.accessToken = ""),
        (state.isLogin = false);
      state.username = "请先登录";
      state.user_type = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.isLogin = true;
        state.username = action.payload.data.username;
        state.user_type = action.payload.data.type;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.isLogin = false;
      });
  },
});

export const { onLogin,  onLogout } =
  userSlice.actions;

export const selectIsLogin = (state:any) => state.userInfo.isLogin;

export const selectAccessToken = (state:any) => state.userInfo.accessToken;

export const selectUsername = (state:any) => state.userInfo.username;

export const selectUserType = (state:any) => state.userInfo.user_type;

export default userSlice.reducer;
