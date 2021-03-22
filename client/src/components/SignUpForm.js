import React, { useRef } from "react";
import isEmail from 'validator/lib/isEmail';
import isAlpha from 'validator/lib/isAlpha';

const SignUpForm = ({ formState, setFormState, validationState, setValidationState }) => {
  //######################################################## CLIENT-SIDE VALIDATION #########################################
  const validatePassword = (password) => {
    // Lykilorð verður að vera 8-200 stafir. Innihalda a.m.k. einn stóran staf og einn lítinn staf. Má innihalda tákn.
    const isValid = password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,200}$/);
    if (isValid) return true;
    return false;
  };
  const password2 = useRef(null);

  return (
    <div className="form logIn">
      <input className="input"
        value={formState.name}
        onChange={(e) => {
          setFormState({ ...formState, name: e.target.value });
          if (isAlpha(e.target.value) && e.target.value.length >= 2) {
            e.target.classList.remove('invalid');
            setValidationState({ ...validationState, name: true });
          }
          else {
            e.target.classList.add('invalid');
            setValidationState({ ...validationState, name: false });
          };
        }}
        type="text"
        placeholder="Nafn"
      />
      <input className="input"
        value={formState.email}
        onChange={(e) => {
          setFormState({ ...formState, email: e.target.value });
          if (isEmail(e.target.value)) {
            e.target.classList.remove('invalid');
            setValidationState({ ...validationState, email: true });
          }
          else {
            e.target.classList.add('invalid');
            setValidationState({ ...validationState, email: false });
          };
        }}
        type="email"
        placeholder="Netfang"
      />
      <input
        className="input"
        value={formState.password}
        onChange={(e) => {
          setFormState({ ...formState, password: e.target.value });
          console.info(password2.current.value);
          if (validatePassword(e.target.value) && (e.target.value === password2.current.value || password2.current.value === '')) {
            e.target.classList.remove('invalid');
            setValidationState({ ...validationState, password: true });
          }
          else {
            e.target.classList.add('invalid');
            setValidationState({ ...validationState, password: false });
          };
        }}
        type="password"
        placeholder="Lykilorð"
      />
      <input
        ref={password2}
        className="input"
        value={formState.passwordConf}
        onChange={(e) => {
          setFormState({ ...formState, passwordConf: e.target.value });
          if (e.target.value === formState.password) {
            e.target.classList.remove('invalid');
            setValidationState({ ...validationState, passwordConf: true });
          }
          else {
            e.target.classList.add('invalid');
            setValidationState({ ...validationState, passwordConf: false });
          };
        }}
        type="password"
        placeholder="Staðfesta lykilorð"
      />
    </div>
  );
}

export default SignUpForm;