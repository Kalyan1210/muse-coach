/**
 * Muse Spacing System
 * Based on 4px base unit (Apple uses 8pt grid, we use 4 for flexibility)
 * 
 * Generous whitespace is key to Apple's aesthetic
 */

const BASE_UNIT = 4;

export const spacing = {
  // Atomic spacing values
  none: 0,
  xxs: BASE_UNIT,           // 4
  xs: BASE_UNIT * 2,        // 8
  sm: BASE_UNIT * 3,        // 12
  md: BASE_UNIT * 4,        // 16
  lg: BASE_UNIT * 5,        // 20
  xl: BASE_UNIT * 6,        // 24
  '2xl': BASE_UNIT * 8,     // 32
  '3xl': BASE_UNIT * 10,    // 40
  '4xl': BASE_UNIT * 12,    // 48
  '5xl': BASE_UNIT * 16,    // 64
  '6xl': BASE_UNIT * 20,    // 80
  
  // Semantic spacing
  screenPadding: BASE_UNIT * 5,     // 20 - standard screen edge padding
  cardPadding: BASE_UNIT * 4,       // 16 - internal card padding
  sectionGap: BASE_UNIT * 8,        // 32 - gap between sections
  itemGap: BASE_UNIT * 3,           // 12 - gap between list items
  iconGap: BASE_UNIT * 2,           // 8 - gap between icon and text
  
  // Component-specific
  buttonPaddingY: BASE_UNIT * 4,    // 16
  buttonPaddingX: BASE_UNIT * 6,    // 24
  inputPadding: BASE_UNIT * 4,      // 16
  chipPaddingY: BASE_UNIT * 2,      // 8
  chipPaddingX: BASE_UNIT * 3,      // 12
};

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
  
  // Semantic
  button: 12,
  card: 16,
  input: 12,
  chip: 20,
  avatar: 9999,
  sheet: 20,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
};

// Animation durations (in ms)
export const animation = {
  fast: 150,
  normal: 250,
  slow: 400,
  
  // Spring configs for react-native-reanimated
  spring: {
    gentle: {
      damping: 20,
      stiffness: 150,
    },
    snappy: {
      damping: 15,
      stiffness: 300,
    },
    bouncy: {
      damping: 10,
      stiffness: 200,
    },
  },
};

