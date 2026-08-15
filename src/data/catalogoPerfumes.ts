export type GeneroPerfume = 'hombre' | 'mujer' | 'unisex'

export interface PerfumeCatalogo {
  nombre: string
  marca: string
  genero: GeneroPerfume
}

// Lista de referencia con perfumes ampliamente conocidos en el mercado,
// organizados por marca. Es información factual (nombres de producto),
// pensada solo para agilizar el registro en el inventario de SADAK —
// no incluye imágenes ni contenido de las marcas, solo nombres.
export const CATALOGO_PERFUMES: PerfumeCatalogo[] = [
  // Carolina Herrera
  { nombre: '212 VIP Men', marca: 'Carolina Herrera', genero: 'hombre' },
  { nombre: '212 VIP Black', marca: 'Carolina Herrera', genero: 'hombre' },
  { nombre: '212 VIP Rosé', marca: 'Carolina Herrera', genero: 'mujer' },
  { nombre: '212 Men', marca: 'Carolina Herrera', genero: 'hombre' },
  { nombre: '212 Women', marca: 'Carolina Herrera', genero: 'mujer' },
  { nombre: 'Good Girl', marca: 'Carolina Herrera', genero: 'mujer' },
  { nombre: 'Good Girl Blush', marca: 'Carolina Herrera', genero: 'mujer' },
  { nombre: 'Bad Boy', marca: 'Carolina Herrera', genero: 'hombre' },
  { nombre: 'Bad Boy Cobalt', marca: 'Carolina Herrera', genero: 'hombre' },
  { nombre: 'CH Men', marca: 'Carolina Herrera', genero: 'hombre' },

  // Paco Rabanne
  { nombre: 'Invictus', marca: 'Paco Rabanne', genero: 'hombre' },
  { nombre: 'Invictus Legend', marca: 'Paco Rabanne', genero: 'hombre' },
  { nombre: 'Invictus Victory', marca: 'Paco Rabanne', genero: 'hombre' },
  { nombre: 'One Million', marca: 'Paco Rabanne', genero: 'hombre' },
  { nombre: 'One Million Lucky', marca: 'Paco Rabanne', genero: 'hombre' },
  { nombre: 'One Million Elixir', marca: 'Paco Rabanne', genero: 'hombre' },
  { nombre: 'Lady Million', marca: 'Paco Rabanne', genero: 'mujer' },
  { nombre: 'Olympéa', marca: 'Paco Rabanne', genero: 'mujer' },
  { nombre: 'Fame', marca: 'Paco Rabanne', genero: 'mujer' },
  { nombre: 'Phantom', marca: 'Paco Rabanne', genero: 'hombre' },

  // Dior
  { nombre: 'Sauvage', marca: 'Dior', genero: 'hombre' },
  { nombre: 'Sauvage Elixir', marca: 'Dior', genero: 'hombre' },
  { nombre: 'Homme Intense', marca: 'Dior', genero: 'hombre' },
  { nombre: "J'adore", marca: 'Dior', genero: 'mujer' },
  { nombre: "J'adore Infinissime", marca: 'Dior', genero: 'mujer' },
  { nombre: 'Miss Dior', marca: 'Dior', genero: 'mujer' },
  { nombre: 'Poison Girl', marca: 'Dior', genero: 'mujer' },

  // Yves Saint Laurent
  { nombre: 'Black Opium', marca: 'Yves Saint Laurent', genero: 'mujer' },
  { nombre: 'Libre', marca: 'Yves Saint Laurent', genero: 'mujer' },
  { nombre: 'Mon Paris', marca: 'Yves Saint Laurent', genero: 'mujer' },
  { nombre: 'Y Eau de Parfum', marca: 'Yves Saint Laurent', genero: 'hombre' },
  { nombre: 'La Nuit de L\u2019Homme', marca: 'Yves Saint Laurent', genero: 'hombre' },

  // Giorgio Armani
  { nombre: 'Acqua di Giò', marca: 'Giorgio Armani', genero: 'hombre' },
  { nombre: 'Acqua di Giò Profondo', marca: 'Giorgio Armani', genero: 'hombre' },
  { nombre: 'Stronger With You', marca: 'Giorgio Armani', genero: 'hombre' },
  { nombre: 'Sì', marca: 'Giorgio Armani', genero: 'mujer' },
  { nombre: 'My Way', marca: 'Giorgio Armani', genero: 'mujer' },

  // Lancôme
  { nombre: 'La Vie Est Belle', marca: 'Lancôme', genero: 'mujer' },
  { nombre: 'Idôle', marca: 'Lancôme', genero: 'mujer' },

  // Chanel
  { nombre: 'Bleu de Chanel', marca: 'Chanel', genero: 'hombre' },
  { nombre: 'Coco Mademoiselle', marca: 'Chanel', genero: 'mujer' },
  { nombre: 'Chance', marca: 'Chanel', genero: 'mujer' },
  { nombre: 'Allure Homme Sport', marca: 'Chanel', genero: 'hombre' },

  // Versace
  { nombre: 'Eros', marca: 'Versace', genero: 'hombre' },
  { nombre: 'Eros Flame', marca: 'Versace', genero: 'hombre' },
  { nombre: 'Dylan Blue', marca: 'Versace', genero: 'hombre' },
  { nombre: 'Crystal Noir', marca: 'Versace', genero: 'mujer' },
  { nombre: 'Bright Crystal', marca: 'Versace', genero: 'mujer' },

  // Jean Paul Gaultier
  { nombre: 'Le Male', marca: 'Jean Paul Gaultier', genero: 'hombre' },
  { nombre: 'Le Male Elixir', marca: 'Jean Paul Gaultier', genero: 'hombre' },
  { nombre: 'Scandal', marca: 'Jean Paul Gaultier', genero: 'mujer' },
  { nombre: 'Scandal Le Parfum', marca: 'Jean Paul Gaultier', genero: 'mujer' },

  // Calvin Klein
  { nombre: 'CK One', marca: 'Calvin Klein', genero: 'unisex' },
  { nombre: 'Euphoria', marca: 'Calvin Klein', genero: 'mujer' },
  { nombre: 'Eternity', marca: 'Calvin Klein', genero: 'unisex' },

  // Hugo Boss
  { nombre: 'Boss Bottled', marca: 'Hugo Boss', genero: 'hombre' },
  { nombre: 'Boss The Scent', marca: 'Hugo Boss', genero: 'hombre' },
  { nombre: 'Hugo Man', marca: 'Hugo Boss', genero: 'hombre' },

  // Azzaro
  { nombre: 'Wanted', marca: 'Azzaro', genero: 'hombre' },
  { nombre: 'Wanted by Night', marca: 'Azzaro', genero: 'hombre' },
  { nombre: 'Chrome', marca: 'Azzaro', genero: 'hombre' },

  // Montblanc
  { nombre: 'Explorer', marca: 'Montblanc', genero: 'hombre' },
  { nombre: 'Legend', marca: 'Montblanc', genero: 'hombre' },

  // Antonio Banderas
  { nombre: 'The Golden Secret', marca: 'Antonio Banderas', genero: 'hombre' },
  { nombre: 'Her Secret', marca: 'Antonio Banderas', genero: 'mujer' },

  // Ariana Grande / Otros pop
  { nombre: 'Cloud', marca: 'Ariana Grande', genero: 'mujer' },
  { nombre: 'Thank U, Next', marca: 'Ariana Grande', genero: 'mujer' },

  // Nina Ricci
  { nombre: "L'Air du Temps", marca: 'Nina Ricci', genero: 'mujer' },

  // Bvlgari
  { nombre: 'Man in Black', marca: 'Bvlgari', genero: 'hombre' },
  { nombre: 'Omnia Crystalline', marca: 'Bvlgari', genero: 'mujer' },
]

export const MARCAS_CATALOGO = Array.from(new Set(CATALOGO_PERFUMES.map((p) => p.marca))).sort()
