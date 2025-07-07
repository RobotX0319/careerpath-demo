/**
 * Career Path Data
 * 
 * Static data for career paths, skills, job positions, and learning resources
 */

export interface CareerPath {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  steps: CareerStep[];
}

export interface CareerStep {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  duration: string;
  resources: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relatedSkills: string[];
}

export interface JobPosition {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  experience: string;
  requiredSkills: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  benefits: string[];
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'book' | 'video' | 'article' | 'tutorial';
  url: string;
  provider: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  rating: number;
  price: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
}

// Sample career paths data
export const careerPaths: CareerPath[] = [
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    description: 'Veb-saytlarning foydalanuvchi interfeysini yaratish',
    category: 'Dasturlash',
    difficulty: 'beginner',
    duration: '6-12 oy',
    steps: [
      {
        id: 'html-css',
        title: 'HTML va CSS asoslari',
        description: 'Veb-sahifalar yaratishning asosiy tillari',
        requiredSkills: ['html', 'css'],
        duration: '2-3 oy',
        resources: ['html-css-course', 'responsive-design-book']
      },
      {
        id: 'javascript',
        title: 'JavaScript dasturlash',
        description: 'Interaktiv veb-sahifalar yaratish',
        requiredSkills: ['javascript', 'dom-manipulation'],
        duration: '3-4 oy',
        resources: ['javascript-course', 'es6-tutorial']
      },
      {
        id: 'react',
        title: 'React framework',
        description: 'Zamonaviy frontend loyihalar yaratish',
        requiredSkills: ['react', 'jsx', 'hooks'],
        duration: '2-3 oy',
        resources: ['react-course', 'react-hooks-guide']
      }
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Ma\'lumotlarni tahlil qilish va mashina o\'rganish',
    category: 'Ma\'lumotlar fani',
    difficulty: 'intermediate',
    duration: '12-18 oy',
    steps: [
      {
        id: 'python-basics',
        title: 'Python dasturlash',
        description: 'Ma\'lumotlar fani uchun Python',
        requiredSkills: ['python', 'pandas', 'numpy'],
        duration: '3-4 oy',
        resources: ['python-data-course', 'pandas-tutorial']
      },
      {
        id: 'statistics',
        title: 'Statistika va matematik',
        description: 'Ma\'lumotlar tahlili uchun matematik asos',
        requiredSkills: ['statistics', 'probability', 'linear-algebra'],
        duration: '4-5 oy',
        resources: ['statistics-course', 'math-for-ml']
      },
      {
        id: 'machine-learning',
        title: 'Mashina o\'rganish',
        description: 'ML algoritmlarini o\'rganish va qo\'llash',
        requiredSkills: ['machine-learning', 'scikit-learn', 'tensorflow'],
        duration: '5-6 oy',
        resources: ['ml-course', 'tensorflow-guide']
      }
    ]
  }
];

// Sample skills data
export const skills: Skill[] = [
  {
    id: 'html',
    name: 'HTML',
    category: 'Frontend',
    description: 'Veb-sahifalar strukturasini yaratish tili',
    difficulty: 'beginner',
    relatedSkills: ['css', 'javascript']
  },
  {
    id: 'css',
    name: 'CSS',
    category: 'Frontend',
    description: 'Veb-sahifalar dizaynini yaratish tili',
    difficulty: 'beginner',
    relatedSkills: ['html', 'sass', 'responsive-design']
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Dasturlash',
    description: 'Interaktiv veb-dasturlar yaratish tili',
    difficulty: 'intermediate',
    relatedSkills: ['html', 'css', 'react', 'nodejs']
  },
  {
    id: 'react',
    name: 'React',
    category: 'Frontend Framework',
    description: 'Foydalanuvchi interfeysi yaratish kutubxonasi',
    difficulty: 'intermediate',
    relatedSkills: ['javascript', 'jsx', 'hooks', 'redux']
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Dasturlash',
    description: 'Umumiy maqsadli dasturlash tili',
    difficulty: 'beginner',
    relatedSkills: ['pandas', 'numpy', 'django', 'flask']
  }
];

// Sample job positions data
export const jobPositions: JobPosition[] = [
  {
    id: 'frontend-dev-1',
    title: 'Frontend Developer',
    description: 'React va TypeScript bilan ishlash tajribasi talab qilinadi',
    company: 'Tech Company UZ',
    location: 'Toshkent',
    type: 'full-time',
    experience: '2-4 yil',
    requiredSkills: ['react', 'typescript', 'css', 'javascript'],
    salary: {
      min: 8000000,
      max: 15000000,
      currency: 'UZS'
    },
    benefits: ['Sog\'liqni saqlash', 'Ta\'lim kurslari', 'Moslashuvchan ish vaqti']
  },
  {
    id: 'data-scientist-1',
    title: 'Data Scientist',
    description: 'Python va machine learning bo\'yicha tajriba kerak',
    company: 'Analytics Corp',
    location: 'Samarqand',
    type: 'remote',
    experience: '3-5 yil',
    requiredSkills: ['python', 'machine-learning', 'statistics', 'sql'],
    salary: {
      min: 12000000,
      max: 25000000,
      currency: 'UZS'
    },
    benefits: ['Masofaviy ish', 'Flextime', 'Professional rivojlanish']
  }
];

// Sample learning resources data
export const learningResources: LearningResource[] = [
  {
    id: 'html-css-course',
    title: 'HTML va CSS Complete Course',
    description: 'Boshlovchilar uchun to\'liq HTML va CSS kursi',
    type: 'course',
    url: 'https://example.com/html-css',
    provider: 'CodeAcademy UZ',
    duration: '40 soat',
    difficulty: 'beginner',
    skills: ['html', 'css'],
    rating: 4.8,
    price: {
      amount: 0,
      currency: 'UZS',
      isFree: true
    }
  },
  {
    id: 'javascript-course',
    title: 'JavaScript Mastery',
    description: 'JavaScript tillini chuqur o\'rganish',
    type: 'course',
    url: 'https://example.com/javascript',
    provider: 'Tech Learning',
    duration: '60 soat',
    difficulty: 'intermediate',
    skills: ['javascript', 'es6', 'async'],
    rating: 4.9,
    price: {
      amount: 500000,
      currency: 'UZS',
      isFree: false
    }
  },
  {
    id: 'react-course',
    title: 'React Developer Path',
    description: 'React bilan zamonaviy veb-dasturlar yaratish',
    type: 'course',
    url: 'https://example.com/react',
    provider: 'Frontend Academy',
    duration: '80 soat',
    difficulty: 'intermediate',
    skills: ['react', 'hooks', 'context', 'routing'],
    rating: 4.7,
    price: {
      amount: 800000,
      currency: 'UZS',
      isFree: false
    }
  },
  {
    id: 'python-data-course',
    title: 'Python for Data Science',
    description: 'Ma\'lumotlar fani uchun Python dasturlash',
    type: 'course',
    url: 'https://example.com/python-data',
    provider: 'Data Institute',
    duration: '100 soat',
    difficulty: 'intermediate',
    skills: ['python', 'pandas', 'numpy', 'matplotlib'],
    rating: 4.6,
    price: {
      amount: 1200000,
      currency: 'UZS',
      isFree: false
    }
  }
];