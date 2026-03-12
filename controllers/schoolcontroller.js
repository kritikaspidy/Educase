const pool = require("../db");

// Haversine formula function in JS
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const addSchool = async (req, res) => {
  try {
    let { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required and must be a non-empty string",
      });
    }

    if (!address || typeof address !== "string" || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required and must be a non-empty string",
      });
    }

    latitude = Number(latitude);
    longitude = Number(longitude);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be a valid number between -90 and 90",
      });
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be a valid number between -180 and 180",
      });
    }

    const query = `
      INSERT INTO schools (name, address, latitude, longitude)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      name.trim(),
      address.trim(),
      latitude,
      longitude,
    ]);

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      data: {
        id: result.insertId,
        name: name.trim(),
        address: address.trim(),
        latitude,
        longitude,
      },
    });
  } catch (error) {
    console.error("Error in addSchool:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const listSchools = async (req, res) => {
  try {
    let { latitude, longitude } = req.query;

    latitude = Number(latitude);
    longitude = Number(longitude);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: "Valid user latitude is required",
      });
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: "Valid user longitude is required",
      });
    }

    const [schools] = await pool.execute("SELECT * FROM schools");

    const sortedSchools = schools
      .map((school) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          school.latitude,
          school.longitude
        );

        return {
          ...school,
          distance: Number(distance.toFixed(2)),
        };
      })
      .sort((a, b) => a.distance - b.distance);

    return res.status(200).json({
      success: true,
      message: "Schools fetched successfully",
      userLocation: {
        latitude,
        longitude,
      },
      count: sortedSchools.length,
      data: sortedSchools,
    });
  } catch (error) {
    console.error("Error in listSchools:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addSchool,
  listSchools,
};