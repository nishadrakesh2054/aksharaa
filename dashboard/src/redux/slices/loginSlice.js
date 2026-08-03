import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: { loggedInUser: { resolved: false, user: null } },
  reducers: {
    setLoggedInUser(state, action) {
      state.loggedInUser.user = action.payload;
      state.loggedInUser.resolved = true;
    },
    setResolved(state, action) {
      state.loggedInUser.resolved = action.payload;
    },
  },
});

export const loginActions = loginSlice.actions;
export default loginSlice.reducer;
