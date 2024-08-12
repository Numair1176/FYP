import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "./Login.css";
import { signinscema } from './Signinschema';
import { signupscema } from './Signupscema';
import { auth } from '../../firebase';
import { signInWithPopup, provider } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';


function Login() {

    let navigate = useNavigate();
    
    const [isSignUpMode, setIsSignUpMode] = useState(false);

    useEffect(() => {
        const sign_in_btn = document.querySelector("#sign-in-btn");
        const sign_up_btn = document.querySelector("#sign-up-btn");
        const container = document.querySelector(".Container");

        const handleSignUpClick = () => {
            setIsSignUpMode(true);
        };

        const handleSignInClick = () => {
            setIsSignUpMode(false);
        };

        sign_up_btn.addEventListener("click", handleSignUpClick);
        sign_in_btn.addEventListener("click", handleSignInClick);

        // Cleanup event listeners when the component unmounts
        return () => {
            sign_up_btn.removeEventListener("click", handleSignUpClick);
            sign_in_btn.removeEventListener("click", handleSignInClick);
        };
    }, []);

    const toggleMode = () => {
        setIsSignUpMode((prevMode) => !prevMode);
    };

    //Signin Formik code is here
    const siginintialvalue = {
        mail: "",
        password: "",
    };

    const SigninFormik = useFormik({
        initialValues: siginintialvalue,
        validationSchema: signinscema,
        onSubmit: async (data) => {
          try {
            const { user } = await signInWithEmailAndPassword(auth, data.mail, data.password); // Use signInWithEmailAndPassword from imported functions
            // localStorage.setItem('userId', user.uid);
            localStorage.setItem('parentid', data.mail.replace('.com', '_com'));


            navigate("/selectchild");
          } catch (error) {
            // Handle errors
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Email or password wrong!",
              text: "Enter correct Email or password.",
            });
          }
        }
      });
    

    //Sign Up Formik code is here

    const sigupintialvalue = {
        username: "",
        Mail: "",
        Password: "",
        Confirm_password: "",
    };

    const SignupFormik = useFormik({
        initialValues: sigupintialvalue,
        validationSchema: signupscema,
        onSubmit: async (values) => {
          try {
            const { user } = await createUserWithEmailAndPassword(auth, values.Mail, values.Password);
            
            // Send email verification
            await sendEmailVerification(user);
            
            // Signup successful
            Swal.fire({
              icon: "success",
              title: "Verification email sent.",
              text: "Please check your email to verify your account.",
              timer: 2500
            });
            navigate("/");
          } catch (error) {
            // Handle errors
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.message, // Display Firebase error message
            });
          }
        }
      });
    


    const [showSigninPassword, setShowSigninPassword] = useState(false);

    const Signinpasswordtoggle = () => {
        setShowSigninPassword((prevShowSigninPassword) => !prevShowSigninPassword);
    };


    const [showSignupPassword, setShowSignupPassword] = useState(false);

    const Signuppasswordtoggle = () => {
        setShowSignupPassword((prevShowSignupPassword) => !prevShowSignupPassword);
    };

    const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

    const Signupconfirmpasswordtoggle = () => {
        setShowSignupConfirmPassword((prevShowSignupConfirmPassword) => !prevShowSignupConfirmPassword);
    };

    const handleGoogleSignIn = async () => {
        try {
          const result = await signInWithPopup(auth, provider);
          // Google sign-in successful, you can access user information from result.user
          const user = result.user;
          console.log(user);

          localStorage.setItem('userId', user.uid);
          localStorage.setItem('email', user.email);

          navigate("/selectchild");

          // Proceed with your logic after successful sign-in
        } catch (error) {
          // Handle errors
          console.error(error);
        }
      };
      


    return (
        <>
            <div className={`Container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
                <div className="forms-container">
                    <div className="signin-signup">

                        <form action="#" className="sign-in-form" onSubmit={SigninFormik.handleSubmit}>
                            <h2 className="title-1">Sign in</h2>
                            {
                                SigninFormik.errors.mail && SigninFormik.touched.mail ?
                                    <p className='error-p'>{SigninFormik.errors.mail}</p> : null
                            }
                            <div className="input-field">
                                <i className="fas fa-envelope"></i>

                                <input
                                    type="text"
                                    placeholder="Email"
                                    name='mail'
                                    value={SigninFormik.values.email}
                                    onChange={SigninFormik.handleChange}
                                    onBlur={SigninFormik.handleBlur}
                                />


                            </div>
                            {
                                SigninFormik.errors.password && SigninFormik.touched.password ?
                                    <p className='error-p'>{SigninFormik.errors.password}</p> : null
                            }
                            <div className="input-fieldp">
                                <i className="mx-2 fas fa-lock"></i>
                                <input
                                    className='text-secondary flex-grow-1'  // Added flex-grow-1 for input to take remaining space
                                    type={showSigninPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    name='password'
                                    value={SigninFormik.values.password}
                                    onChange={SigninFormik.handleChange}
                                    onBlur={SigninFormik.handleBlur}
                                />
                                <i className={`fas ${showSigninPassword ? 'fa-eye-slash' : 'fa-eye'}`} onClick={Signinpasswordtoggle}></i>
                            </div>
                            

                            <div className='forgetpassword'>
                                <p onClick={() => navigate("/forgetpassword")}>Forget password?</p>
                            </div>

                            <button style={{ marginTop: 5 }} type="submit" className="btn solid" >Login</button>
                            <p className="social-text">Or Sign in with social platforms</p>

                            <div className="social-media">
                                {/* <a href="#" className="social-icon" onClick={handleGoogleSignIn}>
                                    <i className="fab fa-google"></i>
                                </a> */}

                                
                                <button type="button" onClick={handleGoogleSignIn} class="login-with-google-btn" >
                                    Sign in with Google
                                </button>
                               


                                {/* <a href="#" className="social-icon">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="social-icon">
                                    <i className="fab fa-twitter"></i>
                                </a> */}
                                {/* <a href="#" className="social-icon">
                                    <i className="fab fa-linkedin-in"></i>
                                </a> */}
                            </div>

                        </form>

                        <form action="#" className="sign-up-form" onSubmit={SignupFormik.handleSubmit}>
                            <h2 className="title-1">Sign up</h2>
                            {
                                SignupFormik.errors.username && SignupFormik.touched.username ?
                                    <p className='error-p'>{SignupFormik.errors.username}</p> : null
                            }
                            <div className="input-field">
                                <i className="fas fa-user"></i>

                                <input
                                    type="text"
                                    placeholder="User Name"
                                    name='username'
                                    value={SignupFormik.values.username}
                                    onChange={SignupFormik.handleChange}
                                    onBlur={SignupFormik.handleBlur}

                                />
                            </div>

                            {
                                SignupFormik.errors.Mail && SignupFormik.touched.Mail ?
                                    <p className='error-p'>{SignupFormik.errors.Mail}</p> : null
                            }
                            <div className="input-field">
                                <i className="fas fa-envelope"></i>

                                <input
                                    type="email"
                                    placeholder="Email"
                                    name='Mail'
                                    value={SignupFormik.values.Mail}
                                    onChange={SignupFormik.handleChange}
                                    onBlur={SignupFormik.handleBlur}

                                />
                            </div>
                            {
                                SignupFormik.errors.Password && SignupFormik.touched.Password ?
                                    <p className='error-p'>{SignupFormik.errors.Password}</p> : null
                            }
                            <div className="input-fieldp">
                                <i className="mx-2 fas fa-lock"></i>
                                <input
                                    className='text-secondary flex-grow-1'  // Added flex-grow-1 for input to take remaining space
                                    type={showSignupPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    name='Password'
                                    value={SignupFormik.values.Password}
                                    onChange={SignupFormik.handleChange}
                                    onBlur={SignupFormik.handleBlur}
                                />
                                <i className={`fas ${showSignupPassword ? 'fa-eye-slash' : 'fa-eye'}`} onClick={Signuppasswordtoggle}></i>
                            </div>
                            {
                                SignupFormik.errors.Confirm_password && SignupFormik.touched.Confirm_password ?
                                    <p className='error-p'>{SignupFormik.errors.Confirm_password}</p> : null
                            }

                            <div className="input-fieldp">
                                <i className="mx-2 fas fa-lock"></i>
                                <input
                                    className='text-secondary flex-grow-1'  // Added flex-grow-1 for input to take remaining space
                                    type={showSignupConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    name='Confirm_password'
                                    value={SignupFormik.values.Confirm_password}
                                    onChange={SignupFormik.handleChange}
                                    onBlur={SignupFormik.handleBlur}
                                />
                                <i className={`fas ${showSignupConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} onClick={Signupconfirmpasswordtoggle}></i>
                            </div>

                            <input type="submit" className="btn" value="Sign up" />

                            <ul>
                                <li className='text-secondary'>Password must contain at least one uppercase letter</li>
                                <li className='text-secondary'>one lowercase letter, one number</li>
                                <li className='text-secondary'>one special character</li>
                            </ul>

                        </form>
                    </div>
                </div>

                <div className="panels-container">
                    <div className="panel left-panel">
                        <div className="content">
                            <h3>Welcome to a New Era!</h3>
                            <p>Discover secure and mindful monitoring with our Parental Mobile Activity Tracker.</p>
                            <button className="btn transparent" id="sign-up-btn">
                                Sign up
                            </button>
                        </div>
                        <img src="img/register.svg" className="image" alt="" />
                    </div>
                    <div className="panel right-panel">
                        <div className="content">
                        <h3>Be part of our Tribe!</h3>
                        <p>Discover endless possibilities with a caring community. Join us now!</p>

                            <button className="btn transparent sign-up-mode" id="sign-in-btn">
                                Sign in
                            </button>
                        </div>
                        <img src="img/log.svg" className="image" alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
