import React from 'react';

const LocalSearch = ({ keyword, setKeyword }) => {

    // step 3 - create the handleSearchChange function 
    const handleSearchChange = (e) => {
        e.preventDefault();
        setKeyword(e.target.value.toLowerCase()); 
    }

    return (
        <div className="container pt-4 pb-4">
            <input 
                type="search" 
                placeholder="filter" 
                value={keyword} 
                onChange={handleSearchChange} 
                className="form-contorl mb-4" />
        </div>
    )
}

export default LocalSearch;