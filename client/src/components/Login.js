
import React, { useState } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import { useAuthToken } from './AuthToken';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../mutations';
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import isEmail from 'validator/lib/isEmail';
import isAlpha from 'validator/lib/isAlpha';

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
          e.target.classList.remove('invalid');
          setValidationState({ ...validationState, name: true });
        }
        else {
          e.target.classList.add('invalid');
          setValidationState({ ...validationState, name: false });
        };
        break;

      case 'email':
        setFormState({ ...formState, email: e.target.value });
        if (isEmail(e.target.value)) {
          e.target.classList.remove('invalid');
          setValidationState({ ...validationState, email: true });
        }
        else {
          e.target.classList.add('invalid');
          setValidationState({ ...validationState, email: false });
        };
        break;

      case 'password':
        setFormState({ ...formState, password: e.target.value });
        if (validatePassword(e.target.value)) {
          e.target.classList.remove('invalid');
          setValidationState({ ...validationState, password: true });
          if (e.target.value !== referance.current.value) {
            referance.current.classList.add('invalid');
            setValidationState({ ...validationState, password: true, passwordConf: false });
          } else {
            referance.current.classList.remove('invalid');
            setValidationState({ ...validationState, password: true, passwordConf: true });
          }
        }
        else {
          e.target.classList.add('invalid');
          setValidationState({ ...validationState, password: false });
          if (e.target.value !== referance.current.value) {
            referance.current.classList.add('invalid');
            setValidationState({ ...validationState, password: false, passwordConf: false });
          } else {
            referance.current.classList.remove('invalid');
            setValidationState({ ...validationState, password: false, passwordConf: true });
          }
        };
        break;

      case 'password2':
        setFormState({ ...formState, passwordConf: e.target.value });
        if (e.target.value === formState.password) {
          e.target.classList.remove('invalid');
          setValidationState({ ...validationState, passwordConf: true });
        }
        else {
          e.target.classList.add('invalid');
          setValidationState({ ...validationState, passwordConf: false });
        };
        console.info("Halló frá password2");
        break;

      default:
        return;
    }
  };

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
          onUpdate={handleFormChange}
        />
      )}
      {formState.login && (
        <LoginForm formState={formState} setFormState={setFormState} />
      )}
      <div className="validation">
        <ul>
          {!validationState.name && (<li>Nafn má aðeins innihalda stafi. Verður að vera a.m.k. tveir stafir</li>)}
          {!validationState.email && (<li>Netfang verður að vera gilt.</li>)}
          {!validationState.password && (<li>Lykilorð verður að vera a.m.k. 8 að lengd, innihalda a.m.k. einn stóran og einn lítinn staf. Má innihalda tákn.</li>)}
          {!validationState.passwordConf && (<li>Vinsamlegast staðfestu rétt lykiliorð</li>)}
        </ul>
      </div>
      <div>
        <button
          className={(true) ? 'button' : 'button invalid'}
          onClick={(e) => {
            if (!formState.login) {
              if (validationState.name && validationState.email && validationState.password && validationState.passwordConf) {
                return console.info("The form is Valid : )", validationState); // signup
              } else return console.info("The form is invalid", validationState); // sýna "validation" reglur
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