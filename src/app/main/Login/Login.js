import FuseAnimate from '@fuse/core/FuseAnimate';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useState,Component } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Formsy from 'formsy-react';
import { TextFieldFormsy } from '@fuse/core/formsy';
import Button from '@material-ui/core/Button';
import axios from "axios";
import Messages from '../toaster';
import defaultUrl from '../../../app/services/constant/constant';
import { Redirect } from "react-router-dom";
import _ from '@lodash';
import { ToastContainer, toast } from 'react-toastify';
import { connect } from 'react-redux'
import { setUser } from '../../../app/auth/store/userSlice'
import { createBrowserHistory } from 'history';
const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	},
	leftSection: {},
	rightSection: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	}
}));

class Login extends Component {
  
    state = {
        email: '',
        password: '',
        Isvisble:0,
        redirect:false
    };

    constructor(props) {
        super(props)
        this.setUser = this.props;
        this.submit = this.submit.bind(this);
    }
    submit(event) {
        console.log(event.keyCode);
        if (this.canBeSubmitted()) {
            if (event.keyCode === 13)
                this.login();
        }
    }
    canBeSubmitted()
    {
        const { email, password } = this.state;
        return (
            email.length > 0 && password.length > 0
        );
    }
componentDidMount(){
    localStorage.clear();
    document.addEventListener("keydown", this.submit, false);
}
componentWillUnmount(){
    document.removeEventListener("keydown", this.submit, false);
}
handleChange = (event) => {
    this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
};

    parseJwt=(token) =>{
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };
    login=()=> {
        //  let history = useHistory();
        var obj = {
            Email: this.state.email,
            Password: this.state.password,
        };
        axios.interceptors.request.use(function (config) {
          
            return config;
        }, function (error) {
            console.log('Error');
            return Promise.reject(error);
        });
        axios({
            method: "get",
            url: defaultUrl + "userLogin/" + this.state.email + "/" + this.state.password,
            // data: JSON.stringify(obj),
            headers: {
                // 'Authorization': `bearer ${token}`,
                "Content-Type": "application/json;charset=utf-8",
            },
        })
            .then((response) => {
             
                if(response.data!="Invalid Credentials"){
                      localStorage.setItem('IsLoggedIn', true);
                localStorage.setItem('token', response.data);
    
                var tokendata = this.parseJwt(response.data);
                // this.props.setUser({
                //     role: 'admin', data: {
                //         'displayName': tokendata.Name,
                //         'photoURL': 'assets/images/avatars/Velazquez.jpg',
                //         'email': tokendata.Name + "@gmail.com",
                //         shortcuts: [
                //             'calendar',
                //             'mail',
                //             'contacts',
                //             'todo'
                //         ]
                //     }
                // });
                localStorage.setItem("User",JSON.stringify({
                    role: 'admin', data: {
                        'displayName': tokendata.Name,
                        'photoURL': 'assets/images/avatars/Velazquez.jpg',
                        'email': tokendata.Name + "@gmail.com",
                        shortcuts: [
                            'calendar',
                            'mail',
                            'contacts',
                            'todo'
                        ]
                    }
                }))
       
                this.setState({
                    redirect: true
                });  
                }else{
                    Messages.error(response.data);
              
                  this.setState({Isvisble:1});
                }
            
               
            })
            .catch((error) => {
                console.log("error")
                Messages.error(error.message);
                this.setState({
                    email: "",
                    password: ''
                })
           
            }).finally(() => {
            });
    }
    render()
{
    const { redirect } = this.state;

    if (redirect) {
        return <Redirect to='/dashboard' />;
    }
    //  const classes = this.useStyles();
        return (
            <div style={{    background: "linear-gradient(to left, #122230 0%, rgb(9, 17, 24) 100%)",color:"white"}}
                className={clsx(
                    useStyles.root,
                    'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
                )}
            >
                       <ToastContainer />
                <FuseAnimate animation="transition.expandIn">
         
                    <div className="flex w-full max-w-400 md:max-w-3xl rounded-12 shadow-2xl overflow-hidden">
                        <Card
                            className={clsx(
                                useStyles.leftSection,
                                'flex flex-col w-full max-w-sm items-center justify-center shadow-0'
                            )}
                            square
                        >
                            <CardContent className="flex flex-col items-center justify-center w-full py-96 max-w-320">
                                <FuseAnimate delay={300}>
                                    <div className="flex items-center mb-32">
                                        <img className="logo-icon w-48" src="assets/images/logos/fuse.png" alt="logo" />
                                        <div className="border-l-1 mr-4 w-1 h-40" />
                                        <div>
                                            <Typography className="text-24 font-800 logo-text" color="inherit">
                                                HR
                                            </Typography>
                                            <Typography
                                                className="text-16 tracking-widest -mt-8 font-700"
                                                color="textSecondary"
                                            >
                                                SOLUTION
                                            </Typography>
                                        </div>
                                    </div>
                                </FuseAnimate>
    
                            
                            
                <Formsy
                    // onSubmit={this.Login}
                    // onValid={this.Login}
                    // onInvalid={this.login}
                    // ref={formRef}
                    className="flex flex-col justify-center w-full"
                >
                    <TextFieldFormsy
                        className="mb-16"
                        type="text"
                        name="email"
                        label="Username/Email"
                        value={this.state.email}
                       onChange={this.handleChange}
                        validationErrors={{
                            minLength: 'Min character length is 4'
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Icon className="text-20" color="action">
                                        email
                                    </Icon>
                                </InputAdornment>
                            )
                        }}
                        variant="outlined"
                        required
                    />
    
                    <TextFieldFormsy
                        className="mb-16"
                        type="password"
                        name="password"
                        label="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                      
                        validationErrors={{
                            minLength: 'Min character length is 4'
                        }}
                        InputProps={{
                            className: 'pr-2',
                            // type: showPassword ? 'text' : 'password',
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton >
                                        <Icon className="text-20" color="action">
                                            {/* {showPassword ? 'visibility' : 'visibility_off'} */}
                                        </Icon>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        variant="outlined"
                        required
                    />
    
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="w-full mx-auto mt-16 normal-case"
                        aria-label="LOG IN"
                        // disabled={!isFormValid}
                        onClick={this.login}
                        value="legacy"
                    >
                        Login
                    </Button>
                </Formsy>
    
    
    {/* 
                                {selectedTab === 0 &&}
                                {selectedTab === 1 && <FirebaseLoginTab />}
                                {selectedTab === 2 && <Auth0LoginTab />} */}
                            </CardContent>
    
                        </Card>
    
                        <div
                            className={clsx(useStyles.rightSection, 'hidden md:flex flex-1 items-center justify-center p-64')}
                        >
                            <div className="max-w-320">
                                <FuseAnimate animation="transition.slideUpIn" delay={400}>
                                    <Typography variant="h3" color="inherit" className="font-800 leading-tight">
                                        Welcome <br />
                                        to the <br /> FUSE React!
                                    </Typography>
                                </FuseAnimate>
    
                                <FuseAnimate delay={500}>
                                    <Typography variant="subtitle1" color="inherit" className="mt-32">
                                        Powerful and professional admin template for Web Applications, CRM, CMS, Admin
                                        Panels and more.
                                    </Typography>
                                </FuseAnimate>
                            </div>
                        </div>
                    </div>
                </FuseAnimate>
            </div>
        );
    
}
}





export default connect(null, { setUser })(Login);
