
export const TRANSPARENCY_SETTING = "transparency";

export type BaseMessage = {
  type: "SETTINGS" | "DEBUG" | "ERROR";
}

export type RawSettings = {
  transparency: number;
  fuzziness: number;
  titleOnly: boolean;
}

export type SettingsMessage = BaseMessage & Partial<RawSettings> & {
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