import React, { useState } from 'react';
import './style.css';
import Input from "../input/index";
import Button from '../Button/index';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from '../../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

function SignupSigninComponent() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [loginForm, setLoginForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function signupWithEmail() {
        setLoading(true);
        console.log("Name", name);
        console.log("Email", email);
        console.log("Password", password);
        console.log("Confirm Password", confirmpassword);
        if (name !== "" && email !== "" && password !== "" && confirmpassword !== "") {
            if (password === confirmpassword) {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        console.log("User>>", user);
                        toast.success("User Created!");
                        setLoading(false);
                        setName("");
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                        createDoc(user);
                        navigate('/dashboard');
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        toast.error(errorMessage);
                        setLoading(false);
                    });
            } else {
                toast.error("Password and Confirm Password don't match!");
                setLoading(false);
            }
        } else {
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
    }

    function loginUsingEmail() {
        console.log("Email", email);
        console.log("Password", password);
        setLoading(true);
        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    toast.success("User Logged In!");
                    console.log("User Logged In!", user);
                    createDoc(user);
                    navigate("/dashboard");
                    setLoading(false);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                    setLoading(false);
                });
        } else {
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
    }

    async function createDoc(user) {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);
        if (!userData.exists()) {
            await setDoc(userRef, {
                name: name,
                email,
                photoURL: "",
                createdAt: new Date(),
            });
            toast.success("Document Created!");
        } else {
            toast.error("Document already exists");
        }
        setLoading(false);
    }

    function googleAuth() {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log('user>>', user);
                createDoc(user);
                setLoading(false);
                navigate('/dashborad');
                toast.success("User authenticated!");
                // Add additional logic if needed
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
                // Handle additional errors as needed
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <>
            {loginForm ? (
                <div className='signup-wrapper'>
                    <h2>Login on <span style={{ color: 'var(--theme)' }}>Financely.</span></h2>
                    <form>
                        <Input
                            label={"Email"}
                            state={email}
                            setState={setEmail}
                            placeholder={'Johndoe@gmail.com'}
                            type='email'
                        />
                        <Input
                            label={"Password"}
                            state={password}
                            setState={setPassword}
                            placeholder={'Example@123'}
                            type='password'
                        />
                        <Button
                            disabled={loading}
                            text={loading ? "Loading..." : "Login Using Email and Password"}
                            onClick={loginUsingEmail}
                        />
                        <p style={{ textAlign: 'center' }}>or</p>
                        <Button
                            onClick={googleAuth}
                            text={loading ? "Loading..." : "Login Using Google"}
                            blue={true}
                        />
                        <p className='p-login' style={{ cursor: 'pointer' }} onClick={() => setLoginForm(!loginForm)}>
                            or Don't Have An Account? Click Here
                        </p>
                    </form>
                </div>
            ) : (
                <div className='signup-wrapper'>
                    <h2>Sign Up on <span style={{ color: 'var(--theme)' }}>Financely.</span></h2>
                    <form>
                        <Input
                            label={"Full Name"}
                            state={name}
                            setState={setName}
                            placeholder={'John Doe'}
                        />
                        <Input
                            label={"Email"}
                            state={email}
                            setState={setEmail}
                            placeholder={'Johndoe@gmail.com'}
                            type='email'
                        />
                        <Input
                            label={"Password"}
                            state={password}
                            setState={setPassword}
                            placeholder={'Example@123'}
                            type='password'
                        />
                        <Input
                            label={"Confirm Password"}
                            state={confirmpassword}
                            setState={setConfirmPassword}
                            placeholder={'Example@123'}
                            type='password'
                        />
                        <Button
                            disabled={loading}
                            text={loading ? "Loading..." : "Signup Using Email and Password"}
                            onClick={signupWithEmail}
                        />
                        <p className='p-login'>or</p>
                        <Button
                            onClick={googleAuth}
                            text={loading ? "Loading..." : "Signup Using Google"}
                            blue={true}
                        />
                        <p className='p-login' style={{ cursor: 'pointer' }} onClick={() => setLoginForm(!loginForm)}>
                            or Already Have An Account? Click Here
                        </p>
                    </form>
                </div>
            )}
        </>
    );
}

export default SignupSigninComponent;