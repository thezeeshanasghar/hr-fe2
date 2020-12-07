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
// import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import InputLabel from '@material-ui/core/InputLabel';
import { colors, Icon, Input, MuiThemeProvider } from '@material-ui/core';
//  import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import SimpleReactValidator from 'simple-react-validator';
import defaultUrl from "../../../app/services/constant/constant";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import $ from 'jquery';
import DataTable from "datatables.net";
import * as responsive from "datatables.net-responsive";
import Messages from '../toaster';
import { ToastContainer, toast } from 'react-toastify';

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
function createData(Code, Description) {
	id += 1;
	return { Code, Description };
}

const rows = [
	createData("Code", "Description")
];

class Unit extends Component {
	state = {
		value: 0,
		code: "",
		description: "",
		companyId: "",
		Companies: [],
		Units: [],
		Id: 0,
		Action: 'Insert Record',
		table:null

	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();
		 this.SelectedIds=[];
	}

	componentDidMount() {
		localStorage.removeItem("ids");
		this.getUnitDetail();
		this.getCompanyDetail();
	}

	handleTab = (event, value) => {
		this.setState({ value });
	};
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	getUnitDetail = () => {
				
		if (!$.fn.dataTable.isDataTable('#unit_Table')) {
			this.state.table = $('#unit_Table').DataTable({
				ajax: defaultUrl + "unit",
				"columns": [
					{ "data": "Code" },
					{ "data": "Name" },
					{ "data": "Action",
					sortable: false,
					"render": function ( data, type, full, meta ) {
					   
						return `<input type="checkbox" name="radio"  value=`+full.Id+`
						onclick=" const checkboxes = document.querySelectorAll('input[name=radio]:checked');
									let values = [];
									checkboxes.forEach((checkbox) => {
										values.push(checkbox.value);
									});
									localStorage.setItem('ids',values);
									"
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

	insertUpdateRecord = () => {
		if (!this.validator.allValid()) {
			console.log("false");
			this.validator.showMessages();
			this.forceUpdate();
			return false;
		}
		console.log("true");
		//   this.setState({bankName:'',bankCode:'',bankAddress:''})
		var method = "post";
		var url = defaultUrl + "unit";
		if (this.state.Action != "Insert Record") {
			method = "put";
			url = defaultUrl + "unit/" + this.state.Id;
		}


		var obj = {
			Code: this.state.code,
			Description: this.state.description,
			CompanyId: this.state.companyId
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
				
				this.getUnitDetail();

				this.setState({
					value: 0,
					code: "",
					description: '',
					companyId: 0,
					Action: 'Insert Record',
					Id: 0,
					value:0
				});
				//document.getElementById("fuse-splash-screen").style.display="none";
				Messages.success();

			})
			.catch((error) => {
				console.log(error);
				this.setState({
					code: "",
					description: '',
					Action: 'Insert Record',
					Id: 0,
					value:0
				})
				//document.getElementById("fuse-splash-screen").style.display="none";
				Messages.error();

			})
	}

	deleteUnit = () => {
		var ids=localStorage.getItem("ids");
		if(ids===null)
		{
		Messages.warning("No Record Selected");
		return false;
		}
		//document.getElementById("fuse-splash-screen").style.display="block";

		axios({
			method: "delete",
			url: defaultUrl + "unit/"+ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				localStorage.removeItem("ids");
				this.getUnitDetail();
				//document.getElementById("fuse-splash-screen").style.display="none";
				Messages.success();

			})
			.catch((error) => {
				console.log(error);
				//document.getElementById("fuse-splash-screen").style.display="none";
				Messages.error();

			})
	}
	getUnitById = () => {
		let ids = localStorage.getItem("ids")
		if(ids=== null || localStorage.getItem("ids").split(",").length>1)
		{
			Messages.warning("kindly Select one record");
			return false;
		}
		//document.getElementById("fuse-splash-screen").style.display="block";

		axios({
			method: "get",
			url: defaultUrl + "unit/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ Action: 'Update Record', value: 1, code: response.data[0].Code, description: response.data[0].Description, Id: response.data[0].Id,companyId:response.data[0].CompanyId });
				//document.getElementById("fuse-splash-screen").style.display="none";

			})
			.catch((error) => {
				console.log(error);
				//document.getElementById("fuse-splash-screen").style.display="none";

			})
	}
	getCompanyDetail = () => {
		axios({
			method: "get",
			url: defaultUrl + "company",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ Companies: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	render() {
		const { classes, theme } = this.props;

		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24"><h4>Unit</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New Unit</h4></div>
				}
				content={

					<div className={classes.root}>
						<div>
							<ToastContainer />
						</div>
						<AppBar position="static" color="default">
							<Tabs
								value={this.state.value}
								onChange={this.handleTab}
								indicatorColor="primary"
								textColor="primary"
								variant="fullWidth"
							>
								<Tab label="View" />
								<Tab label="Add New" />
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
										<Button variant="outlined" color="primary" className={classes.button} onClick={this.getUnitById}>
											Edit
										</Button>
									</div>
									<div style={{ float: "left", "marginLeft": "8px", "marginTop": "8px" }}>
										<Button variant="outlined" color="inherit" className={classes.button} onClick={this.deleteUnit}>
											Delete
										</Button>
									</div>
								</div>
									<table id="unit_Table" className="nowrap header_custom" style={{ "width": "100%" }}>
										<thead>
											<tr>
												<th>Code</th>
												<th>Name</th>
												<th>Action</th>

											</tr>
										</thead>

									</table>
								</Paper>
							</TabContainer>
							<TabContainer dir={theme.direction}>
								<form className={classes.container} noValidate autoComplete="off">

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="code" fullWidth label="Unit Code" name="code" value={this.state.code} onChange={this.handleChange} />
										{this.validator.message('code', this.state.code, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField id="description" fullWidth label="Description" name="description" value={this.state.description} onChange={this.handleChange} />
										{this.validator.message('decription', this.state.description, 'required')}
									</Grid>

									<Grid item xs={12} sm={5} >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="company">Company</InputLabel>
											<Select
												value={this.state.companyId}
												onChange={this.handleChange}
												inputProps={{
													name: 'companyId',
													id: 'companyId',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>

												{this.state.Companies.map(row => (
													<MenuItem value={row.Id}>{row.CompanyName}</MenuItem>
												))}
											</Select>
										</FormControl>
									</Grid>


								</form>
								<div className="row">
									<div style={{ float: "right", "marginRight": "8px" }}>

										<Button variant="outlined" color="secondary" className={classes.button} onClick={this.insertUpdateRecord}>
											{this.state.Action}
										</Button>
									</div>
								</div>
							</TabContainer>
						</SwipeableViews>
					</div>
				}
			/>
		)
	}
}

export default withStyles(styles, { withTheme: true })(Unit);