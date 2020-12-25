
import {saveState,loadState} from './StoreState';

function counter(state = 0, action) {
    var State =loadState();
    if(State == undefined && state==0  ){
       
    }else if(state==0 ){

    }else if( state==State){

    }
    else{
        State=state;
        saveState(state);
    }
    return State

}
  export default counter;