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
import { Icon, Input, MuiThemeProvider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import SimpleReactValidator from 'simple-react-validator';
import defaultUrl from "../../../app/services/constant/constant";
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
function createData(Unit, Job, Code, Title) {
	id += 1;
	return { Unit, Job, Code, Title };
}

const rows = [
	createData("Unit", "Job", "Code", "Title")
];

class Position extends Component {
	state = {
		value: 0,
		labelWidth: 0,
		Units: [],
		unitId: "",
		jobId: "",
		companyId: "",
		code: '',
		title: '',
		Positions: [],
		Id: 0,
		Action: 'Insert Record',
		table: null,
		Companies:[],
		jobList:[],
		Default:localStorage.getItem("state")!=null?JSON.parse(localStorage.getItem("state")):null
	};

	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();
		this.SelectedIds = [];
		this.getCompanies();
		this.getJobs();
	}
	getJobs = () => {
		axios({
			method: "get",
			url: defaultUrl+"job",
			headers: {
			  // 'Authorization': `bearer ${token}`,
			  "Content-Type": "application/json;charset=utf-8",
			},
		  })
			.then((response) => {
				console.log(response);
				this.setState({jobList:response.data.data});
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getCompanies = () => {
		axios({
			method: "get",
			url: defaultUrl+"company",
			headers: {
			  // 'Authorization': `bearer ${token}`,
			  "Content-Type": "application/json;charset=utf-8",
			},
		  })
			.then((response) => {
				console.log(response);
				this.setState({Companies:response.data.data});
			})
			.catch((error) => {
				console.log(error);
			})
	}
	componentDidMount() {
		this.getPositionDetail();
		this.getUnitDetail();
	}

	handleTab = (event, value) => {
		this.setState({ value });
	};

	handleChange = (e) => {
		console.log(e.target.value);
		this.setState({ [e.target.name]: e.target.value });
	};

	getPositionDetail = () => {

		if(this.state.Default == null){
			return false;
		}
		axios({
			method: "get",
			url: defaultUrl + "/position/ByCompany/"+this.state.Default.Id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);

				this.setState({ Positions: response.data });
			
			})
			.catch((error) => {
				console.log(error);
			})	

		// if (!$.fn.dataTable.isDataTable('#position_Table')) {
		// 	this.state.table = $('#position_Table').DataTable({
		// 		ajax: defaultUrl + "position",
		// 		"columns": [
		// 			{ "data": "UnitId" },
		// 			{ "data": "JobId" },
		// 			{ "data": "Code" },
		// 			{ "data": "Title" },
		// 			{ "data": "CompanyId" },
		// 			{
		// 				"data": "Action",
		// 				sortable: false,
		// 				"render": function (data, type, full, meta) {

		// 					return `<input type="checkbox" name="radio"  value=` + full.Id + `
		// 				onclick=" const checkboxes = document.querySelectorAll('input[name=radio]:checked');
		// 							let values = [];
		// 							checkboxes.forEach((checkbox) => {
		// 								values.push(checkbox.value);
		// 							});
		// 							localStorage.setItem('ids',values);
		// 							"
		// 				/>`;
		// 				}
		// 			}

		// 		],
		// 		rowReorder: {
		// 			selector: 'td:nth-child(2)'
		// 		},
		// 		responsive: true,
		// 		dom: 'Bfrtip',
		// 		buttons: [

		// 		],
		// 		columnDefs: [{
		// 			"defaultContent": "-",
		// 			"targets": "_all"
		// 		}]
		// 	});
		// } else {
		// 	this.state.table.ajax.reload();
		// }
		// axios({
		// 	method: "get",
		// 	url: defaultUrl+"position",
		// 	headers: {
		// 	  // 'Authorization': `bearer ${token}`,
		// 	  "Content-Type": "application/json;charset=utf-8",
		// 	},
		//   })
		// 	.then((response) => {
		// 		console.log(response);
		// 		this.setState({Positions:response.data});
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	})
	}

	getUnitDetail = () => {
		axios({
			method: "get",
			url: defaultUrl + "unit",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ Units: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})
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
		var url = defaultUrl + "position";
		if (this.state.Action != "Insert Record") {
			method = "put";
			url = defaultUrl + "position/" + this.state.Id;
		}


		var obj = {
			Code: this.state.code,
			Title: this.state.title,
			CompanyId:this.state.companyId,
			UnitId: this.state.unitId,
			JobId: this.state.jobId
		};
		axios.interceptors.request.use(function (config) {
			//document.getElementById("fuse-splash-screen").style.display = "block";
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

				console.log(response);
				this.getPositionDetail();
				this.setState({
					value: 0,
					unitId: 0,
					Job: 1,
					code: '',
					title: '',
					Id: 0,
					Action: 'Insert Record',
					value: 0
				});
				//document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.success();

			})
			.catch((error) => {
				console.log(error);
				this.setState({
					unitId: 1,
					Job: 1,
					code: '',
					title: '',
					Id: 0,
					Action: 'Insert Record',
					value: 0
				})
				//document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.error(error.message);
			})
	}
	deleteposition = () => {
		var ids = localStorage.getItem("ids");
		if (ids === null) {
			Messages.warning("No Record Selected");
			return false;
		}
		//document.getElementById("fuse-splash-screen").style.display = "block";

		axios({
			method: "delete",
			url: defaultUrl + "position/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				localStorage.removeItem("ids");
				this.getPositionDetail();
				//document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.success();

			})
			.catch((error) => {
				console.log(error);
				//document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.error(error.message);

			})
	}

	getPositionById = () => {
		let ids = localStorage.getItem("ids")
		if (ids === null || localStorage.getItem("ids").split(",").length > 1) {
			Messages.warning("kindly Select one record");
			return false;
		}
		//document.getElementById("fuse-splash-screen").style.display = "block";

		axios({
			method: "get",
			url: defaultUrl + "position/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ Action: 'Update Record', value: 1, jobId: response.data[0].JobId, code: response.data[0].Code, title: response.data[0].Title, Id: response.data[0].Id,unitId: response.data[0].UnitId, companyId:response.data[0].CompanyId });
				//document.getElementById("fuse-splash-screen").style.display = "none";
			})
			.catch((error) => {
				console.log(error);
				//document.getElementById("fuse-splash-screen").style.display = "none";
			})
	}
	selection = (id) => {
		console.log("called");
		const checkboxes = document.querySelectorAll('input[name=radio]:checked');
		let values = [];
		checkboxes.forEach((checkbox) => {
			values.push(checkbox.value);
		});
		localStorage.setItem('ids', values);
	}
	render() {
		const { classes, theme } = this.props;

		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24"><h4>Position-{this.state.Default !=null?this.state.Default.Company:"No Company Selected Yet"}</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New Position</h4></div>
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
									<div className="row" style={{marginBottom:"5px"}}  >
										<div style={{ float: "left",  "margin": "8px" }}>
											<Button variant="contained" color="secondary" className={classes.button} onClick={this.getPositionById}>
												Edit
										</Button>
										</div>
										<div style={{ float: "left", "margin": "8px" }}>
											<Button  variant="contained" color="primary" className={classes.button} onClick={this.deleteposition}>
												Delete
										</Button>
										</div>
										
									</div>
									{/* <table id="position_Table" className="nowrap header_custom" style={{ "width": "100%" }}>
										<thead>
											<tr>
												<th>Unit</th>
												<th>Job</th>
												<th>Grade</th>
												<th>Code</th>
												<th>Title</th>
												<th>Action</th>

											</tr>
										</thead>

									</table> */}
										<Table className={classes.table}>
										<TableHead>
											<TableRow>
											<CustomTableCell align="center">Action</CustomTableCell>
												<CustomTableCell align="center" >Code</CustomTableCell>
												<CustomTableCell align="center" >Title</CustomTableCell>
												{/* <CustomTableCell align="center" >Company</CustomTableCell> */}
												
											</TableRow>
										</TableHead>
										<TableBody>
											{
												this.state.Positions.length>0?
												this.state.Positions.map(row => (
													<TableRow className={classes.row} key={row.Code}>
														<CustomTableCell align="center"><input type="checkbox" name="radio" value={row.Id}
															onChange={() => this.selection(row.Id)}
														/>
														</CustomTableCell>
														<CustomTableCell align="center">{row.Code == "" || row.Code == null || row.Code == undefined ? 'N/A' : row.Code}</CustomTableCell>
														<CustomTableCell align="center" component="th" scope="row">
															{row.Title == "" || row.Title == null || row.Title == undefined ? 'N/A' : row.Title}
														</CustomTableCell>
														{/* <CustomTableCell align="center">{row.Company == "" || row.Company == null || row.Company == undefined ? 'N/A' : row.Company}</CustomTableCell> */}
	
														
													</TableRow>
												))
												:
												<div style={{fontSize: "calc(1em + 1vw)",textAlign: "center"}} >{this.state.Default==null?"No Company Selected Yet":"No Record Found"}</div>
											}
										</TableBody>
									</Table>
								</Paper>
							</TabContainer>
							<TabContainer dir={theme.direction}>
								<form className={classes.container} noValidate autoComplete="off">
									<Grid item xs={12} sm={5} >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="company">Unit</InputLabel>
											<Select
												value={this.state.unitId}
												onChange={this.handleChange}
												inputProps={{
													name: 'unitId',
													id: 'unitId',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>

												{this.state.Units.map(row => (
													<MenuItem value={row.Id}>{row.Code}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('unitId', this.state.unitId, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} >

										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="Job">Job</InputLabel>
											<Select
												value={this.state.jobId}
												onChange={this.handleChange}
												inputProps={{
													name: 'jobId',
													id: 'jobId',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>

												{this.state.jobList.map(row => (
													<MenuItem value={row.Id}>{row.Code}</MenuItem>
												))}
											</Select>
										</FormControl>


										{this.validator.message('jobId', this.state.jobId, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}>
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

										

										{this.validator.message('companyId', this.state.companyId, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}>
										<TextField id="code" fullWidth label="Code" name="code" value={this.state.code} onChange={this.handleChange} />
										{this.validator.message('code', this.state.code, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} >
										<TextField id="title" fullWidth label="title" name="title" value={this.state.title} onChange={this.handleChange} />
										{this.validator.message('title', this.state.title, 'required')}
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

export default withStyles(styles, { withTheme: true })(Position);