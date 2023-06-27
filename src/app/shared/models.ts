export interface PasswordCheckList {
  long: boolean,
  digit: boolean,
  letter: boolean,
  symbol: boolean
}


export type Colors = "grey" | "red" | "yellow" | "green";
export type Keys = "field1" | "field2" | "field3"
export interface Levels {
  [key: number] : {
    [key in Keys]: Colors
  }
}

export type PasswordStrength = "Easy" | "Medium" | "Strong" | "Not enough symbols"





