export const translateError = (errorMsg) => {
  if (!errorMsg) return 'Une erreur inconnue est survenue'

  const translations = {
    'Invalid email or password': 'Email ou mot de passe invalide',
    'Passwords do not match': 'Les mots de passe ne correspondent pas',
    'Registration failed': "L'inscription a échoué",
    'Failed to save contact': "Échec de l'enregistrement du contact",
    'Failed to delete contact': "Échec de la suppression du contact",
    'Profile updated successfully!': 'Profil mis à jour avec succès !',
    'Password changed successfully!': 'Mot de passe changé avec succès !',
    'User validation failed': 'La validation de l\'utilisateur a échoué',
    'password: Password must contain at least : one capital letter, one special character and one lowercase letter': 'le mot de passe doit contenir au moins : une majuscule, un caractère spécial et une minuscule',
    'is already in use': 'est déjà utilisé',
    'is required': 'est requis',
    'is invalid': 'est invalide'
  }

  // Try exact match first
  if (translations[errorMsg]) return translations[errorMsg]

  // Try partial matches or regex for dynamic errors
  let translated = errorMsg

  if (errorMsg.includes('User validation failed')) {
    translated = translated.replace('User validation failed', 'La validation a échoué')
  }
  
  if (errorMsg.includes('password: Password must contain at least')) {
    translated = translated.replace('password: Password must contain at least : one capital letter, one special character and one lowercase letter', 'le mot de passe doit contenir au moins : une majuscule, un caractère spécial et une minuscule')
  }

  if (errorMsg.includes('email:')) {
    translated = translated.replace('email:', 'email :')
  }

  // Common mapping for specific terms
  const terms = {
    'password': 'mot de passe',
    'email': 'email',
    'one capital letter': 'une majuscule',
    'one special character': 'un caractère spécial',
    'one lowercase letter': 'une minuscule',
    'at least': 'au moins',
    'contain': 'contenir'
  }

  Object.entries(terms).forEach(([en, fr]) => {
    const regex = new RegExp(en, 'gi')
    translated = translated.replace(regex, fr)
  })

  return translated
}
