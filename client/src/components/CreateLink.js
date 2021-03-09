import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from "react-router";
import { CREATE_LINK_MUTATION } from '../mutations';
import { LINKS_PER_PAGE } from "../constants";
import { FEED_QUERY } from '../queries';

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
    // Þurfum að uppfæra Apollo Store þegar við eyðum, búum til nýja eind (e.entity) 
    // eða uppfærum  margar eindir í einu.
    update: (cache, { data: { post } }) => {
      const take = LINKS_PER_PAGE;
      const skip = 0;
      const orderBy = { createdAt: 'asc' };

      // Náum í alla linka sem Apollo var búið að cache-a
      const data = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy
        }
      });

      // Uppfærum cache-ið með því að bæta nýja linknum í linka fylkið
      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: [post, ...data.feed.links]
          }
        },
        variables: {
          take,
          skip,
          orderBy
        }
      });
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