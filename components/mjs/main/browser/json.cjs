export const json = (file) => fetch(file).then((data) => data.json())
