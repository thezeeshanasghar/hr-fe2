import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getWidgets = createAsyncThunk('Dashboard/widgets/getWidgets', async () => {
	const response = await axios.get('/api/project-dashboard-app/widgets');
	const data = await response.data;

	return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgets, selectById: selectWidgetById } = widgetsAdapter.getSelectors(
	state => state.Dashboard.widgets
);

const widgetsSlice = createSlice({
	name: 'Dashboard/widgets',
	initialState: widgetsAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getWidgets.fulfilled]: widgetsAdapter.setAll
	}
});

export default widgetsSlice.reducer;
