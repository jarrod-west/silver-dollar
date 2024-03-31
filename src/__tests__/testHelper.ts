export const mockQuery = jest.fn();
export const mockSendMessage = jest.fn();

jest.mock("webextension-polyfill", () => ({
  __esModule: true,
  default: {
    tabs: {
      query: mockQuery,
      sendMessage: mockSendMessage,
    },
  },
}));
