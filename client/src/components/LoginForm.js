import React from "react";

const LoginForm = ({ formState, setFormState }) => {

  return (
    <div className="form signIn">
      <input className="input"
        value={formState.email}
        onChange={(e) => {
          setFormState({ ...formState, email: e.target.value });
        }}
        type="email"
        placeholder="Netfang"
      />
      <div className="form-underline --purple"></div>
      <input className="input"
        value={formState.password}
        onChange={(e) => {
          setFormState({ ...formState, password: e.target.value });
        }}
        type="password"
        placeholder="Lykilorð"
      />
      <div className="form-underline --purple"></div>
    </div>
  );
}

export default LoginForm;