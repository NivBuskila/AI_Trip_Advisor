import React, { useState, useRef } from "react";
import loadingImg from "../loading.png"; // Import the image directly
import { Link } from "react-router-dom";

const OLLAMA_URL = "http://localhost:11434/api/generate";

function MainPage() {
  const [country, setCountry] = useState("");
  const [tripKind, setTripKind] = useState("Bicycle");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null); // State to hold fetched data
  const resultRef = useRef(null); // Ref for the result section

  const requestData = {
    model: "llama2",
    prompt: "",
    stream: false,
    format: "json",
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    requestData.prompt = `a 3 popular ${tripKind} route in ${country},format: {routes:[{name:,full_description:,abbriviated_description,distance:,start:{name:,lat:,lng:},end:{name:,lat:,lng:}}]}`;

    fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.parse(data.response));
        setLoading(false);
        setResponseData(JSON.parse(data.response));
        scrollToResult(); // Scroll to the result section after fetching
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const scrollToResult = () => {
    resultRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    document
      .querySelector(".trip-input-container")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container">
      <section className="trip-input-container" style={{ height: "80vh" }}>
        <h1>Search for trip</h1>
        <form className="form-container">
          <div className="form-group">
            <label htmlFor="countryInput">Country</label>
            <input
              type="text"
              id="countryInput"
              placeholder="Enter country"
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tripKind">Transportation</label>
            <select
              name="trip-kind"
              id="tripKind"
              onChange={(e) => setTripKind(e.target.value)}
            >
              <option value="bicycle">Bicycle</option>
              <option value="walking">Walking</option>
              <option value="vehicle">Vehicle</option>
            </select>
          </div>
          <div className="form-group">
            <button
              id="button-run"
              onClick={handleSubmit}
              style={{ marginTop: "30px" }}
            >
              {!loading && <span>Find</span>}
              {loading && (
                <img src={loadingImg} alt="Loading..." id="loading-img" />
              )}{" "}
              {/* Make sure to provide an alt text */}
            </button>
          </div>
        </form>
        {responseData?.routes.length > 1 && (
          <>
            <h1>Routes</h1>
            <div
              className="route-links"
              style={{ display: "flex", gap: "20px" }}
            >
              {responseData?.routes.map((route, index) => (
                <div key={index} className="route-block">
                  <h2>{route.name}</h2>
                  <p>{route.abbreviated_description}</p>
                  <div className="route-detail">
                    <Link
                      className="route-link"
                      to={`/${route.name}`}
                      state={{ route: route }}
                    >
                      View Route
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default MainPage;
