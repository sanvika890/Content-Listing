import './App.css';
import { Typography, Button } from '@mui/material';
import { useNavigate } from "react-router";


function App() {
let navigate = useNavigate();

  return (
    <div className="App" >
      <div style={{alignItems:"center", justifyContent:"center", display:"flex",  width:"100vw", height:"100vh", flexDirection:"column"}}>
     <Typography variant="h4" textAlign="center" style={{marginBottom:"0.5rem"}}>Welcome to my Movie Listing</Typography>
     <Button variant="contained" size='large' onClick={()=>navigate("/listing")}>Go to Listing</Button>
      </div>
    </div>
  );
}

export default App;
