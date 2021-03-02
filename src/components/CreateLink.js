import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useHistory } from "react-router";

const CREATE_LINK_MUTATION = gql`
  mutation PostMutation(
    $description: String!
    $url: String!
    ) {
      post(description: $description, url: $url) {
        id
        url
        description
      }
    }
`;

const CreateLink = () => {
  const [formState, setFormState] = useState({
    description: '',
    url: ''
  });

  const history = useHistory();

  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url
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