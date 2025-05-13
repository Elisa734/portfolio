def f(x):
    return 1 / (1 + x) 

def simpson(f, a, b, n):
    if n % 2 != 0: 
        raise ValueError("n doit être pair pour la règle de Simpson")
    
    h = (b - a) / n 
    s = f(a) + f(b)  
    # Boucle pour les points intermédiaires
    for i in range(1, n):
        x = a + i * h
        if i % 2 == 0:
            s += 2 * f(x)  
        else:
            s += 4 * f(x)  
    
    return s * h / 3  # Multiplie par h/3 pour obtenir l'intégrale
def simpson38(f, a, b, n):
    if n % 3 != 0: 
        raise ValueError("n doit être un multiple de 3 pour la règle de Simpson 3/8")
    
    h = (b - a) / n 
    s = f(a) + f(b)  
    # Boucle pour les points intermédiaires
    for i in range(1, n):
        x = a + i * h
        if i % 3 == 0:
            s += 2 * f(x)  
        else:
            s += 3 * f(x)  
    
    return s * 3 * h / 8  # Multiplie par 3h/8 pour obtenir l'intégrale

def main():
    a = 0 
    b = 1  
    n = 6
    try:
        result = simpson(f, a, b, n)
        result_38 = simpson38(f, a, b, n)
        print(f"L'intégrale de f(x) de {a} à {b} avec la règle de Simpson est : {result:.f}")
        print(f"L'intégrale de f(x) de {a} à {b} est : {result:.6f}")
    except ValueError as e:
        print(f"Erreur : {e}")

if __name__ == "__main__":
    main()