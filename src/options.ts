import { error } from "./utils/helpers";

export const saveOptions = async (event: Event) => {
  event.preventDefault();

  const element = document.querySelector("#color") as HTMLInputElement;

  if (element) {
    await browser.storage.sync.set({
      color: element.value,
    });
  }
}

export const restoreOptions = async () => {
  try {
    let stored = await browser.storage.sync.get("color");
    let element = document.querySelector("#color") as HTMLInputElement;
    // document.querySelector("#color")?.value = result.color || "blue";
    if (element) {
      element.value = stored.color || "blue"
    }
  } catch (err) {
    error(`Error restoring options: ${err}`);
  }
}


document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form")?.addEventListener("submit", saveOptions);