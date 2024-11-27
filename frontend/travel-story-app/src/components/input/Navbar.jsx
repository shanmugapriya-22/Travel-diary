import React from 'react';
import LOGO from "../../assets/images/logo.png";
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';


const Navbar = ({userInfo,searchQuery,setSearchQuery,onSearchNote,handleClearSearch}) => {
    const isToken=localStorage.getItem("token");
    const navigate=useNavigate();


    const onLogout=()=>{
        localStorage.clear();
        navigate("/login");
    }
    const handleSearch=()=>{
      if(searchQuery){
        onSearchNote(searchQuery);
      }

    };

    const onClearSearch=()=>{
      handleClearSearch();
      setSearchQuery("")
    };
    
  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
      
      <h1 className="text-2xl font-bold text-cyan-600 px-4 py-2 rounded-lg flex items-center">
  <span className="font-[Pacifico] text-3xl font-light">Travel </span> 
  <span className=" text-gray-500 font-[Pacifico] font-light text-3xl pl-1"> Scribbles</span>
  <i className="fas fa-plane ml-2 text-xl"></i> {/* Travel icon */}
</h1>



      {isToken && (
        <>
        <SearchBar
        value={searchQuery}
        onChange={({target})=>{
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}/>
        <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>{" "}</>)}
    </div>
  );
}

export default Navbar;
