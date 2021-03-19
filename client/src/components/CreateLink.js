import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from "react-router";
import { CREATE_LINK_MUTATION } from '../mutations';

const CreateLink = () => {
  const [formState, setFormState] = useState({
    description: '',
    url: ''
  });

  const [errorState, setError] = useState({
    error: false,
    message: 'Obbosí villa við að skrá link'
  });

  const history = useHistory();

  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url
    },
    onError: (error) => {
      setError({ ...errorState, error: true });
      console.info(error);
    },
    onCompleted: () => history.push('/')
  });

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        createLink();
      }}
    >
      <div className="form-fields">
        <input
          className="input"
          value={formState.description}
          onChange={(e) => setFormState({ ...formState, description: e.target.value })}
          type="text"
          placeholder="Lýsing á linknum"
        />
        <input
          className="input"
          value={formState.url}
          onChange={(e) => setFormState({ ...formState, url: e.target.value })}
          type="text"
          placeholder="Vefslóðin á linkinn"
        />
      </div>
      <button className="button" type="submit">Skrá link</button>
    </form>
  );
};

export default CreateLink;