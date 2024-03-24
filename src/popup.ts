document.addEventListener("click", (event: Event) => {
  if (!event?.target) {
    return;
  }

  const target = event.target as HTMLElement;

  if (!target.classList.contains("page-choice")) {
    return;
  }

  const chosenPage = `https://${target.textContent}`;
  browser.tabs.create({
    url: chosenPage,
  });
});