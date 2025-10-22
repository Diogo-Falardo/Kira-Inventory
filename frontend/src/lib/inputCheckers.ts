export function validate_email(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validate_password(password: string): boolean {
  if (password.length < 6) {
    return false;
  } else if (password.length > 128) {
    return false;
  }

  const password_pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).{6,}$/;
  return password_pattern.test(password);
}
