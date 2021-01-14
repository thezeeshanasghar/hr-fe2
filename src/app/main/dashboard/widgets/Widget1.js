import React, {Component} from 'react';
import {Icon, Typography, Paper, IconButton} from '@material-ui/core';
import {isEmpty} from "lodash"
class Widget1 extends Component {
    render()
    {
        let {widget} = this.props;
        {console.log("working",widget)}
       if( isEmpty(widget))
        {
            widget={
                "title":"Companies",
                "data":{
                        "label":"Registered Companies",
                        "count":0
                    }
            }
        }

        return (
            <Paper className="w-full rounded-8 shadow-none border-1">
                <div className="flex items-center justify-between pr-4 pl-16 pt-4">
                    <Typography className="text-16">{widget.title}</Typography>
                  
                </div>
                <div className="text-center pt-12 pb-28">
                    <Typography
                        className="text-72 leading-none text-red">{widget.data.count}</Typography>
                    <Typography className="text-16" color="textSecondary">{widget.data.label}</Typography>
                </div>
            </Paper>
        );
    }
}

export default Widget1;
