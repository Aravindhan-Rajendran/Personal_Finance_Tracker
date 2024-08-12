import React, { useEffect } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase'; // Import auth from your Firebase configuration
import { signOut } from 'firebase/auth'; // Import signOut from Firebase Auth
import { toast } from 'react-toastify';
import userImg from '../../assets/user.png';

function Index() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  function logoutfnc() {
    try {
      signOut(auth).then(() => {
        // Sign-out successful.
        toast.success("Logged Out Successfully!");
        navigate('/');
      }).catch((error) => {
        // Handle Errors here.
        toast.error(error.message);
      });
    } catch (e) {
      toast.error(e.message);
    } 
  }

  return (
    <div className='navbar'>
      <p className="logo">Financely.</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <img src={user.photoURL ? user.photoURL: userImg} style={{ borderRadius: "50%",height:"1.5rem",width:"1.5rem"}}/>
        <p className='logo link' onClick={logoutfnc}>Logout</p>
        </div>
      )}
    </div>
  );
}

export default Index;