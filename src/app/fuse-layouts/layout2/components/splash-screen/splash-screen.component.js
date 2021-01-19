import React from 'react';
import './splash.styles.css';
import { connect } from 'react-redux';

const Splash = (props) =>{
	console.log(props.loading.state);
	if(!props.loading.state){ return null;}

	else if(props.loading.state){	return(
	<div className="loading-container"><div className="lds-ripple"><div></div><div></div></div></div>
);
	}
}

const mapStateToProps = state =>({
	loading: state.fuse.loading
})

export default connect(mapStateToProps)(Splash);
