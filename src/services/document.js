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

// TODO: fixe state issue
export function getStartAndEndOfWeek() {
  const today = new Date()
  const currentDay = today.getDay() // Jour de la semaine (0 pour dimanche, 1 pour lundi, ..., 6 pour samedi)
  // Cette ligne calcule le nombre de jours à ajouter ou à soustraire à la date actuelle pour obtenir le jeudi de la semaine courante.
  // Si le jour actuel est avant le jeudi (c'est-à-dire si currentDay est inférieur à 4), on soustrait 6 jours pour obtenir le jeudi précédent.
  // Sinon, on ajoute 4 jours pour obtenir le jeudi suivant.
  const diff = today.getDate() - currentDay + (currentDay < 4 ? -6 : 4)
  const startOfWeek = new Date(today.setDate(diff))
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 6) // Fin de la semaine (mercredi de la semaine suivante)

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

