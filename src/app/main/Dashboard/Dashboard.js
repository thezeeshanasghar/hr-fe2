import React, {Component} from 'react';
import {Menu, MenuItem, Hidden, Icon, IconButton, Tab, Tabs, Typography, withStyles} from '@material-ui/core';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import withReducer from 'app/store/withReducer';
// import * as Actions from './store/actions'
// import reducer from './store/reducers';
import _ from 'lodash';
import classNames from 'classnames';
import Widget1 from './widgets/Widget1';
import Widget2 from './widgets/Widget2';
import Widget3 from './widgets/Widget3';
import Widget4 from './widgets/Widget4';
import Widget5 from './widgets/Widget5';
import Widget6 from './widgets/Widget6';
import Widget7 from './widgets/Widget7';
import Widget8 from './widgets/Widget8';
import Widget9 from './widgets/Widget9';
import Widget10 from './widgets/Widget10';
import Widget11 from './widgets/Widget11';
import WidgetNow from './widgets/WidgetNow';
import WidgetWeather from './widgets/WidgetWeather'; 
// import DashboardDB from '../../../@fake-db/db/project-dashboard-db'
import axios from "axios";
import defaultUrl from '../../../app/services/constant/constant';
import {isEmpty} from "lodash"
const styles = theme => ({
        content          : {
            '& canvas': {
                maxHeight: '100%'
            }
        },
        selectedProject  : {
            background  : theme.palette.primary.main,
            color       : theme.palette.primary.contrastText,
            borderRadius: '8px 0 0 0'
        },
        projectMenuButton: {
            background  : theme.palette.primary.main,
            color       : theme.palette.primary.contrastText,
            borderRadius: '0 8px 0 0',
            marginLeft  : 1
        },
    }
);





class Dashboard extends Component {
    state = {
        tabValue         : 0,
        selectedProjectId: 1,
        projectMenuEl    : null,
        Companies:{title: "Registered Companies",table:{columns:[],rows:[]}},
        CompaniesCount:{}
    };
    constructor(props) {
        super(props)
    this.widget11();
    this.widget1();
    }
     widget11=()=>{
          axios({
            method: "get",
            url: defaultUrl + "dashboard/Companies",
            // data: JSON.stringify(obj),
            headers: {
                // 'Authorization': `bearer ${token}`,
                "Content-Type": "application/json;charset=utf-8",
            },
        })
            .then((response) => {
             console.log(response.data)
                if(response.data !=null)
                {
                    this.setState({Companies:response.data})
                }
               
            })
            .catch((error) => {
           
            }).finally(() => {
            });
    }

    widget1=()=>{
        axios({
          method: "get",
          url: defaultUrl + "dashboard/Companies/Count",
          // data: JSON.stringify(obj),
          headers: {
              // 'Authorization': `bearer ${token}`,
              "Content-Type": "application/json;charset=utf-8",
          },
      })
          .then((response) => {
           console.log(response.data)
              if(response.data !=null)
              {
                  this.setState({CompaniesCount:response.data})
              }
             
          })
          .catch((error) => {
         
          }).finally(() => {
          });
  }

   
    handleChangeTab = (event, tabValue) => {
        // console.log(tabValue,this.state.Companies);
        if(tabValue==1 && isEmpty(this.state.Companies)) 
        {
            console.log("wrong");
            return false;
        }
        this.setState({tabValue});
    };

    handleChangeProject = selectedProjectId => {
        this.setState({
            selectedProjectId,
            projectMenuEl: null
        });
    };

    handleOpenProjectMenu = event => {
        this.setState({projectMenuEl: event.currentTarget});
    };

    handleCloseProjectMenu = () => {
        this.setState({projectMenuEl: null});
    };
    parseJwt = function (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };
    // componentDidMount()
    // {
       
    //     this.props.getWidgets();
    //     this.props.getProjects();

    // }

