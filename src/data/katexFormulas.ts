export type FormulaCategory = 'all' | 'calculus' | 'algebra' | 'physics' | 'stats' | 'discrete';

export interface KatexFormula {
  id: string;
  name: string;
  category: 'calculus' | 'algebra' | 'physics' | 'stats' | 'discrete';
  latex: string;
  description: string;
  badge?: string;
}

export const KATEX_FORMULAS: KatexFormula[] = [
  // CALCULUS
  {
    id: 'derivative-definition',
    name: 'Definition of Derivative',
    category: 'calculus',
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
    description: 'Instantaneous rate of change limit formulation.',
    badge: 'Calculus'
  },
  {
    id: 'ftc',
    name: 'Fundamental Theorem of Calculus',
    category: 'calculus',
    latex: '\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)',
    description: 'Connects differentiation and definite integration.',
    badge: 'Calculus'
  },
  {
    id: 'taylor-series',
    name: 'Taylor Series Expansion',
    category: 'calculus',
    latex: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x - a)^n',
    description: 'Infinite sum polynomial approximation about point a.',
    badge: 'Calculus'
  },
  {
    id: 'gaussian-integral',
    name: 'Gaussian Integral',
    category: 'calculus',
    latex: '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}',
    description: 'Standard normal distribution normalization factor.',
    badge: 'Calculus'
  },
  {
    id: 'fourier-transform',
    name: 'Fourier Transform',
    category: 'calculus',
    latex: '\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i x \\xi} dx',
    description: 'Continuous frequency spectrum decomposition.',
    badge: 'Calculus'
  },

  // LINEAR ALGEBRA
  {
    id: 'matrix-2x2',
    name: '2×2 Transformation Matrix',
    category: 'algebra',
    latex: 'A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix},\\quad \\det(A) = ad - bc',
    description: 'Standard 2D linear operator with scalar determinant.',
    badge: 'Algebra'
  },
  {
    id: 'matrix-inverse',
    name: '2×2 Matrix Inversion',
    category: 'algebra',
    latex: 'A^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}',
    description: 'Analytical inverse for invertible 2×2 square matrices.',
    badge: 'Algebra'
  },
  {
    id: 'eigen-problem',
    name: 'Eigenvalue Equation',
    category: 'algebra',
    latex: 'A \\mathbf{v} = \\lambda \\mathbf{v}',
    description: 'Characteristic equation for linear vector transformation scaling.',
    badge: 'Algebra'
  },
  {
    id: 'dot-cross-product',
    name: 'Vector Dot & Cross Products',
    category: 'algebra',
    latex: '\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos\\theta,\\quad \\|\\mathbf{u} \\times \\mathbf{v}\\| = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\sin\\theta',
    description: 'Metric projection and orthogonal normal vector magnitude.',
    badge: 'Algebra'
  },

  // PHYSICS & MECHANICS
  {
    id: 'mass-energy',
    name: 'Mass-Energy Equivalence',
    category: 'physics',
    latex: 'E = mc^2',
    description: "Einstein's relativistic mass-energy correspondence relation.",
    badge: 'Physics'
  },
  {
    id: 'schrodinger',
    name: 'Time-Dependent Schrödinger Equation',
    category: 'physics',
    latex: 'i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\hat{H} \\Psi(\\mathbf{r}, t)',
    description: 'Fundamental wave equation governing quantum system state evolution.',
    badge: 'Physics'
  },
  {
    id: 'maxwell-gauss',
    name: "Gauss's Law for Electromagnetism",
    category: 'physics',
    latex: '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0},\\quad \\nabla \\cdot \\mathbf{B} = 0',
    description: 'Electric charge source field divergence and non-existence of magnetic monopoles.',
    badge: 'Physics'
  },
  {
    id: 'heisenberg-uncertainty',
    name: 'Heisenberg Uncertainty Principle',
    category: 'physics',
    latex: '\\sigma_x \\sigma_p \\ge \\frac{\\hbar}{2}',
    description: 'Fundamental precision bound between conjugate observable operators.',
    badge: 'Physics'
  },
  {
    id: 'gravitation',
    name: "Newton's Law of Universal Gravitation",
    category: 'physics',
    latex: 'F = G \\frac{m_1 m_2}{r^2}',
    description: 'Inverse-square attractive gravitational force magnitude.',
    badge: 'Physics'
  },

  // STATISTICS & PROBABILITY
  {
    id: 'normal-pdf',
    name: 'Gaussian Normal Distribution (PDF)',
    category: 'stats',
    latex: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2} \\left(\\frac{x - \\mu}{\\sigma}\\right)^2}',
    description: 'Continuous bell curve probability density distribution.',
    badge: 'Statistics'
  },
  {
    id: 'bayes-theorem',
    name: "Bayes' Theorem",
    category: 'stats',
    latex: 'P(A \\mid B) = \\frac{P(B \\mid A)\\, P(A)}{P(B)}',
    description: 'Conditional probability update formula under evidentiary observation.',
    badge: 'Statistics'
  },
  {
    id: 'variance-std',
    name: 'Sample Mean & Variance',
    category: 'stats',
    latex: '\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i,\\quad s^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2',
    description: 'Standard estimators for central tendency and sample dispersion.',
    badge: 'Statistics'
  },
  {
    id: 'poisson-distribution',
    name: 'Poisson Distribution',
    category: 'stats',
    latex: 'P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}',
    description: 'Discrete probability distribution for independent events in fixed interval.',
    badge: 'Statistics'
  },

  // DISCRETE MATH & LOGIC
  {
    id: 'euler-identity',
    name: "Euler's Identity",
    category: 'discrete',
    latex: 'e^{i\\pi} + 1 = 0',
    description: 'Harmonizes five fundamental mathematical constants in a single equation.',
    badge: 'Discrete'
  },
  {
    id: 'quadratic-formula',
    name: 'Quadratic Equation Formula',
    category: 'discrete',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'Roots of standard second-order polynomial equation ax² + bx + c = 0.',
    badge: 'Discrete'
  },
  {
    id: 'combinatorics',
    name: 'Binomial Coefficient (Combination)',
    category: 'discrete',
    latex: '\\binom{n}{k} = \\frac{n!}{k!(n-k)!}',
    description: 'Number of unique subsets of size k chosen from n items.',
    badge: 'Discrete'
  }
];
