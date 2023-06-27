interface ColorsTable {
  0: "grey",
  1: "red",
  2: "yellow",
  3: "green"
}

export type Colors = "grey" | "red" | "yellow" | "green";
export type Keys = "field1" | "field2" | "field3"

export type Levels = {
  [key in Keys]: Colors
}


const colorsTable: ColorsTable = {
  0: "grey",
  1: "red",
  2: "yellow",
  3: "green"
}
