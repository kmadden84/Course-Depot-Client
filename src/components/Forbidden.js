import React from 'react';
import { NavLink } from 'react-router-dom';

const Forbidden = () => (
  <div className="bounds">
    <div className="grid-100">
      <h1 className="noResults">Forbidden</h1>
      <h2 align="center">Courses may only be updated by their owner</h2>
      <NavLink to="/" className="button center">Course List</NavLink>
    </div>
  </div>
);

export default Forbidden;