import React, { Component } from 'react';
import { withStyles, Button, Card, CardContent, Checkbox, Divider, FormControl, FormControlLabel, TextField, Typography } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { FuseAnimate } from '@fuse';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import _ from '@lodash';
import axios from "axios";
import { Redirect } from "react-router-dom";
import defaultUrl from '../../../app/services/constant/constant';
import { connect } from 'react-redux'
import { setUser } from '../../../app/auth/store/actions/login.actions'
import Messages from '../toaster';
const styles = theme => ({
    root: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + darken(theme.palette.primary.dark, 0.5) + ' 100%)',
        color: theme.palette.primary.contrastText
    }
});

class Login extends Component {

    state = {
        email: '',
        password: '',
        Isvisble:0,
        redirect: localStorage.getItem('IsLoggedIn')
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

componentDidMount(){
    document.addEventListener("keydown", this.submit, false);
}
componentWillUnmount(){
    document.removeEventListener("keydown", this.submit, false);
}

handleChange = (event) => {
    this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
};

canBeSubmitted()
{
    const { email, password } = this.state;
    return (
        email.length > 0 && password.length > 0
    );
}
parseJwt = function (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
login = () => {
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
            this.props.setUser({
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
            });
           
            this.setState({
                redirect: true
            });  
            }else{
              this.setState({Isvisble:1});
            }
        
           
        })
        .catch((error) => {
            console.log("error")
            Messages.error(error.data);
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
    const { classes } = this.props;
    const { email, password, remember } = this.state;

    return (
        <div className={classNames(classes.root, "flex flex-col flex-auto flex-no-shrink p-24 md:flex-row md:p-0")}>

            <div className="flex flex-col flex-no-grow items-center text-white p-16 text-center md:p-128 md:items-start md:flex-no-shrink md:flex-1 md:text-left">

                <FuseAnimate animation="transition.expandIn">
                    <img className="w-128 mb-32" src="assets/images/logos/fuse.svg" alt="logo" />
                </FuseAnimate>

                <FuseAnimate animation="transition.slideUpIn" delay={300}>
                    <Typography variant="h3" color="inherit" className="font-light">
                        Welcome to the FUSE!
                        </Typography>
                </FuseAnimate>

                <FuseAnimate delay={400}>
                    <Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper nisl erat, vel convallis elit fermentum pellentesque. Sed mollis velit
                        facilisis facilisis.
                        </Typography>
                </FuseAnimate>
            </div>

            <FuseAnimate animation={{ translateX: [0, '100%'] }}>

                <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>

                    <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">

                        <Typography variant="h6" className="md:w-full mb-32">LOGIN TO YOUR ACCOUNT</Typography>

                        <form name="loginForm" noValidate className="flex flex-col justify-center w-full">

                            <TextField
                                className="mb-16"
                                label="Email"
                                autoFocus
                                type="email"
                                name="email"
                                value={email}
                                onChange={this.handleChange}
                                variant="outlined"
                                required
                                fullWidth

                            />

                            <TextField
                                className="mb-16"
                                label="Password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={this.handleChange}
                                variant="outlined"
                                required
                                fullWidth
                            />

                            <div className="flex items-center justify-between">

                                {/* <FormControl>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="remember"
                                                    checked={remember}
                                                    onChange={this.handleChange}/>
                                            }
                                            label="Remember Me"
                                        />
                                    </FormControl> */}
                                {/* 
                                    <Link className="font-medium" to="/pages/auth/forgot-password-2">
                                        Forgot Password?
                                    </Link> */}
                            </div>

                            <Button
                                variant="contained"
                                color="primary"
                                className="w-full mx-auto mt-16"
                                aria-label="LOG IN"
                                disabled={!this.canBeSubmitted()}
                                onClick={this.login}
                                onKeyPress={this.login}
                            >
                                LOGIN
                                </Button>

                        </form>

                        <div className={this.state.Isvisble==1?"my-24 flex items-center justify-center":"my-24 flex items-center justify-center d-none"} >
                                <Divider className="w-32"/>
                                <span className="mx-8 font-bold" style={{color:"red"}} >Invalid Credentials</span>
                                <Divider className="w-32"/>
                            </div>
                        {/* 
                            <Button variant="contained" color="secondary" size="small"
                                    className="normal-case w-192 mb-8">
                                Log in with Google
                            </Button>

                            <Button variant="contained" color="primary" size="small"
                                    className="normal-case w-192">
                                Log in with Facebook
                            </Button>

                            <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                <span className="font-medium">Don't have an account?</span>
                                <Link className="font-medium" to="/pages/auth/register-2">Create an account</Link>
                            </div> */}

                    </CardContent>
                </Card>
            </FuseAnimate>
        </div>
    );
}
}
// export default connect(null, {setUser})(Login);
// export default withStyles(styles, {withTheme: true}).connect(null,{setUser})(Login);

export default connect(null, { setUser })(withStyles(styles, { withTheme: true })(Login));
