import React, { useEffect, useRef, useState } from 'react';

const WoosmapMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const loadWoosmap = () => {
      return new Promise((resolve) => {
        if (window.woosmap) {
          resolve();
        } else {
          const script = document.createElement('script');
          script.src = 'https://sdk.woosmap.com/map/map.js?key=woos-9e4bd26b-896f-33ad-a3d8-b72907ebf31c';
          script.async = true;
          script.onload = resolve;
          document.head.appendChild(script);
        }
      });
    };

    const initMap = () => {
      const center = { lat: 51.52, lng: -0.13 };
      const newMap = new window.woosmap.map.Map(mapRef.current, {
        zoom: 8,
        center: center,
      });

      const newMarker = new window.woosmap.map.Marker({
        position: newMap.getCenter(),
        map: newMap,
        icon: {
          url: "https://images.woosmap.com/marker.png",
          scaledSize: {
            height: 50,
            width: 32,
          }
        },
      });

      setMap(newMap);
      setMarker(newMarker);
    };

    loadWoosmap().then(initMap);
  }, []);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000');

    eventSource.onmessage = (event) => {
      try {
        const { latlng } = JSON.parse(event.data);

          marker.setPosition(latlng);
          map.setCenter(latlng);

      } catch (error) {
        console.error("Error receiving SSE data:", error);
      }
    };
  }, [marker, map]);

  return <div ref={mapRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default WoosmapMap;