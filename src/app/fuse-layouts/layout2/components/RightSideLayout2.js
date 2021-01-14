import QuickPanel from 'app/fuse-layouts/shared-components/quickPanel/QuickPanel';
import React,{useState,useEffect,Component } from 'react';
import RightPanel from './../../../store/RightPanel';
import {saveState,loadState} from './../../../store/StoreState';
import { createStore } from 'redux'
import axios from "axios";
import defaultUrl from "./../../../services/constant/constant";
<<<<<<< HEAD
import { Redirect } from "react-router-dom";
=======
import { useHistory } from "react-router-dom";
>>>>>>> 30bc94c96751b2f679d3b6d69f24f6a968df7327
const store = createStore(RightPanel)
console.log(store.getState());

class RightSideLayout2 extends Component {
	// const [companies,SetCompanies] = useState(0);

	state={
		Companies:[],
		clicked:false,
		redirect:false
	}
	constructor(props) {
		super(props);
		
	}
	componentDidMount() {
<<<<<<< HEAD
	
=======
	this.setState({redirect:false});
>>>>>>> 30bc94c96751b2f679d3b6d69f24f6a968df7327
		this.GetCompanies();
	}
	 GetCompanies=()=>{
		axios({
			method: "get",
			url: defaultUrl + "company/" ,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.setState({Companies:response.data.data})
				//Companies= response.data.data //SetCompanies({companies:response.data.data});
			})
			.catch((error) => {
			
			})
	}

<<<<<<< HEAD
	 clicked=(Id)=>{
		const store = createStore(RightPanel, Id)
		this.setState({redirect:true})

	}
	render(){
		if (this.state.redirect) {
		
			return <Redirect to="/" />
		}
=======
	 clicked=(Id,Name)=>{
		const store = createStore(RightPanel, {Id:Id,Company:Name})
		window.open("/","_self")
	}
	render(){
		
		// if (this.state.redirect) {
		
		// 	return <Redirect to="/" />
		// }
>>>>>>> 30bc94c96751b2f679d3b6d69f24f6a968df7327
		return(
		<div>
		<QuickPanel companies={this.state.Companies}  clicked={this.clicked} />
		</div>	
		)
		

	} 
}

export default React.memo(RightSideLayout2);
