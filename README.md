# 🧟‍♂️ Zombie Survivor

> Juego web tipo **survival arcade** desarrollado con **Phaser** y **Vite**, donde el jugador debe sobrevivir al ataque constante de zombies, moverse por el escenario, disparar, usar ataques cuerpo a cuerpo y conseguir la mayor puntuación posible.

---

## 📌 Descripción del proyecto

**Zombie Survivor** es un videojuego 2D en el que el jugador controla a un personaje dentro de un escenario cerrado mientras aparecen zombies de forma progresiva.

El objetivo principal es **sobrevivir el mayor tiempo posible**, eliminar enemigos, acumular puntos y superar la dificultad creciente del juego.

El juego incluye:

- Movimiento del jugador.
- Enemigos que persiguen al jugador.
- Disparo con mouse.
- Ataque cuerpo a cuerpo.
- Sistema de vida.
- Sistema de puntuación.
- Récord guardado en el navegador.
- Power-ups.
- Música y efectos de sonido.
- Pantalla de menú, pausa y game over.

---

## 🎮 Controles del juego

| Acción | Control |
|---|---|
| Mover hacia arriba | `W` |
| Mover hacia abajo | `S` |
| Mover hacia la izquierda | `A` |
| Mover hacia la derecha | `D` |
| Apuntar | Mouse |
| Disparar | Click izquierdo |
| Ataque cuerpo a cuerpo | `SPACE` |
| Iniciar partida | `SPACE` |
| Pausar / continuar | `P` |
| Reiniciar después de perder | `SPACE` o click |

---

## 🕹️ Mecánicas principales

### 🧍 Jugador

El jugador puede desplazarse por el mapa usando las teclas **WASD**.  
Además, puede atacar de dos formas:

- **Disparo:** usando el click izquierdo del mouse.
- **Ataque melee:** usando la tecla `SPACE`.

El jugador inicia con **100 puntos de vida**.  
Cuando un zombie lo toca, recibe daño.

---

### 🧟 Enemigos

Los zombies aparecen de forma automática en diferentes posiciones del mapa y persiguen al jugador.

A medida que avanza la partida, la dificultad aumenta:

- Los zombies se vuelven más rápidos.
- Tienen más vida.
- Aparecen con mayor frecuencia.

---

### ⭐ Power-ups

Durante la partida aparecen power-ups especiales.  
Al recogerlos, se eliminan los zombies activos en pantalla y se otorgan puntos adicionales.

---

### 🏆 Sistema de puntuación

El jugador gana puntos al eliminar zombies:

| Acción | Puntos |
|---|---|
| Eliminar zombie con disparo | `+10` |
| Eliminar zombie con melee | `+15` |
| Eliminar zombies con power-up | `+10` por zombie |

El juego guarda el **High Score** usando `localStorage`, por lo que el mejor puntaje queda almacenado en el navegador.

---

## 🚀 Guía de ejecución

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
