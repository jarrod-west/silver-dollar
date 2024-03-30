
export const TRANSPARENCY_SETTING = "transparency";

// const SETTINGS = [TRANSPARENCY_SETTING];

// export type SettingsMessage = {
//   [key: string]: string | number;
// }

export type Message = {
  type: "SETTINGS" | "DEBUG" | "ERROR";
}

export type SettingsMessage = Message & {
  type: "SETTINGS",
  transparency?: number;
}

export type DebugMessage = Message & {
  type: "DEBUG";
  message: string;
}

export type ErrorMessage = Message & {
  type: "ERROR";
  message: string;
}