declare let __dirname: string;

/**
 * Set the directory name for testing purposes.
 *
 * @param {string} name The directory name.
 */
export function setDirname(name: string) {
  __dirname = name;
}
