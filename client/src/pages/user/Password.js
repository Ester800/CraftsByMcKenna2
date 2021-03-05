import React, { useState } from 'react';
import UserNav from '../../components/nav/UserNav';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';

const Password = ({ history }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        //console.log(password);
        await auth.currentUser
        .updatePassword(password)
        .then(() => {
            setLoading(false);  // after getting our promise fullfilled we then change state of setLoading so can can continue.
            setPassword(''); // reset password field back to empty...not really needed if we redirect as we do in line 20...
            toast.success('Password updated!'); // little green box appears signaling success
            history.push('/user/history');  // redirects user to their /user/history!
        })
        .catch(err => {
            setLoading(false);
            toast.error(err.message);
        })
    }

    const passwordUpdateForm = () => 
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>New Password</label>
                <input
                    type="password" 
                    onChange={e => setPassword(e.target.value)} 
                    className="form-control"
                    placeholder="Enter new password"
                    disabled={loading}
                    value={password}
                />
                <button 
                    className="btn btn-primary"
                    disabled={!password || password.length < 6 || loading }
                >
                    Submit
                </button>
            </div>
        </form>
    

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col">
                    {loading ? (
                    <h4 className="text-danger">Loading...</h4>
                     ) : (
                     <h4>Password Update</h4> 
                     )}
                    {passwordUpdateForm()}
                </div>
            </div>
        </div>
    );
};

export default Password;