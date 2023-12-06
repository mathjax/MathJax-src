/**
 * True when platform is a Mac (so we can enable CMD menu item for zoom trigger)
 */
export const isMac = (typeof window !== 'undefined' &&
  window.navigator && window.navigator.platform.substring(0, 3) === 'Mac');

/**
 * @param {string} text   The text to be copied ot the clopboard
 */
export function copyToClipboard(text: string) {
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.cssText = 'height: 1px; width: 1px; padding: 1px; position: absolute; left: -10px';
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
  } catch (error) {
    alert('Can\'t copy to clipboard: ' + error.message);
  }
  document.body.removeChild(input);
}

