import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Setup from "./Setup";
import CreateApartment from './CreateApartment';
import ParkingGrid from "./ParkingGrid";
import JoinCode from "./JoinCode";
import Notification from "./Notification";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="select" element={<Setup />}/>
        <Route path="join" element={<JoinCode/>}/>
        <Route path="create" element={<CreateApartment/>}/>
        <Route path="view/:JoinCode" element={<ParkingGrid/>}/>
        {/*<Route path="notification" element={<Notification/>}/>*/}
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>404 Not Found</p>
            </main>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
