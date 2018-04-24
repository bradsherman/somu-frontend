import { createStore, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';



export default createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
