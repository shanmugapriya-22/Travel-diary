import React, { useEffect, useState } from 'react';
import Navbar from '../../components/input/Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance.js';
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from '../../components/Cards/TravelStoryCard.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddEditTravelStory from './AddEditTravelStory.jsx';
import ViewTravelStory from './ViewTravelStory.jsx';
import EmptyCard from '../../components/Cards/EmptyCard.jsx';
import EmptyImg from '../../assets/images/emptycard.jpg';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle.jsx';

const Home = () => {
  const navigate = useNavigate();
  const [allStories, setAllStories] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Handle edit story click
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data });
  };

  // Handle view story click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  // Handle update favorite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    const newFavouriteStatus = !storyData.isFavourite; // Toggle the favourite status
    try {
      const response = await axiosInstance.put(`/update-is-favourite/${storyId}`, {
        isFavourite: newFavouriteStatus
      });
  
      if (response.data && response.data.story) {
        if (newFavouriteStatus) {
          toast.success("Story added to favourites");
        } else {
          toast.success("Story removed from favourites");
        }
        if(filterType === "search" && searchQuery){
          onSearch(searchQuery);
        }else if(filterType === "date"){
          filterStoriesByDate(dateRange);
        }
        else{
        getAllTravelStories(); // Refresh the list of stories
      }}
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };
  
  
  

  // Delete story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-story/${storyId}`);
      if (response.status === 200) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      } else {
        toast.error("Failed to delete story. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // Search story
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: { query },
      });
      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  };

  // Handle filter travel story by date range
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;
      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-stories/filter", {
          params: { startDate, endDate },
        });
        if (response.data && response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Handle date range select
  const handleDayClick = (day) => {
    setDateRange(day); // Ensure the correct 'day' object is set
    filterStoriesByDate(day); // Pass 'day' correctly to filterStoriesByDate
  };
  const resetFilter=()=>{
    setDateRange({from:null ,to:null});
    setFilterType("");
    getAllTravelStories();
  }

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory} 
        handleClearSearch={handleClearSearch} 
      />

      <div className='container mx-auto py-10'>
        <FilterInfoTitle
        filterType={filterType}
        filterDates={dateRange}
        onClear={()=>{
          resetFilter();
        }}
        />
        <div className='flex gap-7'>
          <div className='flex-1'>
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard imgSrc={EmptyImg} message="No travel stories yet! Click 'Add' to start your first story!" />
            )}
          </div>
          <div className='w-[350px]'>
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className='p-3'>
                <DayPicker 
                  captionLayout="dropdown-button"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pageNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add & edit travel story modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 999 },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* View travel story modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => setOpenViewModal({ isShown: false, data: null })}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 999 },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => deleteTravelStory(openViewModal.data || null)}
        />
      </Modal>

      <button
        className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10'
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
