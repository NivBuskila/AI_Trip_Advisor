import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import TripPage from "./TripPage/TripPage";

function Router() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/:name" element={<TripPage />} />
      </Routes>
    </div>
  );
}

export default Router;
