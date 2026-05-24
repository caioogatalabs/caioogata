export async function copyToClipboard(text: string): Promise<void> {
  // Modern Clipboard API (primary method)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback:', err)
    }
  }

  // Fallback method (older browsers, non-HTTPS)
  return fallbackCopyToClipboard(text)
}

function fallbackCopyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    textarea.setAttribute('readonly', '')

    document.body.appendChild(textarea)

    // Select text - iOS requires different selection method
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const range = document.createRange()
      range.selectNodeContents(textarea)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
      textarea.setSelectionRange(0, 999999)
    } else {
      textarea.select()
    }

    try {
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)

      if (successful) {
        resolve()
      } else {
        reject(new Error('execCommand failed'))
      }
    } catch (err) {
      document.body.removeChild(textarea)
      reject(err)
    }
  })
}
