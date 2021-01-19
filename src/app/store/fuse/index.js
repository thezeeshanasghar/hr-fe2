import { combineReducers } from '@reduxjs/toolkit';
import dialog from './dialogSlice';
import loading from './loadingSlice';
import message from './messageSlice';
import navbar from './navbarSlice';
import navigation from './navigationSlice';
import settings from './settingsSlice';

const fuseReducers = combineReducers({
	navigation,
	settings,
	navbar,
	message,
	dialog,
	loading
});

export default fuseReducers;
