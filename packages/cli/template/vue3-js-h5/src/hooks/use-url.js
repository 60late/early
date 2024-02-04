export const useUrl = () => {
  const querys = window.location.href.split('?')[1]
  const urlSearchParams = new URLSearchParams(querys)
  const params = Object.fromEntries(urlSearchParams.entries())
  return params
}
