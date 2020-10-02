const show = (messages) => {
  const ol = document.createElement('ol')
  ol.classList.add('nuList')
  const fg = document.createDocumentFragment()

  messages.forEach((message) => {
    const li = document.createElement('li')
    const type = message.type === 'info' ? message.subType : message.type
    li.insertAdjacentHTML(
      'afterbegin',
      `
      <p>
        <strong class="${type}">${type}</strong>
        : 
        <span>${message.message}</span>
      </p>

      <p>
        <code>${replaceHtml2String(message.extract)}</code>
      </p>
    `,
    )

    fg.appendChild(li)
  })

  ol.appendChild(fg)

  document.body.appendChild(ol)

  const sheet = new CSSStyleSheet()
  sheet.replaceSync(`
    .nuList {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      box-shadow: 0 0 1em 0 rgba(0, 0, 0, 0.5);
      margin-top: 0;
      margin-bottom: 0;
      overflow-y: auto;
      background-color: white;
      padding-top: 1em;
      padding-right: 1em;
      width: 25vw;
    }

    .nuList strong {
      text-transform: capitalize;
    }

    .nuList strong.error {
      color: #EC5A55;
    }

    .nuList strong.warning {
      color: #8C5EEE;
    }
  `)

  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
}

const replaceHtml2String = (str) => {
  return str.replace(/</g, '&lt;').replace(/>/, '&gt;')
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (!(msg && msg.command)) {
    return
  }

  if (msg.command === 'call') {
    // content scripts を起点にしたくて読んだだけなので何も返さない
    chrome.runtime.sendMessage(
      { command: 'validate_html', body: document.body.innerHTML },
      (response) => {},
    )
  }

  if (msg.command === 'show') {
    const { messages } = msg.body
    show(messages)
  }

  sendResponse()
})
