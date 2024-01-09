export default {
  generatePassword() {
    const length = 8
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz'

    let password = ''

    for (let i = 0; i < length; i++) {
      // Alterner entre majuscules et minuscules
      const useUppercase = i % 2 === 0

      // Sélectionner la lettre appropriée
      const letters = useUppercase ? uppercaseLetters : lowercaseLetters
      const randomIndex = Math.floor(Math.random() * letters.length)
      const selectedLetter = letters.charAt(randomIndex)

      // Ajouter la lettre au mot de passe
      password += selectedLetter
    }

    return password
  }
}

// // Exemple d'utilisation
// const generatedPassword = generatePassword()
// console.log(generatedPassword)
