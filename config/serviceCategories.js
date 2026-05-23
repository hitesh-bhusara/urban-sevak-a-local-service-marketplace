/**
 * Service → Category Mapping
 * Automatically assigns category based on selected service
 */

const serviceCategoryMap = {
  // 🏠 Home & Maintenance Services
  "Elder care": "Home & Maintenance Services",
  "Plumber": "Home & Maintenance Services",
  "Electrician": "Home & Maintenance Services",
  "Gardener": "Home & Maintenance Services",
  "House cleaning / maid": "Home & Maintenance Services",

  // 🧹 On-demand Workers
  "Daily wage worker": "On-demand Workers",
  "Movers & packers": "On-demand Workers",
  "Construction labor": "On-demand Workers",

  // 🧠 Digital Services
  "Website developer": "Digital Services",
  "Content creator": "Digital Services",

  // 🐾 Pet Services
  "Pet grooming": "Pet Services",
  "Dog walking": "Pet Services",

  // 🏥 Health & Wellness
  "Doctor (General / Specialist)": "Health & Wellness",
  "Personal coach": "Health & Wellness",
  "Home nursing": "Health & Wellness",

  // 🚗 Automobile Services
  "Car repair & servicing": "Automobile Services",
  "Bike repair": "Automobile Services",
  "Car wash / bike wash": "Automobile Services",
  "Taxi / cab driver": "Automobile Services",

  // 📚 Education & Learning
  "Home tutor": "Education & Learning",
  "Online tutor": "Education & Learning",

  // 🎉 Events
  "Wedding decorator": "Events",
  "Photographer / videographer": "Events",
  "Makeup artist": "Events",

  // ⚖️ Professional Services
  "Lawyer": "Professional Services",
  "Security guard / watchman": "Professional Services",

  // 📦 Utility & Technology
  "Courier / delivery": "Utility & Technology",
  "Computer / laptop repair": "Utility & Technology",
  "Mobile repair": "Utility & Technology"
};

// All categories with metadata for UI
const categories = [
  {
    name: "Home & Maintenance Services",
    icon: "🏠",
    services: ["Elder care", "Plumber", "Electrician", "Gardener", "House cleaning / maid"]
  },
  {
    name: "On-demand Workers",
    icon: "🧹",
    services: ["Daily wage worker", "Movers & packers", "Construction labor"]
  },
  {
    name: "Digital Services",
    icon: "🧠",
    services: ["Website developer", "Content creator"]
  },
  {
    name: "Pet Services",
    icon: "🐾",
    services: ["Pet grooming", "Dog walking"]
  },
  {
    name: "Health & Wellness",
    icon: "🏥",
    services: ["Doctor (General / Specialist)", "Personal coach", "Home nursing"]
  },
  {
    name: "Automobile Services",
    icon: "🚗",
    services: ["Car repair & servicing", "Bike repair", "Car wash / bike wash", "Taxi / cab driver"]
  },
  {
    name: "Education & Learning",
    icon: "📚",
    services: ["Home tutor", "Online tutor"]
  },
  {
    name: "Events",
    icon: "🎉",
    services: ["Wedding decorator", "Photographer / videographer", "Makeup artist"]
  },
  {
    name: "Professional Services",
    icon: "⚖️",
    services: ["Lawyer", "Security guard / watchman"]
  },
  {
    name: "Utility & Technology",
    icon: "📦",
    services: ["Courier / delivery", "Computer / laptop repair", "Mobile repair"]
  }
];

// Helper: Get category for a service
function getCategoryForService(service) {
  return serviceCategoryMap[service] || "Other";
}

// Helper: Auto-assign category from services array
function getCategoryFromServices(services) {
  if (!services || services.length === 0) return null;
  const primaryService = services[0];
  return serviceCategoryMap[primaryService] || "Other";
}

module.exports = {
  serviceCategoryMap,
  categories,
  getCategoryForService,
  getCategoryFromServices
};
