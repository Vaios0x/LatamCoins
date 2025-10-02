import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';

// Registrar todos los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// Configuración por defecto para el tema LATAM
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#ffffff',
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(10, 14, 39, 0.9)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#00ff41',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 255, 65, 0.1)',
      },
      ticks: {
        color: '#ffffff',
        font: {
          size: 10,
        },
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 255, 65, 0.1)',
      },
      ticks: {
        color: '#ffffff',
        font: {
          size: 10,
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
};

// Colores del tema LATAM
export const latamColors = {
  primary: '#00ff41',
  secondary: '#00cc33',
  danger: '#ff0040',
  warning: '#ff6b35',
  success: '#00ff41',
  info: '#00cc33',
  light: 'rgba(255, 255, 255, 0.1)',
  dark: 'rgba(0, 0, 0, 0.8)',
};

// Gradientes para rellenos
export const latamGradients = {
  primary: 'rgba(0, 255, 65, 0.1)',
  secondary: 'rgba(0, 204, 51, 0.1)',
  danger: 'rgba(255, 0, 64, 0.1)',
  warning: 'rgba(255, 107, 53, 0.1)',
};
