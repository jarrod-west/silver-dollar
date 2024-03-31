import {
  createElement,
  flushPromises,
  mockStorage,
} from "../../__tests__/testHelper";
import { getStoredSetting, getStoredSettings, PopupSetting } from "../settings";
import * as helpers from "../helpers";

describe("getStoredSetting", () => {
  it("retrieves the stored value", async () => {
    mockStorage.mockResolvedValueOnce({ transparency: 12345 });

    expect(await getStoredSetting("transparency")).toEqual(12345);
    expect(mockStorage).toHaveBeenCalledWith("transparency");
  });

  it("returns the default if no stored value found", async () => {
    mockStorage.mockResolvedValueOnce(null);

    expect(await getStoredSetting("transparency")).toEqual(70);
    expect(mockStorage).toHaveBeenCalledWith("transparency");
  });
});

describe("getStoredSettings", () => {
  it("retrieves the stored values", async () => {
    const mockResult = {
      enabled: false,
      transparency: 12345,
      fuzziness: -45,
      titleOnly: false,
    };

    mockStorage.mockResolvedValueOnce(mockResult);

    expect(await getStoredSettings()).toEqual(mockResult);
    expect(mockStorage).toHaveBeenCalledWith(null);
  });

  it("retrieves defaults if no stored value found", async () => {
    const mockResult = {
      enabled: false,
      fuzziness: -45,
    };

    mockStorage.mockResolvedValueOnce(mockResult);

    expect(await getStoredSettings()).toEqual({
      ...mockResult,
      transparency: 70,
      titleOnly: true,
    });
    expect(mockStorage).toHaveBeenCalledWith(null);
  });
});

describe("PopupSetting", () => {
  const name = "transparency";
  const uiType = "slider";
  const initialSettings = {
    enabled: false,
    transparency: 12345,
    fuzziness: -45,
    titleOnly: false,
  };

  const addEventListenerSpy = jest.spyOn(
    HTMLElement.prototype,
    "addEventListener",
  );
  const getElementSpy = jest.spyOn(document, "getElementById");

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("handles the UI element not being found", () => {
    const popupSetting = new PopupSetting(name, uiType, initialSettings);
    expect(popupSetting.isValid()).toEqual(false);
    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it("initialises fully if UI element can be found", () => {
    const uiElement = createElement("test-element") as HTMLInputElement;
    getElementSpy.mockReturnValueOnce(uiElement);
    addEventListenerSpy.mockReturnValueOnce(undefined);

    const popupSetting = new PopupSetting(name, uiType, initialSettings);
    expect(popupSetting.isValid()).toEqual(true);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(uiElement.disabled).toEqual(true);
    expect(uiElement.value).toEqual("12345");
  });

  it("handles checkbox elements", () => {
    const uiElement = createElement("test-element") as HTMLInputElement;
    getElementSpy.mockReturnValueOnce(uiElement);
    addEventListenerSpy.mockReturnValueOnce(undefined);

    const popupSetting = new PopupSetting("enabled", "checkbox", {
      ...initialSettings,
      enabled: true,
    });
    expect(popupSetting.isValid()).toEqual(true);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(uiElement.disabled).toEqual(false);
    expect(uiElement.checked).toEqual(true);
  });

  describe("getUiValue", () => {
    it("returns the value", () => {
      const uiElement = createElement("test-element") as HTMLInputElement;
      getElementSpy.mockReturnValueOnce(uiElement);
      addEventListenerSpy.mockReturnValueOnce(undefined);

      const popupSetting = new PopupSetting(name, uiType, initialSettings);
      expect(popupSetting.getUiValue()).toEqual(12345);
    });

    it("returns undefined if the setting isn't valid", () => {
      const popupSetting = new PopupSetting(name, uiType, initialSettings);
      expect(popupSetting.getUiValue()).toEqual(undefined);
    });

    it("handles checkboxes", () => {
      const uiElement = createElement("test-element") as HTMLInputElement;
      getElementSpy.mockReturnValueOnce(uiElement);
      addEventListenerSpy.mockReturnValueOnce(undefined);

      const popupSetting = new PopupSetting("enabled", "checkbox", {
        ...initialSettings,
        enabled: true,
      });
      expect(popupSetting.getUiValue()).toEqual(true);
    });
  });

  describe("onChange", () => {
    const sendMessageToWindowSpy = jest.spyOn(helpers, "sendMessageToWindow");
    const uiElement = createElement("test-element") as HTMLInputElement;

    beforeEach(() => {
      getElementSpy.mockReturnValueOnce(uiElement);
    });

    it("sends a settings message to the window", async () => {
      sendMessageToWindowSpy.mockResolvedValueOnce({ response: "Success" });
      const popupSetting = new PopupSetting(name, uiType, initialSettings);

      popupSetting["onChange"](new Event("change"));
      await flushPromises();

      expect(sendMessageToWindowSpy).toHaveBeenCalledWith({
        type: "SETTINGS",
        transparency: 12345,
      });
    });

    it("logs if message sending fails", async () => {
      const errorSpy = jest.spyOn(helpers, "error");
      sendMessageToWindowSpy.mockRejectedValueOnce({ message: "foo" });
      const popupSetting = new PopupSetting(name, uiType, initialSettings);

      popupSetting["onChange"](new Event("change"));
      await flushPromises();

      expect(sendMessageToWindowSpy).toHaveBeenCalledWith({
        type: "SETTINGS",
        transparency: 12345,
      });

      expect(errorSpy).toHaveBeenCalledWith("Error sending message: foo");
    });
  });
});
