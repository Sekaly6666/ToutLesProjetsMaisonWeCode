export const PASSWORD_RULE_MESSAGE =
  'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un caractère spécial.'

const PASSWORD_RULES = [
  {
    key: 'length',
    label: '8+ caractères',
    test: (value) => value.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'Majuscule',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    key: 'lowercase',
    label: 'Minuscule',
    test: (value) => /[a-z]/.test(value),
  },
  {
    key: 'special',
    label: 'Spécial',
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
]

export function getPasswordStrengthChecks(password) {
  const value = String(password ?? '')

  return PASSWORD_RULES.map((rule) => ({
    key: rule.key,
    label: rule.label,
    valid: rule.test(value),
  }))
}

export function isPasswordStrong(password) {
  return getPasswordStrengthChecks(password).every((check) => check.valid)
}

export function getPasswordStrengthMessage(password) {
  return isPasswordStrong(password) ? '' : PASSWORD_RULE_MESSAGE
}
