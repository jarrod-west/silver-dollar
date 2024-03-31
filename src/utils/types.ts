export type BaseMessage = {
  type: "SETTINGS" | "DEBUG" | "ERROR";
};

export type MessageResponse = {
  response: "Success" | "Error";
};

export type RawSettings = {
  enabled: boolean;
  transparency: number;
  fuzziness: number;
  titleOnly: boolean;
};

export type SettingsMessage = BaseMessage &
  Partial<RawSettings> & {
    type: "SETTINGS";
  };

export type DebugMessage = BaseMessage & {
  type: "DEBUG";
  message: string;
};

export type ErrorMessage = BaseMessage & {
  type: "ERROR";
  message: string;
};

export type Message = SettingsMessage | DebugMessage | ErrorMessage;
