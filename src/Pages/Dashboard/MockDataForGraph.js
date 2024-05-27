export const MockData = [
  {
    label: "Mcdonld's",
    directlyHiredWorkers: 45,
    thirdParty: 30,
    domesticMigrants: 41,
  },
  {
    label: "Tim Hortin's",
    directlyHiredWorkers: 25,
    thirdParty: 37,
    domesticMigrants: 48,
  },
  // Additional objects
  {
    label: "Burger King",
    directlyHiredWorkers: 35,
    thirdParty: 28,
    domesticMigrants: 39,
  },
  {
    label: "Starbucks",
    directlyHiredWorkers: 20,
    thirdParty: 32,
    domesticMigrants: 45,
  },
  {
    label: "Subway",
    directlyHiredWorkers: 30,
    thirdParty: 25,
    domesticMigrants: 36,
  },
  {
    label: "Pizza Hut",
    directlyHiredWorkers: 22,
    thirdParty: 40,
    domesticMigrants: 29,
  },
  {
    label: "KFC",
    directlyHiredWorkers: 18,
    thirdParty: 35,
    domesticMigrants: 42,
  },
  {
    label: "Dunkin' Donuts",
    directlyHiredWorkers: 28,
    thirdParty: 30,
    domesticMigrants: 37,
  },
  {
    label: "Wendy's",
    directlyHiredWorkers: 33,
    thirdParty: 26,
    domesticMigrants: 34,
  },
  {
    label: "Chipotle",
    directlyHiredWorkers: 29,
    thirdParty: 33,
    domesticMigrants: 28,
  },
];

const data = MockData.map((mock) => {
  return [mock.directlyHiredWorkers, mock.thirdParty, mock.domesticMigrants];
});
const sumObjectValues = (array) => {
  return array.reduce(
    (accumulator, currentValue) => {
      accumulator.directlyHiredWorkers += currentValue.directlyHiredWorkers;
      accumulator.thirdParty += currentValue.thirdParty;
      accumulator.domesticMigrants += currentValue.domesticMigrants;
      return accumulator;
    },
    { directlyHiredWorkers: 0, thirdParty: 0, domesticMigrants: 0 }
  );
};
export const total = sumObjectValues(MockData);

console.log("Data", data);
