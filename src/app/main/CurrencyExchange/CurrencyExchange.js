
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { Icon, Input, MuiThemeProvider} from '@material-ui/core';
import SimpleReactValidator from 'simple-react-validator';
import axios from "axios";
import {Lookups} from '../../services/constant/enum'
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import defaultUrl from "../../services/constant/constant";
import Messages from '../toaster';
import { ToastContainer, toast } from 'react-toastify';


import $ from 'jquery';
import DataTable from "datatables.net";
import * as responsive from "datatables.net-responsive";

const styles = theme => ({

	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,

	},
	dense: {
		marginTop: 16,
	},
	menu: {
		width: 200,
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: "99%",
	}
});

const CustomTableCell = withStyles(theme => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
	},
}))(TableCell);
function TabContainer({ children, dir }) {
	return (
		<Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
			{children}
		</Typography>
	);
}
let id = 0;
function createData(Currency, Rate, ToCurrency, EffectiveDate) {
	id += 1;
	return { Currency, Rate, ToCurrency, EffectiveDate };
}

const rows = [
	createData('$', 165, 'PKR', '07/23/2020')

];

class CurrencyExchange extends Component {
	state = {
		value: 0,
		currency:"",
		toCurrency:"",
		rate:"",
		effectiveDate:"",
		CurrencyList:[],
		Action:"Insert Record",
		Id:0,
		ExchangeRate:[]
	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();

	}
	componentDidMount() {
		localStorage.removeItem("ids");
		this.getCurrency();
		this.getExchangeRate();
	}
	InsertUpdateExchange=()=>{
			if (!this.validator.allValid()) {
				this.validator.showMessages();
				this.forceUpdate();
			} else {
				var method = "post";
				var url = defaultUrl+"Currency";
				if(this.state.Action !="Insert Record")
				{
					 method = "put";
					 url = defaultUrl+"Currency/"+this.state.Id;
				}
				// console.log(this.state.company,this.state.employee,this.state.dateFrom,this.state.dateTo);
				var obj = {
					Currency: this.state.currency,
					ToCurrency: this.state.toCurrency,
					Rate: this.state.rate,
					EffectiveDate: this.state.effectiveDate
				};
				axios.interceptors.request.use(function (config) {
					//document.getElementById("fuse-splash-screen").style.display="block";
					return config;
				}, function (error) {
					console.log('Error');
					return Promise.reject(error);
				});
				axios({
					method: method,
					url: url,
					data: JSON.stringify(obj),
					headers: {
						// 'Authorization': `bearer ${token}`,
						"Content-Type": "application/json;charset=utf-8",
					},
				})
					.then((response) => {
						toast.success('Operation successfull');
						this.getExchangeRate();
						this.setState({
							currency: "",
							toCurrency: "",
							rate: "",
							effectiveDate: "",
							Action:"Insert Record",
							Id:0,
							value:0
						});
						//document.getElementById("fuse-splash-screen").style.display="none";
						Messages.success();
					})
					.catch((error) => {
						console.log(error);
						toast.error('Operation unsuccessfull');
						this.setState({
							currency: "",
							toCurrency: "",
							rate: "",
							effectiveDate: "",
							Action:"Insert Record",
							Id:0,
							value:0
						})
						//document.getElementById("fuse-splash-screen").style.display="none";
						Messages.error();
					})
	
	
			}
		
	}
	getCurrency = () => {
		axios({
			method: "get",
			url: defaultUrl+"lookups/"+Lookups.Currency,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ CurrencyList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getExchangeRate = () => {
		localStorage.removeItem("ids");
		if (!$.fn.dataTable.isDataTable('#Currency_Table')) {
			this.state.table = $('#Currency_Table').DataTable({
				ajax: defaultUrl + "Currency",
				"columns": [
					{ "data": "CurrencyName" },
					{ "data": "ToCurrencyName" },
					{ "data": "Rate" },
					{ "data": "EffectiveDate"},
					{ "data": "Action",
					sortable: false,
					"render": function ( data, type, full, meta ) {
					   
						return `<input type="checkbox" name="radio"  value=`+full.Id+`
						onclick=" const checkboxes = document.querySelectorAll('input[name=radio]:checked');
									let values = [];
									checkboxes.forEach((checkbox) => {
										values.push(checkbox.value);
									});
									localStorage.setItem('ids',values);	"
						/>`;
					}
				 }

				],
				rowReorder: {
					selector: 'td:nth-child(2)'
				},
				responsive: true,
				dom: 'Bfrtip',
				buttons: [

				],
				columnDefs: [{
					"defaultContent": "-",
					"targets": "_all"
				  }]
			});
		} else {
			this.state.table.ajax.reload();
		}
	}

	getExchangeById=()=>{
		
		var ids=localStorage.getItem("ids");
		if(ids===null)
		{
		Messages.warning("No Record Selected");
		return false;
		}
		//document.getElementById("fuse-splash-screen").style.display="block";
		axios({
			method: "get",
			url:  defaultUrl+"Currency/"+ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({
				currency:response.data[0].Currency,
				toCurrency:response.data[0].ToCurrency,
				rate:response.data[0].Rate,
				effectiveDate:moment(response.data[0].EffectiveDate).format('YYYY-MM-DD'),
				Action:"Update Record",
				Id:response.data[0].Id,
				value:1
				});
				//document.getElementById("fuse-splash-screen").style.display="none";
			})
			.catch((error) => {
				//document.getElementById("fuse-splash-screen").style.display="none";
				console.log(error);
			})
	}
	deleteExchange=()=>{
		let ids = localStorage.getItem("ids");
		if(ids=== null || localStorage.getItem("ids").split(",").length>1)
		{
			Messages.warning("kindly Select one record");
			return false;
		}
		//document.getElementById("fuse-splash-screen").style.display="block";
		axios({
			method: "delete",
			url:  defaultUrl+"Currency/"+ids,
			headers: {
			  // 'Authorization': `bearer ${token}`,
			  "Content-Type": "application/json;charset=utf-8",
			},
		  })
			.then((response) => {
				
				this.getExchangeRate();
				//document.getElementById("fuse-splash-screen").style.display="none";
				Messages.success();
			})
			.catch((error) => {
				//document.getElementById("fuse-splash-screen").style.display="none";
				console.log(error);
				Messages.error();
			})
	  }

	getCurrentDate(separator='-'){

		let newDate = new Date()
		let date = newDate.getDate();
		let month = newDate.getMonth() + 1;
		let year = newDate.getFullYear();
		
		return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
	}
	
	handleTabChange = (event, value) => {
		this.setState({ value });
		this.setState({ [event.target.name]: event.target.value });

	};
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};
	render() {
		const { classes, theme } = this.props;

		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24"><h4>Currency-Exchange</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New Currency-Exchange</h4></div>
				}
				content={

					<div className={classes.root}>
						<div>
        <ToastContainer />
      </div>
						<AppBar position="static" color="default">
							<Tabs
								value={this.state.value}
								onChange={this.handleTabChange}
								indicatorColor="primary"
								textColor="primary"
								variant="fullWidth"
							>
								<Tab label="View" />
								<Tab label="Add New Currency-Rate" />
							</Tabs>
						</AppBar>
						<SwipeableViews
							axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
							index={this.state.value}
							onChangeIndex={this.handleChangeIndex}
						>
							<TabContainer dir={theme.direction}>
								<Paper className={classes.root}>
								<div className="row">
									<div style={{ float: "left", "marginLeft": "8px", "marginTop": "8px" }}>
										<Button variant="outlined" color="primary" className={classes.button} onClick={this.getExchangeById}>
											Edit
										</Button>
									</div>
									<div style={{ float: "left", "marginLeft": "8px", "marginTop": "8px" }}>
										<Button variant="outlined" color="inherit" className={classes.button} onClick={this.deleteExchange}>
											Delete
										</Button>
									</div>
								</div>
								<table id="Currency_Table" className="nowrap header_custom" style={{ "width": "100%" }}>
										<thead>
											<tr>
												<th>CurrencyName</th>
												<th>ToCurrencyName</th>
												<th>Rate</th>
												<th>EffectiveDate</th>
												<th>Action</th>
											</tr>
										</thead>
									</table>
								</Paper>
							</TabContainer>
							<TabContainer dir={theme.direction}>
					
								<form className={classes.container} noValidate autoComplete="off">
							
									<Grid item xs={12} sm={5}  style={{marginRight:'5px'}} >
									<FormControl className={classes.formControl}>
										<InputLabel htmlFor="currency">Currency</InputLabel>
										<Select
											value={this.state.currency}
											onChange={this.handleChange}
											inputProps={{
												name: 'currency',
												id: 'currency',
											}}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											{this.state.CurrencyList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
										</Select>
										{this.validator.message('currency', this.state.currency, 'required')}

									</FormControl>
									</Grid>
									<Grid item xs={12} sm={5}   >
									<FormControl className={classes.formControl}>
										<InputLabel htmlFor="toCurrency">To Currency</InputLabel>
										<Select
											value={this.state.toCurrency}
											onChange={this.handleChange}
											inputProps={{
												name: 'toCurrency',
												id: 'toCurrency',
											}}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											{this.state.CurrencyList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
										</Select>
										{this.validator.message('toCurrency', this.state.toCurrency, 'required')}

									</FormControl>
									</Grid>
									<Grid item xs={12} sm={5}  style={{marginRight:'5px'}} >
									<TextField
										id="rate"
										label="rate"
										type="number"
										value={this.state.rate}
										fullWidth
										name="rate"
										onChange={this.handleChange}
									/>
									{this.validator.message('rate', this.state.rate, 'required')}

									</Grid>
									<Grid item xs={12} sm={5}  >
								
									<TextField id="effectiveDate" fullWidth label="Effective Date" type="date" name="effectiveDate"  value={this.state.effectiveDate}  onChange={this.handleChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
									{this.validator.message('effectiveDate', this.state.effectiveDate, 'required')}

									</Grid>
							
								</form>
								<div className="row">
								<Grid item xs={12} sm={10}  >
									<div style={{ float: "right", "marginRight": "8px", "marginTop": "2px", "marginBottom": "2px" }}>

										<Button variant="outlined" color="secondary" className={classes.button} onClick={this.InsertUpdateExchange} >
											{this.state.Action}
      								</Button>
									</div>
									</Grid>
								</div>
							</TabContainer>
						</SwipeableViews>
					</div>
				}
			/>
		)
	}
}

export default withStyles(styles, { withTheme: true })(CurrencyExchange);