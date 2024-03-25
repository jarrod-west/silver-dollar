import { debug, error } from "./utils/helpers";

document.addEventListener("click", async (event: Event) => {
  if (!event?.target) {
    return;
  }

  const target = event.target as HTMLElement;

  if (!target.classList.contains("page-choice")) {
    return;
  }

  // const chosenPage = `https://${target.textContent}`;
  // browser.tabs.create({
  //   url: chosenPage,
  // });

  try {
    const tabs = await browser.tabs.query({currentWindow: true, active: true});

    for (const tab of tabs) {
      const response = await browser.tabs.sendMessage(tab.id as number, {message: "a message"});
      debug(`Message sent, response: ${response.response}`);
    }
  } catch (err) {
    error(`Error sending message: ${err}`);
  }
});