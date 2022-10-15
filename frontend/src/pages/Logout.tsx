import { Link } from 'react-router-dom';
import { Button } from '../components';
import classes from "../styles/login.module.scss";

const Logout = () => {
    return (
        <div className={classes.container}>
            <h3>Welcome to Users Module</h3>
            <h5>Existing Users</h5>
            <Link to="/login">
                <Button text="Login" />
            </Link>
            <h5>New Users</h5>
            <Link to="/register">
                <Button text="Register" />
            </Link>
            <h5>You have been logged out</h5>
        </div>
    );
};

export default Logout;