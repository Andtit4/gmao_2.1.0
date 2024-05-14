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

export function getStartAndEndOfWeek() {
  const today = new Date()
  const currentDay = today.getDay() // Jour de la semaine (0 pour dimanche, 1 pour lundi, ..., 6 pour samedi)
  const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1) // Différence pour obtenir le début de la semaine
  const startOfWeek = new Date(today.setDate(diff))
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 6) // Ajouter 6 jours pour obtenir la fin de la semaine

  // Fixer heures, minutes, secondes et millisecondes à zéro
  startOfWeek.setUTCHours(0, 0, 0, 0)
  endOfWeek.setUTCHours(0, 0, 0, 0)

  // Formater les dates pour l'affichage
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    timeZone: 'UTC' // Utiliser le fuseau horaire UTC pour obtenir le format souhaité
  }

  const formattedStartOfWeek = startOfWeek.toISOString()
  const formattedEndOfWeek = endOfWeek.toISOString()

  // Afficher les résultats
  console.log(`Début de la semaine : ${formattedStartOfWeek}`)
  console.log(`Fin de la semaine : ${formattedEndOfWeek}`)

  return {
    dateDebut: formattedStartOfWeek,
    dateFin: formattedEndOfWeek
  }
}

export function isEmptyArray(element) {
  // Vérifie si l'élément est un tableau et s'il est vide
  return Array.isArray(element) && element.length === 0;
}

