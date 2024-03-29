import { debug, error } from "./utils/helpers";


const getEventTarget = (event: Event): HTMLElement | null => {
  if (!event?.target) {
    return null;
  }

  return event.target as HTMLElement;
}

const sendMessage = async (message: any): Promise<void> => {
  try {
    const tabs = await browser.tabs.query({currentWindow: true, active: true});

    for (const tab of tabs) {
      const response = await browser.tabs.sendMessage(tab.id as number, message);
      debug(`Message sent, response: ${response.response}`);
    }
  } catch (err) {
    error(`Error sending message: ${err}`);
  }
}

// document.addEventListener("click", async (event: Event) => {
//   if (!event?.target) {
//     return;
//   }

//   const target = event.target as HTMLElement;

//   // if (!target.classList.contains("page-choice")) {
//   //   return;
//   // }

//   // const chosenPage = `https://${target.textContent}`;
//   // browser.tabs.create({
//   //   url: chosenPage,
//   // });

//   try {
//     const tabs = await browser.tabs.query({currentWindow: true, active: true});

//     for (const tab of tabs) {
//       const response = await browser.tabs.sendMessage(tab.id as number, {message: "a message"});
//       debug(`Message sent, response: ${response.response}`);
//     }
//   } catch (err) {
//     error(`Error sending message: ${err}`);
//   }
// });


const slider = document.getElementById("transparency-slider") as HTMLInputElement;
if (slider) {
  slider.addEventListener("change", async (event: Event) => {
    const target = getEventTarget(event);

    // if (target?.id === "transparency-slider") {
    //   // Send the message
    //   await sendMessage({transparency: target.nodeValue});
    // }
    await sendMessage({transparency: slider.value});
  });
}