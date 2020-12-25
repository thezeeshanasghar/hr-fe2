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
import { Icon, Input, MuiThemeProvider } from '@material-ui/core';
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
//import { Message } from 'semantic-ui-react';
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
	createData('code', 'desc')
];

class Grades extends Component {
	state = {
		value: 0,
		code: "",
		description: "",
		companyId: "",
		company: "",
		Companies: [],
		Grades: [],
		Id: 0,
		Action: 'Insert Record',
		table: null,
		Default:localStorage.getItem("state")!=null?JSON.parse(localStorage.getItem("state")):null
	};

	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();
		this.SelectedIds = [];
	}

	componentDidMount() {
		this.getGradeDetail();
		this.getCompanyDetail();
	}

	handleTab = (event, value) => {
		this.setState({ value });
	};

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};
	selection = (id) => {
		console.log("called");
		const checkboxes = document.querySelectorAll('input[name=radio]:checked');
		let values = [];
		checkboxes.forEach((checkbox) => {
			values.push(checkbox.value);
		});
		localStorage.setItem('ids', values);
	}
	getGradeDetail = () => {
		
		if(this.state.Default == null){
			return false;
		}
		axios({
			method: "get",
			url: defaultUrl + "/grades/ByCompany/"+this.state.Default.Id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);

				this.setState({ Grades: response.data });
				console(this.state.Grades);
				return response.data;
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
		var url = defaultUrl + "grades";
		if (this.state.Action != "Insert Record") {
			method = "put";
			url = defaultUrl + "grades/" + this.state.Id;
		}


		var obj = {
			Code: this.state.code,
			Description: this.state.description,
			CompanyId: this.state.companyId
		};
		axios.interceptors.request.use(function (config) {
			// document.getElementsByClassName("loader-wrapper")[0].style.display="block"
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
				this.getGradeDetail();
				this.setState({
					value: 0,
					code: "",
					description: '',
					Action: 'Insert Record',
					Id: 0
				});
				Messages.success();
			})
			.catch((error) => {
				console.log(error);
				this.setState({
					code: "",
					description: '',
					companyId: 0,
					Action: 'Insert Record',
					Id: 0
				})
				Messages.error(error.message);
			});
		//   document.getElementsByClassName("loader-wrapper")[0].style.display="none";
		// });
	}

	deleteGrade = () => {
		var ids = localStorage.getItem("ids");
		if (ids === null) {
			Messages.warning("No Record Selected");
			return false;
		}
		axios({
			method: "delete",
			url: defaultUrl + "grades/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				localStorage.removeItem("ids");
				this.getGradeDetail();
				Messages.success();
			})
			.catch((error) => {
				console.log(error);
				Messages.error(error.message);
			})
	}

	getGradeById = () => {
		let ids = localStorage.getItem("ids")
		if (ids === null || localStorage.getItem("ids").split(",").length > 1) {
			Messages.warning("kindly Select one record");
			return false;
		}
		axios({
			method: "get",
			url: defaultUrl + "grades/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ Action: 'Update Record', value: 1, code: response.data[0].Code, description: response.data[0].Description, Id: response.data[0].Id, companyId: response.data[0].CompanyId });
			})
			.catch((error) => {
				console.log(error);
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
					<div className="p-24"><h4>Grade-{this.state.Default !=null?this.state.Default.Company:"No Company Selected Yet"}</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New Grade</h4></div>
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
											<Button variant="contained" color="secondary" className={classes.button} onClick={this.getGradeById}>
												Edit
										</Button>
										</div>
										<div style={{ float: "left", "margin": "8px" }}>
											<Button  variant="contained" color="primary" className={classes.button} onClick={this.deleteGrade}>
												Delete
										</Button>
										</div>
										
									</div>
									<Table className={classes.table}>
										<TableHead>
											<TableRow>
												<CustomTableCell align="center" >Code</CustomTableCell>
												<CustomTableCell align="center" >Description</CustomTableCell>
												{/* <CustomTableCell align="center" >Company</CustomTableCell> */}
												<CustomTableCell align="center">Action</CustomTableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{
												this.state.Grades.length>0?
												this.state.Grades.map(row => (
													<TableRow className={classes.row} key={row.Code}>
	
														<CustomTableCell align="center">{row.Code == "" || row.Code == null || row.Code == undefined ? 'N/A' : row.Code}</CustomTableCell>
														<CustomTableCell align="center" component="th" scope="row">
															{row.Description == "" || row.Description == null || row.Description == undefined ? 'N/A' : row.Description}
														</CustomTableCell>
														{/* <CustomTableCell align="center">{row.Company == "" || row.Company == null || row.Company == undefined ? 'N/A' : row.Company}</CustomTableCell> */}
	
														<CustomTableCell align="center"><input type="checkbox" name="radio" value={row.Id}
															onChange={() => this.selection(row.Id)}
														/>
														</CustomTableCell>
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
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="code" fullWidth label="Grade Code" name="code" value={this.state.code} onChange={this.handleChange} />
										{this.validator.message('code', this.state.code, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField id="description" fullWidth label="Description" name="description" value={this.state.description} onChange={this.handleChange} />
										{this.validator.message('decription', this.state.description, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} >
										<FormControl fullWidth className={classes.formControl}>
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

export default withStyles(styles, { withTheme: true })(Grades);