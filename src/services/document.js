export function refreshPageOnceWithDelay(delay) {
  const hasRefreshed = localStorage.getItem('hasRefreshed')
  console.log('Refreshe state == ', hasRefreshed)

  if (!hasRefreshed) {
    // Attendre 100ms avant de rafraîchir la page
    setTimeout(() => {
      localStorage.setItem('hasRefreshed', 'true')
      location.reload(true)
    }, delay)
  }
}
