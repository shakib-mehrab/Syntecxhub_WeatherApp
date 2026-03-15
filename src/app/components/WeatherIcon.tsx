import { Sun, Cloud, CloudRain, Moon, CloudLightning, CloudSnow } from 'lucide-react';
import { motion } from 'motion/react';
import { WeatherType } from '../weather-utils';

interface WeatherIconProps {
  weatherType: WeatherType;
  size?: number;
}

export function WeatherIcon({ weatherType, size = 48 }: WeatherIconProps) {
  const iconProps = {
    size,
    className: "text-white drop-shadow-lg"
  };

  const animations = {
    sunny: {
      rotate: [0, 360],
      transition: { duration: 20, repeat: Infinity, ease: "linear" }
    },
    cloudy: {
      x: [-5, 5, -5],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    },
    rainy: {
      y: [0, 3, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    night: {
      opacity: [0.7, 1, 0.7],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    thunderstorm: {
      scale: [1, 1.1, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    snowy: {
      y: [0, -2, 0],
      x: [0, 1.5, 0],
      transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const icons = {
    sunny: <Sun {...iconProps} />,
    cloudy: <Cloud {...iconProps} />,
    rainy: <CloudRain {...iconProps} />,
    night: <Moon {...iconProps} />,
    thunderstorm: <CloudLightning {...iconProps} />,
    snowy: <CloudSnow {...iconProps} />
  };

  return (
    <motion.div
      animate={animations[weatherType]}
      className="inline-flex items-center justify-center"
    >
      {icons[weatherType]}
    </motion.div>
  );
}
