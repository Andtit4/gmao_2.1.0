export default {
   formatDate(dateString) {
    // Convertir la chaîne en objet Date
    const date = new Date(dateString);

    // Options pour le formateur de date
    const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
    };

    // Créer un formateur de date avec les options spécifiées
    const formatter = new Intl.DateTimeFormat('fr-FR', options);

    // Formatter la date
    const formattedDate = formatter.format(date);

    // Remplacer le format des heures et minutes
    const formattedDateWithHours = formattedDate.replace(',', ' à');
    console.log(formattedDateWithHours)

    return formattedDateWithHours;
}
}
