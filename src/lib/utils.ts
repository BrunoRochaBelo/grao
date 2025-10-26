export function getTimeBasedTheme() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    // Manhã: Gradiente claro, texto escuro
    return {
      gradient: 'from-sky-100 to-blue-200',
      textColor: 'text-gray-800',
      fallbackColor: 'bg-blue-200',
    };
  } else if (hour >= 12 && hour < 18) {
    // Tarde: Gradiente quente, texto escuro
    return {
      gradient: 'from-yellow-100 via-orange-200 to-red-200',
      textColor: 'text-gray-800',
      fallbackColor: 'bg-orange-200',
    };
  } else if (hour >= 18 && hour < 22) {
    // Noite: Gradiente de pôr do sol, texto claro
    return {
      gradient: 'from-purple-400 via-pink-400 to-red-400',
      textColor: 'text-white',
      fallbackColor: 'bg-purple-400',
    };
  } else {
    // Madrugada: Gradiente escuro, texto claro
    return {
      gradient: 'from-gray-800 via-indigo-900 to-black',
      textColor: 'text-white',
      fallbackColor: 'bg-gray-800',
    };
  }
}
