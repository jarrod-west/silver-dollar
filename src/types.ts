
export const TRANSPARENCY_SETTING = "transparency";

// const SETTINGS = [TRANSPARENCY_SETTING];

// export type SettingsMessage = {
//   [key: string]: string | number;
// }

export type BaseMessage = {
  type: "SETTINGS" | "DEBUG" | "ERROR";
}

export type Settings = {
  transparency: number;
  fuzziness: number;
  titleOnly: boolean;
}

export type SettingsMessage = BaseMessage & Partial<Settings> & {
  type: "SETTINGS",
}

export type DebugMessage = BaseMessage & {
  type: "DEBUG";
  message: string;
}

export type ErrorMessage = BaseMessage & {
  type: "ERROR";
  message: string;
}

export type Message = SettingsMessage | DebugMessage | ErrorMessage;