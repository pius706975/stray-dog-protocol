import ShipFacilityCategory from "../models/ShipFacilityCategory";

const shipFacilityCategories = [
  {
    name: "Cargo Handling Equipment",
  },
  {
    name: "Deck Cranes",
  },
  {
    name: "Storage",
  },
  {
    name: "Towing Equipment",
  },
  {
    name: "Navigation Aids",
  },
  {
    name: "Communication",
  },
  {
    name: "Passenger Seating",
  },
  {
    name: "Vehicle Deck",
  },
  {
    name: "Passenger Lounge",
  },
  {
    name: "Entertainment",
  },
];

export const seedShipFacilityCategories = async () => {
  try {
    for (const shipFacilityCategoryObj of shipFacilityCategories) {
      const shipFacilityCategory = new ShipFacilityCategory(
        shipFacilityCategoryObj
      );
      await shipFacilityCategory.save();
    }
    console.log("Seeding ship facility categories completed");
  } catch (error) {
    console.log(error);
  }
};
