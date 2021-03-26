import React, { useRef } from "react";

const SignUpForm = ({ formState, validationState, onUpdate }) => {

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
      <div className={(validationState.name) ? "form-underline" : "form-underline invalid"}></div>
      <input className="input"
        value={formState.email}
        onChange={(e) => {
          onUpdate(e, 'email');
        }}
        type="email"
        placeholder="Netfang"
      />
      <div className={(validationState.email) ? "form-underline" : "form-underline invalid"}></div>
      <input
        className="input"
        value={formState.password}
        onChange={(e) => {
          onUpdate(e, 'password', password2);
        }}
        type="password"
        placeholder="Lykilorð"
      />
      <div className={(validationState.password) ? "form-underline" : "form-underline invalid"}></div>
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
      <div className={(validationState.passwordConf) ? "form-underline" : "form-underline invalid"}></div>
      <div className="validation">
        <ul>
          {!validationState.name && (<li>Nafn má aðeins innihalda stafi. Verður að vera a.m.k. tveir stafir</li>)}
          {!validationState.email && (<li>Netfang verður að vera gilt.</li>)}
          {!validationState.password && (<li>Lykilorð verður að vera a.m.k. 8 að lengd, innihalda a.m.k. einn stóran og einn lítinn staf. Má innihalda tákn.</li>)}
          {!validationState.passwordConf && (<li>Vinsamlegast staðfestu rétt lykiliorð</li>)}
        </ul>
      </div>
    </div>
  );
}

export default SignUpForm;