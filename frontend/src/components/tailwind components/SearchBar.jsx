import React, { useState } from 'react';
// import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   const onhandleSubmit = (e) => {
//     e.preventDefault();
//     if (searchTerm) {
//       navigate(`/search/${searchTerm}`);
//       setSearchTerm('');
//     }
//   };

  return (
    <form onSubmit={onhandleSubmit} className="flex items-center rounded-full border border-gray-300 pl-4 shadow-none mr-5 sm:mr-0">
      <input
        className="search-bar outline-none flex-grow p-2 rounded-full"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="p-2 text-red-500" aria-label="search">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
