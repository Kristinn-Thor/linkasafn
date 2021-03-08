import React from 'react';
import { useAuthToken } from './AuthToken';
import { LINKS_PER_PAGE } from "../constants";
import { timeDifferenceForDate } from "../utils";
import { useMutation } from '@apollo/client';
import { VOTE_MUTATION } from '../mutations';

const Link = (props) => {
  const [authToken, ,] = useAuthToken();
  const { link } = props;

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id
    }
  })

  const take = LINKS_PER_PAGE;
  const skip = 0;
  const orderBy = { createdAt: 'desc' };

  return (
    <div className="links">
      <div className="links-index">
        <span> {props.index + 1}. </span>
        {authToken && (
          <div className="links-vote" onClick={vote}>
            ▲
          </div>
        )}
      </div>
      <div className="links-content">
        <div className="links-text">
          {link.description} ({link.url})
      </div>
        {authToken && (
          <div className="links-info">
            {link.votes.length} votes | by {link.postedBy.name} {timeDifferenceForDate(link.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Link;