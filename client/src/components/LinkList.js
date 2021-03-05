import React from 'react';
import Link from './Links';
import { useQuery, gql } from '@apollo/client';

const FEED_QUERY = gql`
  {
    feed {
    count
    links {
      id
      description
      url
      postedBy {
        id
        name
      }
    }
  }
  }
`;

const LinkList = () => {
  const { data } = useQuery(FEED_QUERY);

  return (
    <div>
      { data && (
        <>
          { data.feed.links.map((link) => (
            <Link key={link.id} link={link} />
          ))}
        </>
      )}
    </div>
  );
};

export default LinkList;