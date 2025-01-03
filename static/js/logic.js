// Create the map object and set default view
let map = L.map("map").setView([37.5, -98.5], 4);

// Create tile layer (base map)
let streetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap contributors"
});

// Add tile layer to map
streetMap.addTo(map);

// Define the URL to fetch the earthquake data
const earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 4;
}

// Function to determine marker color based on depth
function markerColor(depth) {
    if (depth > 90) return "#d73027";
    else if (depth > 70) return "#fc8d59";
    else if (depth > 50) return "#fee08b";
    else if (depth > 30) return "#d9ef8b";
    else if (depth > 10) return "#91cf60";
    else return "#1a9850";
}

// Fetch the earthquake data and add to the map
fetch(earthquakeDataUrl)
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      const [longitude, latitude, depth] = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const place = feature.properties.place;
      
      // Create a circle marker for each earthquake
      L.circleMarker([latitude, longitude], {
        radius: markerSize(magnitude),
        fillColor: markerColor(depth),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map)
      .bindPopup(`<h3>${place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p>`);
    });

    // Create the legend
    const legend = L.control({ position: "bottomright" });

    // Legend content
    legend.onAdd = function () {
        
        // Define depth ranges and colors
        const div = L.DomUtil.create("div", "info legend");
        const depths = [-10, 10, 30, 50, 70, 90];
        const colors = ["#1a9850", "#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"];
        
        // Legend title
        div.innerHTML += "<h4>Depth (km)</h4>";

        // Legend color-depth ranges
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
              `<i style="background: ${colors[i]}; width: 18px; height: 18px; display: inline-block;"></i> ${depths[i]}${depths[i + 1] ? `&ndash;${depths[i + 1]}<br>` : "+"}`;
          }
    
        return div;
    };

    // Add legend to map
    legend.addTo(map);
  })

  // Check for errors
  .catch(error => console.error("Error fetching earthquake data: ", error));