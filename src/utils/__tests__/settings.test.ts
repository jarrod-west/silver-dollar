import { mockStorage } from "../../__tests__/testHelper";
import { getStoredSetting, getStoredSettings } from "../settings";

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
