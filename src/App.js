import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import DashboardPage from "./components/pages/DashboardPage";
import RoomPage from "./components/pages/RoomPage";
import ProfilePage from "./components/pages/ProfilePage";
import UserRoute from "./components/routes/UserRoute";
import GuestRoute from "./components/routes/GuestRoute";
import TopNavigation from "./components/navigation/TopNavigation";
import NewRoomPage from "./components/pages/NewRoomPage";

const App = ({ location, isAuthenticated }) => (
    <div className="ui container">
        {isAuthenticated && <TopNavigation />}
        <Route location={location} path="/" exact component={HomePage} />
        <GuestRoute location={location} path="/login" exact component={LoginPage} />
        <GuestRoute location={location} path="/signup" exact component={SignupPage} />
        <UserRoute location={location} path="/dashboard" exact component={DashboardPage} />
        <UserRoute location={location} path="/room/:roomId" exact component={RoomPage} />
        <UserRoute location={location} path="/profile" exact component={ProfilePage} />
        <UserRoute location={location} path="/room/new" exact component={NewRoomPage}/>
    </div>
);

App.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return {
        isAuthenticated: !!state.user.email
    }
}

export default connect(mapStateToProps)(App);
