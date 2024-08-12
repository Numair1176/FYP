import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Codeverfication from "./components/Login/Codeverfication";
import Login from "./components/Login/Login";
import Setnewpassword from "./components/Login/Setnewpassword";
import PrivateCompnent from "./components/PrivateCompnent";
import Apps from "./components/pages/Apps";
import Connected from "./components/pages/Connected";
import Home from "./components/pages/Home";
import Locked from "./components/pages/Locked";
import Screenshots from "./components/pages/Screenshots";
import Notifications from "./components/pages/Notifications";
import Location from "./components/pages/Location";
import Calllogs from "./components/pages/Calllogs";
import Apppage from "./components/pages/Apppage";
import OtherPhones from "./components/pages/OtherPhones";
import Selectchild from "./components/pages/Selectchild";
import Appusage from "./components/pages/Appusage";
import Datausage from "./components/pages/Datausage";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Login />}></Route>
          <Route path="/code" exact element={<Codeverfication />}></Route>
          <Route
            path="/forgetpassword"
            exact
            element={<Codeverfication />}
          ></Route>
          <Route path="/setpassword" exact element={<Setnewpassword />}></Route>
          <Route path="/selectchild" exact element={<Selectchild />}></Route>

          <Route element={<PrivateCompnent />}>
            <Route path="/Home" exact element={<Home />}></Route>
            <Route path="/Calls" exact element={<Calllogs />}></Route>
            <Route path="/App" exact element={<Apppage />}></Route>
            <Route path="/Screenshots" exact element={<Screenshots />}></Route>
            <Route
              path="/Notification"
              exact
              element={<Notifications />}
            ></Route>
            <Route path="/Apps" exact element={<Apps />}></Route>
            <Route
              path="/Connectedphones"
              exact
              element={<OtherPhones />}
            ></Route>
            <Route path="/Lockedapps" exact element={<Locked />}></Route>
            <Route path="/Lastlocation" exact element={<Location />}></Route>
            <Route path="/Appusage" exact element={<Appusage />}></Route>
            <Route path="/Datausage" exact element={<Datausage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
