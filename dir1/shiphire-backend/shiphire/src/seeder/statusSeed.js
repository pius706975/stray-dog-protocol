import Status from "../models/Status";

const statuses = [
  {
    name: "rfq 1",
    desc: "RFQ sent",
    // isOpened: false,
  },
  {
    name: "proposal 1",
    desc: "Proposal received",
    // isOpened: true,
  },
  {
    name: "proposal 2",
    desc: "Proposal signed",
    // isOpened: true,
  },
  {
    name: "proposal 3",
    desc: "Proposal receipt sent",
    // isOpened: true,
  },
  {
    name: "proposal 4",
    desc: "Payment approved",
    // isOpened: true,
  },
  {
    name: "contract 1",
    desc: "Contract received",
    // isOpened: true,
  },
];

export const seedStatuses = async () => {
  try {
    for (const status of statuses) {
      const statusAdded = new Status({
        name: status.name,
        desc: status.desc,
        // date: new Date(),
      });

      await statusAdded.save();
      console.log(`Status ${status.name} added`);
    }
  } catch (error) {
    console.error(`Error seeding statuses:`, error);
  }
};
