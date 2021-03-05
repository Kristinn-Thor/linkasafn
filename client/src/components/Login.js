
import React, { useState } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import { useAuthToken } from './AuthToken';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../mutations';

const Login = () => {
  const history = useHistory();
  // Notum useAuthToken react-krókinn sem við útfærðum til þess að vista lykilinn
  // sem við fáum sem svar frá serverinum ef innskráning eða nýskráning heppnast.
  // Lykillin (token) er vistað sem 'vafrakaka'
  const [, setAuthToken,] = useAuthToken();

  const [formState, setFormState] = useState({
    loading: false,
    login: true,
    email: '',
    password: '',
    name: ''
  });

  const [errorState, setError] = useState({
    error: false,
    message: ''
  })

  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password
    },
    onError: (error) => {
      setError({ ...error, error: true, message: "Villa við innskráningu. Notandanafn eða lykilorð vitlaust" });
      console.info(errorState.message);
    },
    onCompleted: ({ login }) => {
      setAuthToken(login.token);
      history.push('/');
    }
  });

  const [signup, { loading: signupLoading }] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formState.name,
      email: formState.email,
      password: formState.password
    },
    onError: (error) => {
      setError({ ...error, error: true, message: "Villa við innskráningu." });
      console.info(errorState.message);
    },
    onCompleted: ({ signup }) => {
      setAuthToken(signup.token);
      history.push('/');
    }
  });

  if (loginLoading) return <p>Loading...</p>;
  if (signupLoading) return <p>Loading...</p>;

  return (
    <>
      <h4 >{formState.login ? 'Innskráning' : 'Nýskráning'}</h4>
      <div>
        {!formState.login && (
          <input
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            type="text"
            placeholder="Nafn"
          />
        )}
        <input
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          type="email"
          placeholder="Netfang"
        />
        <input
          value={formState.password}
          onChange={(e) => setFormState({ ...formState, password: e.target.value })}
          type="password"
          placeholder="Lykilorð"
        />
      </div>
      <div>
        <button
          className="button"
          onClick={formState.login ? login : signup} >
          {formState.login ? 'innskráning' : 'nýskráning'}
        </button>
        <button
          className="button"
          onClick={(e) => setFormState({ ...formState, login: !formState.login })} >
          {formState.login ? 'skrá nýjan reikning?' : 'nú þegar með reikning?'}
        </button>
      </div>

      { errorState.error && (
        <>
          <h3>Villa</h3>
          <p>{errorState.message}</p>
        </>
      )}
    </>
  );
};

export default Login;