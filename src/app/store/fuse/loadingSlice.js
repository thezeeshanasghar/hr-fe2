import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
	name: 'loading',
	initialState: {
		state: false,
	},
	reducers: {
		showLoading: (state, action) => {
			state.state = true;
		},
		hideLoading: (state, action) => {
			state.state = false;
		}
	}
});

export const { showLoading, hideLoading } = loadingSlice.actions;

export default loadingSlice.reducer;