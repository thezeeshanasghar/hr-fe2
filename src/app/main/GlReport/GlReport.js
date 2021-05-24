import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import SimpleReactValidator from 'simple-react-validator';
import defaultUrl from "../../services/constant/constant";
import $ from 'jquery';
import FormControl from '@material-ui/core/FormControl';

import TextField from '@material-ui/core/TextField';
import DataTable from "datatables.net";
import * as responsive from "datatables.net-responsive";
import Select1 from 'react-select';
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
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


class GlReport extends Component {
	state = {
		value: 0,
		Action:'Generate Report',
		table:null,
		company:"",
		companyList:[],
		data:[],
		Month:"",
		Path:"",
		Default:localStorage.getItem("state")!=null?JSON.parse(localStorage.getItem("state")):null
	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();
	
	  }
	  handleChange = (e) => {
		console.log(e.target.value)
	  this.setState({ [e.target.name]: e.target.value});
  };
	  download=()=>{
		window.open(defaultUrl + "download/"+this.state.Path,"_self");
		}
	  componentDidMount(){
		localStorage.removeItem("ids");
		  this.getselectiveCompanyDetail();
	  }
	  handledropdown = (e) => {
		console.log("working",e.value)
		this.setState({company:e.value})
	}
	getselectiveCompanyDetail = () => {
		axios({
			method: "get",
			url: defaultUrl + "company/Selective/data",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);

				this.setState({ companyList: response.data });
				return response.data;
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getEmployeeDetail = () => {
		if(this.state.Month=="" || this.state.Default ==null){
			return false;
		}
		var obj={
			Date:this.state.Month+"-01",
			CompanyId:this.state.Default.Id
	  }
		axios({
			method: "post",
			url: defaultUrl + "report/GL",
			data:JSON.stringify(obj),
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);

				this.setState({ data: response.data.data.data,Path:response.data.Path });

			})
			.catch((error) => {
				console.log(error);
			})
	}
	
	 	
	render() {
		const { classes, theme } = this.props;

		return (
			<FusePageSimple
				
				header={
					<div className="p-24">
						<h4>GL Report-{this.state.Default !=null?this.state.Default.Company:"No Company Selected Yet"}</h4></div>
				}
				
				content={

					<div className={classes.root}>
												<form className={classes.container} noValidate autoComplete="off" style={{marginBottom:'30px'}}>
								<Grid item xs={12} sm={5}  style={{marginRight:'5px'}} >
								<FormControl className={classes.formControl}>
								<TextField
											id="Month"
											label="Report Month"
											type="month"
											fullWidth
											name="Month"
											value={this.state.Month}
											className={classes.textField}
											onChange={this.handleChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										
										</FormControl>
									</Grid>
									{/* <Grid item xs={12} sm={5} style={{marginTop: "10px"}} className={this.state.Type=="Bank" || this.state.Type=="Company" || this.state.Type=="Exchange" || this.state.Type=="CountryLaw" ? 'd-none' : ''   } >
										<FormControl className={classes.formControl}>
										<Select1

name="companyId"
options={this.state.companyList}
// value={this.state.CompanySelected}
className="basic-multi-select"
classNamePrefix="select"
onChange={this.handledropdown}

/>

											{this.validator.message('companyId', this.state.companyId, 'required')}
										</FormControl>
									</Grid> */}
									{
										this.state.Default!=null?
										<Button variant="outlined" color="secondary" style={{marginTop: "10px"}} className={classes.button} onClick={()=>this.getEmployeeDetail()} >
												Generate Report
											</Button>
											:""
									}
									
								</form>
				
								{/* <form className={classes.container} noValidate autoComplete="off" style={{marginBottom:'30px',marginTop:"10px"}}>
								<Grid item xs={12} sm={5}  style={{marginRight:'5px'}} >
								<FormControl className={classes.formControl}>
								<TextField
											id="Month"
											label="Report Month"
											type="month"
											fullWidth
											name="Month"
											value={this.state.Month}
											className={classes.textField}
											onChange={this.handleChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										
										</FormControl>
									</Grid>	
									<Grid item xs={6} sm={5} style={{marginRight:"10px"}} >
											<Select1

												name="companyId"
												options={this.state.companyList}
												// value={this.state.CompanySelected}
												className="basic-multi-select"
												classNamePrefix="select"
												onChange={this.handledropdown}

											/>
										
										</Grid>
										<Grid item xs={6} sm={5}  >
										<Button variant="outlined" color="secondary" className={classes.button} onClick={()=>this.getEmployeeDetail()} >
												{this.state.Action}
											</Button>
										</Grid>
								</form>
								 */}
								
						<AppBar position="static" color="default">
							
						</AppBar>

						<Paper className={this.state.data.length>0?classes.root:"d-none"} >
						<Button style={{ "marginBottom": "10px" }} variant="outlined" color="secondary" className={classes.button} onClick={() => this.download()}>
						Download Report
  						</Button>
						{/* <ExcelFile element={<button style={{color:"green"}}>Download in Excel sheet</button>}>
							<ExcelSheet data={this.state.data} name="Employee-Report">
								<ExcelColumn label="Employee Code" value="EmployeeCode" />
								<ExcelColumn label="Cnic" value="Cnic"  />
								<ExcelColumn label="First Name" value="FirstName" />
								<ExcelColumn label="Last Name" value="LastName" />
								<ExcelColumn label="DOB" value="DOB" />
								<ExcelColumn label="Hire Date" value="HireDate" />
								<ExcelColumn label="Address" value="Address" />
								<ExcelColumn label="Contact" value="Contact" />
								<ExcelColumn label="Gender" value="Gender" />
								<ExcelColumn label="Country" value="Country" />
								<ExcelColumn label="Salary" value="Salary" />
								<ExcelColumn label="Email" value="Email" />
								<ExcelColumn label="IBAN" value="IBAN" />
								<ExcelColumn label="Company Name" value="CompanyName" />
								
							</ExcelSheet>
						</ExcelFile> */}
				
							  <Table className={classes.table}>
										<TableHead>
											<TableRow>
												<CustomTableCell align="center" >GL Account</CustomTableCell>
												<CustomTableCell align="center">GL Description</CustomTableCell>
												<CustomTableCell align="center">Cost Center Code</CustomTableCell>
												<CustomTableCell align="center">Cost Center Description</CustomTableCell>
												<CustomTableCell align="center">Payelement Code</CustomTableCell>
												<CustomTableCell align="center">Payelement Description</CustomTableCell>
												<CustomTableCell align="center">Debit Value</CustomTableCell>
												<CustomTableCell align="center">Credit Value</CustomTableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{this.state.data.map(row => (
												<TableRow className={classes.row} key={row.Id}>
													<CustomTableCell align="center">{row.GLAccount}</CustomTableCell>
													<CustomTableCell align="center">{row.GlDescription}</CustomTableCell>
													<CustomTableCell align="center">{row.CostCode}</CustomTableCell>
													<CustomTableCell align="center">{row.CostDescription}</CustomTableCell>
													<CustomTableCell align="center">{row.ElementCode}</CustomTableCell>
													<CustomTableCell align="center">{row.ElementDescription}</CustomTableCell>
													<CustomTableCell align="center">{row.amount>0?row.amount:0}</CustomTableCell>
													<CustomTableCell align="center">{row.amount<0?row.amount:0}</CustomTableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
									</Paper>
								
					</div>
				}
			/>
		)
	}
}

export default withStyles(styles, { withTheme: true })(GlReport);