import React from 'react';
import { NavLink } from 'react-router-dom';

const Error = () => (
  <div className="bounds">
    <div className="grid-100">
      <h1 className="noResults">Error</h1>
      <h2 align="center">500 Internal Server Error</h2>
      <NavLink to="/" className="button center">Course List</NavLink>
    </div>
  </div>
);

export default Error;