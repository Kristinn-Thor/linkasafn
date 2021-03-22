
import React, { useState } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import { useAuthToken } from './AuthToken';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../mutations';
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const Login = () => {
  const history = useHistory();
  // Notum useAuthToken react-krókinn sem við útfærðum til þess að vista lykilinn
  // sem við fáum sem svar frá serverinum ef innskráning eða nýskráning heppnast.
  // Lykillin (token) er vistað sem 'vafrakaka'
  const [, setAuthToken,] = useAuthToken();

  //######################################################## STATES ########################################################
  const [formState, setFormState] = useState({
    login: true,
    email: '',
    password: '',
    passwordConf: '',
    name: ''
  });

  const [validationState, setValidationState] = useState({
    email: false,
    password: false,
    passwordConf: false,
    name: false,
  });

  const [errorState, setError] = useState({
    error: false,
    message: ''
  });

  //######################################################## LOG IN HOOK ########################################################
  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password
    },
    onError: (error) => {
      setError({ ...errorState, error: true, message: "Villa við innskráningu. Notandanafn eða lykilorð vitlaust" });
    },
    onCompleted: ({ login }) => {
      setAuthToken(login.token);
      history.push('/');
    }
  });
  //##############################################################################################################################
  //######################################################## SIGN UP HOOK ########################################################
  const [signup, { loading: signupLoading }] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formState.name,
      email: formState.email,
      password: formState.password
    },
    onError: (error) => {
      setError({ ...errorState, error: true, message: "Villa við innskráningu." });
    },
    onCompleted: ({ signup }) => {
      setAuthToken(signup.token);
      history.push('/');
    }
  });
  //##############################################################################################################################
  if (loginLoading) return <p>Loading...</p>;
  if (signupLoading) return <p>Loading...</p>;

  return (
    <div>
      <h4 >{formState.login ? 'Innskráning' : 'Nýskráning'}</h4>
      {!formState.login && (
        <SignUpForm
          formState={formState}
          setFormState={setFormState}
          validationState={validationState}
          setValidationState={setValidationState} />
      )}
      {formState.login && (
        <LoginForm formState={formState} setFormState={setFormState} />
      )}
      <div>
        <button
          className={(true) ? 'button' : 'button invalid'}
          onClick={(e) => {
            if (!formState.login) {
              if (validationState.name && validationState.email && validationState.password && validationState.passwordConf) {
                return console.info("The form is Valid : )", validationState); // login
              } else return console.info("The form is invalid", validationState);
            } else return console.info(`Logging in user ${formState.email}`)//login;
          }}
        >
          {formState.login ? 'Innskráning' : 'Nýskráning'}
        </button>
        <button
          className="button"
          onClick={(e) => {
            setFormState({ ...formState, login: !formState.login });
          }}
        >
          {formState.login ? 'Skrá nýjan reikning?' : 'Aftur á innskráningu'}
        </button>
      </div>

      { errorState.error && (
        <>
          <h3>Villa</h3>
          <p>{errorState.message}</p>
        </>
      )}
    </div>
  );
};

export default Login;