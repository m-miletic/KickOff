import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';


// ************** ubacit i admin i users requests ode ii bolje podjelit po rolama s obzirom da nisu iste komponente bas ? **************

const ShowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState({});

  const location = useLocation(); // u navbar-u koristim navigate koji ima props state koji salje user id, na temelju user id-a imma podatke o useru i minjan sta komponenta display-as tj. minjan UI
  const userId = location.state.userId;


  // dohvatit usera koji je ulogiran preko userId kojeg sam poslao iz navbar-a u navigate-u
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.log("Error while fetching user: ", error.message)
      }
    }
    fetchUser();
  }, []);


  // provjerit rolu dohvacenog user-a i na osnovu toga dohvatit request objekte
  {user.role === 'ADMIN' ? (
    useEffect(() => {
      const fetchAllRequests = async () => {
        try {
          const response = await axios.get();
        } catch (error) {
          console.error("fetchAllRequests: ", error);
        } 

      }
    })
  ) : (
    useEffect(() => { 
      const fetchUsersRequests = async () => {
        try {
          const response = await axios.get();
        } catch (error) {
          console.error("fetchUsersRequests: ", error);
        }

      }
    })
  )}


  // triba bi postavit uvjet sta ce se dohvacat ovo se dohvaca u slucaju da user nije admin
/*   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/requests/user/by-user/${userId}`);
        console.log("response: ", response);
        setRequests(response.data);
      } catch (error) {
        console.log("",error.message);
      }
    }
    fetchData();
  }, []); */

  
  return (
    <div className='text-white'>
      <div className='text-white grid place-items-center mt-20'>
        <h1 className='text-2xl'>Requests</h1> {/* ubacit acepted, declined ... sa use stateom kada vrtim filter da se minja i to */}
          {requests.map((request, index) => {
            return(
              <div key={index}>
                {request.message}
              </div>
            );
          })}
      </div>

    </div>
  )
}
export default ShowRequests;