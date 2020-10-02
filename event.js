const validateHtml = async (source) => {
  const response = await fetch(
    'https://validator.w3.org/nu/?out=json&showsource=yes',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
      body: source,
    },
  )

  return response.json()
}

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(
    tab.id,
    {
      command: 'call',
    },
    () => {},
  )
})

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log(
    sender.tab
      ? `from a content script: ${sender.tab.url}`
      : 'from the extension',
  )

  const { command, body } = request

  if (command === 'validate_html') {
    const response = await validateHtml(body)

    chrome.tabs.sendMessage(
      sender.tab.id,
      {
        command: 'show',
        body: response,
      },
      () => {},
    )
  }

  sendResponse()
})
