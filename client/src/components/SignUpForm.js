import React, { useRef } from "react";

const SignUpForm = ({ formState, onUpdate }) => {

  const password2 = useRef();

  return (
    <div className="form logIn">
      <input className="input"
        value={formState.name}
        onChange={(e) => {
          onUpdate(e, 'name');
        }}
        type="text"
        placeholder="Nafn"
      />
      <input className="input"
        value={formState.email}
        onChange={(e) => {
          onUpdate(e, 'email');
        }}
        type="email"
        placeholder="Netfang"
      />
      <input
        className="input"
        value={formState.password}
        onChange={(e) => {
          onUpdate(e, 'password', password2);
        }}
        type="password"
        placeholder="Lykilorð"
      />
      <input
        ref={password2}
        className="input"
        value={formState.passwordConf}
        onChange={(e) => {
          onUpdate(e, 'password2');
        }}
        type="password"
        placeholder="Staðfesta lykilorð"
      />
    </div>
  );
}

export default SignUpForm;