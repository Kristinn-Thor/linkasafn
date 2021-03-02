import { useMutation, gql } from "@apollo/client";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { AUTH_TOKEN } from "./constants";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation(
    $email: String!
    $password: String!
    $name: String!
  ) {
    signup(
      email: $email
      password: $password
      name: $name
    ) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $email: String!
    $password: String!
  ) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const history = useHistory();

  const [formState, setFormState] = useState({
    login: true,
    email: '',
    password: '',
    name: ''
  });

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password
    },
    onCompleted: ({ login }) => {
      localStorage.setItem(AUTH_TOKEN, login.token);
      history.push('/');
    }
  });

  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
      name: formState.name,
      email: formState.email,
      password: formState.password
    },
    onCompleted: ({ signup }) => {
      localStorage.setItem(AUTH_TOKEN, signup.token);
      history.push('/');
    }
  });

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
    </>
  );
};

export default Login;