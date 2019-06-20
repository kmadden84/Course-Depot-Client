import React from 'react';
import { NavLink } from 'react-router-dom';

const NoResults = () => (
  <div className="bounds">
    <div className="grid-100">
      <h1 className="noResults">No Results Found</h1>
      <h2 align="center">This is not the route you are looking for.</h2>
      <NavLink to="/" className="button center">Course List</NavLink>
    </div>
  </div>
);

export default NoResults;