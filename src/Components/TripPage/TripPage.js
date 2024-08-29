import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import loadingImg from "../../loading.png";
import "./TripPage.module.css";

const apiKey = "qccj98M9hoCYgTs6gnkRSw";
const stableHordeUrl = "https://stablehorde.net/api/v2/generate/async";
const stablePhotoGenerateURL =
  "https://stablehorde.net/api/v2/generate/status/";

function TripInfo() {
  const location = useLocation();
  const route = location.state ? location.state.route : null;
  const [photoUrl, setPhotoUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null); // Define the mapRef using useRef

  useEffect(() => {
    fetchPhotoUrl();

    const initializeGoogleMap = () => {
      const startLat = parseFloat(route.start.lat);
      const startLng = parseFloat(route.start.lng);
      const endLat = parseFloat(route.end.lat);
      const endLng = parseFloat(route.end.lng);

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 10,
        center: { lat: startLat, lng: startLng },
      });

      // Directions Service and Renderer
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      // Request the directions
      directionsService.route(
        {
          origin: { lat: startLat, lng: startLng },
          destination: { lat: endLat, lng: endLng },
          travelMode: "WALKING", // Adjust travel mode based on user needs
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Directions request failed due to ", status);
          }
        }
      );

      // // Add custom markers after the directions
      // new window.google.maps.Marker({
      //   position: { lat: startLat, lng: startLng },
      //   map,
      //   title: "Start Point",
      // });

      // new window.google.maps.Marker({
      //   position: { lat: endLat, lng: endLng },
      //   map,
      //   title: "End Point",
      // });
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBpbCkdTBSjenTuceUJQcOD6dFnC_udPrU`;
    script.async = true;
    script.onload = initializeGoogleMap; // Initialize the map once the script has loaded
    document.head.appendChild(script);
  }, []);

  const fetchPhotoUrl = async () => {
    try {
      const response = await fetch(stableHordeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: apiKey,
        },
        body: JSON.stringify({ prompt: route.name }),
      });
      const data = await response.json();
      await checkPhotoStatus(data.id);
    } catch (error) {
      console.error(error);
    }
  };

  const checkPhotoStatus = async (id) => {
    try {
      const response = await fetch(stablePhotoGenerateURL + id);
      const data = await response.json();
      if (data.generations.length === 0 || !data.generations[0].img) {
        setTimeout(() => checkPhotoStatus(id), 50000); // Check again after 1 minute
      } else {
        setPhotoUrl(data.generations[0].img);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="trip-info-container">
      <h1 style={{ textAlign: "center" }}>{route.name}</h1>
      <div className="route-info" style={{ padding: "10px 20px" }}>
        <p>{route.full_description}</p>
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        <div className="map-container" style={{ flex: 1 }}>
          <div
            ref={mapRef}
            style={{ width: "100%", height: "calc(100vh - 180px)" }}
          ></div>
        </div>
        <div
          className="photo-container"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {loading ? (
            <div className="loading-container">
              <img
                id="loading-img"
                src={loadingImg}
                alt="Loading..."
                style={{ width: 252, height: 250, padding: 20 }}
              />
              <p>Loading...</p>
            </div>
          ) : (
            <div className="photo">
              <img src={photoUrl} alt="Route" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripInfo;
