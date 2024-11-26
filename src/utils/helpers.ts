export const mapCabinClass = (cabinClass: string): string => {
  switch (cabinClass.toLowerCase()) {
    case "economy":
      return "economy";
    case "premium economy":
      return "premium_economy";
    case "business class":
      return "business";
    case "first class":
      return "first";
    default:
      return "economy"; // Default to economy if no match
  }
};

export const splitChildrenAndInfants = (childrenAges: number[]): { infants: number; childrens: number } => {
  let infants = 0;
  let childrens = 0;

  childrenAges.forEach((age) => {
    if (age < 2) {
      infants += 1; // Infant is under 2 years old
    } else if (age >= 2 && age <= 12) {
      childrens += 1; // Child is between 2 and 12 years
    }
  });

  return { infants, childrens };
};