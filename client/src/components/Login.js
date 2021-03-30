
import React, { useState } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import { useAuthToken } from './AuthToken';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../mutations';
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import isEmail from 'validator/lib/isEmail';
import isAlpha from 'validator/lib/isAlpha';
import Loader from "./Loader";

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

  const [error, setError] = useState({
    isError: false,
    message: ''
  })
  //######################################################## HANDLERS & HELPERS ########################################################
  //######################################################## CLIENT-SIDE VALIDATION ####################################################
  const validatePassword = (password) => {
    // Lykilorð verður að vera 8-200 stafir. Innihalda a.m.k. einn stóran staf og einn lítinn staf. Má innihalda tákn.
    const isValid = password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,200}$/);
    if (isValid) return true;
    return false;
  };

  function handleFormChange(e, operation, referance) {

    switch (operation) {
      case 'name':
        setFormState({ ...formState, name: e.target.value });
        if (isAlpha(e.target.value) && e.target.value.length >= 2) {
          setValidationState({ ...validationState, name: true });
        }
        else {
          setValidationState({ ...validationState, name: false });
        };
        break;

      case 'email':
        setFormState({ ...formState, email: e.target.value });
        if (isEmail(e.target.value)) {
          setValidationState({ ...validationState, email: true });
        }
        else {
          setValidationState({ ...validationState, email: false });
        };
        break;

      case 'password':
        setFormState({ ...formState, password: e.target.value });
        if (validatePassword(e.target.value)) {
          setValidationState({ ...validationState, password: true });
          if (e.target.value !== referance.current.value) {
            setValidationState({ ...validationState, password: true, passwordConf: false });
          } else {
            setValidationState({ ...validationState, password: true, passwordConf: true });
          }
        }
        else {
          setValidationState({ ...validationState, password: false });
          if (e.target.value !== referance.current.value) {
            setValidationState({ ...validationState, password: false, passwordConf: false });
          } else {
            setValidationState({ ...validationState, password: false, passwordConf: true });
          }
        };
        break;

      case 'password2':
        setFormState({ ...formState, passwordConf: e.target.value });
        if (e.target.value === formState.password) {
          setValidationState({ ...validationState, passwordConf: true });
        }
        else {
          setValidationState({ ...validationState, passwordConf: false });
        };
        break;

      default:
        return;
    }
  };

  //######################################################## LOG IN HOOK ########################################################
  const [login, { loading: loginLoading, error: loginError }] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password
    },
    onError: (error) => setError({ isError: true, message: error.message }),
    onCompleted: ({ login }) => {
      setAuthToken(login.token);
      history.push('/');
    }
  });
  //##############################################################################################################################
  //######################################################## SIGN UP HOOK ########################################################
  const [signup, { loading: signupLoading, error: signupError }] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formState.name,
      email: formState.email,
      password: formState.password
    },
    onError: (error) => setError({ isError: true, message: error.message }),
    onCompleted: ({ signup }) => {
      setAuthToken(signup.token);
      history.push('/');
    }
  });
  //##############################################################################################################################
  if (loginLoading) return <Loader />;
  if (signupLoading) return <Loader />;

  return (
    <div>
      <h4 className="form-title" >{formState.login ? 'Innskráning' : 'Nýskráning'}</h4>
      {!formState.login && (
        <SignUpForm
          formState={formState}
          validationState={validationState}
          setFormState={setFormState}
          onUpdate={handleFormChange}
        />
      )}
      {formState.login && (
        <LoginForm formState={formState} setFormState={setFormState} />
      )}

      <div className="button-group">
        <button
          className={(formState.login ||
            (validationState.name &&
              validationState.email &&
              validationState.password &&
              validationState.passwordConf)) ? 'button' : 'button hidden'}
          onClick={(e) => {
            if (!formState.login) {
              if (validationState.name && validationState.email && validationState.password && validationState.passwordConf) {
                return signup();
              }
            } else return login();
          }}
        >
          {formState.login ? 'Innskráning' : 'Nýskráning'}
        </button>
        <button
          className="button"
          onClick={(e) => {
            setError({ isError: false, message: '' });
            setFormState({ ...formState, login: !formState.login });
          }}
        >
          {formState.login ? 'Skrá nýjan reikning?' : 'Aftur á innskráningu'}
        </button>
      </div>

      { error.isError && (
        <div className="form-error">
          <h3>Villa</h3>
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default Login;