    render()
    {
       
        const object={
            table:{
                columns:[
                    {
                        Id:"Name",
                      title:"Name"
                    },
                    {
                        Id:"Address",
                        title:"Address"
                    }
                ],
                row:[]
            },
            title:"Registed Companies"
        }
        const user=localStorage.getItem("token")==undefined?[]: this.parseJwt(localStorage.getItem("token"));
        const {classes} = this.props;// const {widgets, projects, classes} = this.props;
        const {tabValue, selectedProjectId, projectMenuEl} = this.state;
        // const widgets = []//DashboardDB.widgets;
        // const projects = []//DashboardDB.projects;

        // if ( !widgets || !projects )
        // {
        //     return 'Loading..';
        // }
        console.log(this.state.Companies);
        return (
			<FusePageSimple
			classes={{
				header      : "min-h-160 h-160",
				toolbar     : "min-h-48 h-48",
				rightSidebar: "w-288"
			}}
			header={
				<div className="flex flex-col justify-between flex-1 px-24 pt-24">
				   
					<div className="flex justify-between items-start">
						<Typography className="py-0 sm:py-24" variant="h4">Welcome back, {user.Name}!</Typography>
						<Hidden lgUp>
							<IconButton
								onClick={(ev) => this.pageLayout.toggleRightSidebar()}
								aria-label="open left sidebar"
							>
								<Icon>menu</Icon>
							</IconButton>
						</Hidden>
					</div>
				
				</div>
			}
			contentToolbar={
				
				<Tabs
					value={tabValue}
					onChange={this.handleChangeTab}
					indicatorColor="secondary"
					textColor="secondary"
					variant="scrollable"
					scrollButtons="off"
					className="w-full border-b-1 px-24"
				>
					{/* <Tab className="text-14 font-600 normal-case" label="Home"/> */}
					{/* <Tab className="text-14 font-600 normal-case" label="Budget Summary"/> */}
					<Tab className="text-14 font-600 normal-case" label="Registered Companies"/>
				</Tabs>
			}
			content={
				<div className="p-12">
					{/* {tabValue === 0 &&
					(
						<FuseAnimateGroup
							className="flex flex-wrap"
							enter={{
								animation: "transition.slideUpBigIn"
							}}
						>
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget1 widget={this.state.CompaniesCount}/>
							</div>
							 <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget2 widget={widgets.widget2}/>
							</div>
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget3 widget={widgets.widget3}/>
							</div>
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<Widget4 widget={widgets.widget4}/>
							</div> 
							 <div className="widget flex w-full p-12">
								<Widget5 widget={widgets.widget5}/>
							</div>
							 <div className="widget flex w-full sm:w-1/2 p-12">
								<Widget6 widget={widgets.widget6}/>
							</div>
							<div className="widget flex w-full sm:w-1/2 p-12">
								<Widget7 widget={widgets.widget7}/>
							</div> 
						</FuseAnimateGroup>
					)} */}
					{tabValue === 0 && (
						<FuseAnimateGroup
							className="flex flex-wrap"
							enter={{
								animation: "transition.slideUpBigIn"
							}}
						>
							<div className="widget flex w-full p-12">
							
									<Widget11 widget={this.state.Companies}/>
								
								
							</div>
						</FuseAnimateGroup>
					)}
				</div>
			}
			rightSidebarContent={
				<FuseAnimateGroup
					className="w-full"
					enter={{
						animation: "transition.slideUpBigIn"
					}}
				>
					<div className="widget w-full p-12">
						<WidgetNow/>
					</div>
					{/* <div className="widget w-full p-12">
						<WidgetWeather widget={widgets.weatherWidget}/>
					</div> */}
				</FuseAnimateGroup>
			}
			onRef={instance => {
				this.pageLayout = instance;
			}}
		/>
        );
    };
}

// function mapDispatchToProps(dispatch)
// {
//     return bindActionCreators({
//         getWidgets : Actions.getWidgets,
//         getProjects: Actions.getProjects
//     }, dispatch);
// }

// function mapStateToProps({Dashboard})
// {
//     return {
//         widgets : Dashboard.widgets,
//         projects: Dashboard.projects
//     }
// }

export default Dashboard;
