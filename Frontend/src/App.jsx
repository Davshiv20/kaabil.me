import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import ReactGA from 'react-ga4';
import 'katex/dist/katex.min.css'; 
import Home from './Landing/home';
import Dashboard from './components/Dashboard/dboard';
import Lesson from './components/LessonPage/Lesson';
import Chapter from './components/ChapterPage/Chapter';

function App() {
  ReactGA.initialize('G-6PDH48B4F8');
  const [user, setUser] = useState(null);

	const getUser = async () => {
		try {
      console.log("hi")
      //https://kaabil-api.kaabil.me
      //http://localhost:3000
      //uncomment for production
		//	const url = "https://www.kaabil.me/api/auth/login/sucess";

    // uncomment for local dev
      const url = "http://localhost:3000/api/auth/login/sucess";
			const { data } = await axios.get(url, { withCredentials: true });
      console.log("i am here")
      console.log("this is the data = ",data)
      console.log("hi i am here 22")
			setUser(data.user);
     
		} catch (err) {
		//	console.log(err);
    
    console.error("Error fetching user data:", err);
		}
	};

	useEffect(() => {
		getUser();
	}, []);



  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Home/>} />
        <Route path='/dashboard/lesson' element={user ?<Lesson user={user}/>: <Home/>}/>
        <Route path='/dashboard/Lesson/chapter' element={user ? <Chapter user={user}  />: <Home/>}/>
      </Routes>
    </Router>
  );
}

export default App;

