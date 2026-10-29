export interface CbseSubtopic {
  id: string;
  title: string;
  completed: boolean;
  pyqDone?: boolean;
  notesReady?: boolean;
  revisionCount?: number;
}

export interface CbseChapter {
  id: string;
  title: string;
  completed?: boolean;
  pyqDone?: boolean;
  notesReady?: boolean;
  revisionCount?: number;
  subtopics: CbseSubtopic[];
}

export interface CbseSubject {
  id: string;
  title: string;
  code?: string;
  completed?: boolean;
  chapters: CbseChapter[];
}

export const CBSE_CLASS_10_SYLLABUS: CbseSubject[] = [
  {
    id: 'maths-10',
    title: 'Mathematics (Standard / Basic)',
    code: '041 / 241',
    chapters: [
      {
        id: 'math-ch1',
        title: 'Ch 1: Real Numbers',
        subtopics: [
          { id: 'm-1-1', title: 'Fundamental Theorem of Arithmetic', completed: false },
          { id: 'm-1-2', title: 'Revisiting Irrational Numbers (Proof of √2, √3, √5)', completed: false },
          { id: 'm-1-3', title: 'HCF & LCM Prime Factorisation Method', completed: false }
        ]
      },
      {
        id: 'math-ch2',
        title: 'Ch 2: Polynomials',
        subtopics: [
          { id: 'm-2-1', title: 'Geometrical Meaning of Zeroes of a Polynomial', completed: false },
          { id: 'm-2-2', title: 'Relationship between Zeroes and Coefficients (Quadratic)', completed: false },
          { id: 'm-2-3', title: 'Formation of Quadratic Polynomial from Sum & Product of Zeroes', completed: false }
        ]
      },
      {
        id: 'math-ch3',
        title: 'Ch 3: Pair of Linear Equations in Two Variables',
        subtopics: [
          { id: 'm-3-1', title: 'Graphical Method of Solution & Consistency Conditions', completed: false },
          { id: 'm-3-2', title: 'Algebraic Method: Substitution Method', completed: false },
          { id: 'm-3-3', title: 'Algebraic Method: Elimination Method', completed: false },
          { id: 'm-3-4', title: 'Word Problems (Speed-Distance, Upstream-Downstream, Ages)', completed: false }
        ]
      },
      {
        id: 'math-ch4',
        title: 'Ch 4: Quadratic Equations',
        subtopics: [
          { id: 'm-4-1', title: 'Standard Form of Quadratic Equation: ax² + bx + c = 0', completed: false },
          { id: 'm-4-2', title: 'Solution by Factorisation (Splitting the Middle Term)', completed: false },
          { id: 'm-4-3', title: 'Quadratic Formula (Discriminant D = b² - 4ac)', completed: false },
          { id: 'm-4-4', title: 'Nature of Roots (Real & Equal, Real & Distinct, No Real Roots)', completed: false }
        ]
      },
      {
        id: 'math-ch5',
        title: 'Ch 5: Arithmetic Progressions (AP)',
        subtopics: [
          { id: 'm-5-1', title: 'Definition, First Term a and Common Difference d', completed: false },
          { id: 'm-5-2', title: 'nth Term of an AP formula: aₙ = a + (n - 1)d', completed: false },
          { id: 'm-5-3', title: 'Sum of First n Terms formula: Sₙ = n/2 [2a + (n - 1)d]', completed: false },
          { id: 'm-5-4', title: 'Application & Daily Life Word Problems', completed: false }
        ]
      },
      {
        id: 'math-ch6',
        title: 'Ch 6: Triangles',
        subtopics: [
          { id: 'm-6-1', title: 'Basic Proportionality Theorem (Thales Theorem & Converse)', completed: false },
          { id: 'm-6-2', title: 'Criteria for Similarity of Triangles (AAA, SSS, SAS)', completed: false },
          { id: 'm-6-3', title: 'Important Rider Proofs & Numerical Questions', completed: false }
        ]
      },
      {
        id: 'math-ch7',
        title: 'Ch 7: Coordinate Geometry',
        subtopics: [
          { id: 'm-7-1', title: 'Distance Formula between two points', completed: false },
          { id: 'm-7-2', title: 'Collinearity of Three Points & Types of Quadrilaterals', completed: false },
          { id: 'm-7-3', title: 'Section Formula (Internal Division) & Midpoint Formula', completed: false }
        ]
      },
      {
        id: 'math-ch8',
        title: 'Ch 8: Introduction to Trigonometry',
        subtopics: [
          { id: 'm-8-1', title: 'Trigonometric Ratios (sin, cos, tan, cosec, sec, cot)', completed: false },
          { id: 'm-8-2', title: 'Trigonometric Table Values for 0°, 30°, 45°, 60°, 90°', completed: false },
          { id: 'm-8-3', title: 'Trigonometric Identity: sin²θ + cos²θ = 1', completed: false },
          { id: 'm-8-4', title: 'Trigonometric Identities: 1 + tan²θ = sec²θ, 1 + cot²θ = cosec²θ', completed: false }
        ]
      },
      {
        id: 'math-ch9',
        title: 'Ch 9: Some Applications of Trigonometry',
        subtopics: [
          { id: 'm-9-1', title: 'Angle of Elevation and Angle of Depression concepts', completed: false },
          { id: 'm-9-2', title: 'Heights and Distances 1-Triangle Problems', completed: false },
          { id: 'm-9-3', title: 'Heights and Distances 2-Triangle Multi-step Problems', completed: false }
        ]
      },
      {
        id: 'math-ch10',
        title: 'Ch 10: Circles',
        subtopics: [
          { id: 'm-10-1', title: 'Tangent to a Circle is perpendicular to Radius at point of contact', completed: false },
          { id: 'm-10-2', title: 'Lengths of tangents drawn from an external point are equal', completed: false },
          { id: 'm-10-3', title: 'NCERT Exemplar and Board Proof Riders', completed: false }
        ]
      },
      {
        id: 'math-ch11',
        title: 'Ch 11: Areas Related to Circles',
        subtopics: [
          { id: 'm-11-1', title: 'Area of Sector of Angle θ: (θ/360) × πr²', completed: false },
          { id: 'm-11-2', title: 'Length of Arc of Sector: (θ/360) × 2πr', completed: false },
          { id: 'm-11-3', title: 'Area of Minor and Major Segments of a Circle', completed: false }
        ]
      },
      {
        id: 'math-ch12',
        title: 'Ch 12: Surface Areas and Volumes',
        subtopics: [
          { id: 'm-12-1', title: 'Surface Area of Combination of Solids (Cylinder, Cone, Hemisphere)', completed: false },
          { id: 'm-12-2', title: 'Volume of Combination of Solids', completed: false },
          { id: 'm-12-3', title: 'Conversion of Solids (Melt & Recast into another shape)', completed: false }
        ]
      },
      {
        id: 'math-ch13',
        title: 'Ch 13: Statistics',
        subtopics: [
          { id: 'm-13-1', title: 'Mean of Grouped Data (Direct & Assumed Mean Method)', completed: false },
          { id: 'm-13-2', title: 'Mode of Grouped Data: l + [(f₁ - f₀)/(2f₁ - f₀ - f₂)] × h', completed: false },
          { id: 'm-13-3', title: 'Median of Grouped Data: l + [(n/2 - cf)/f] × h', completed: false },
          { id: 'm-13-4', title: 'Empirical Relationship: 3 Median = Mode + 2 Mean', completed: false }
        ]
      },
      {
        id: 'math-ch14',
        title: 'Ch 14: Probability',
        subtopics: [
          { id: 'm-14-1', title: 'Classical Definition of Probability: P(E) = n(E)/n(S)', completed: false },
          { id: 'm-14-2', title: 'Coin Toss, Dice Roll and Card Deck problems', completed: false },
          { id: 'm-14-3', title: 'Complementary Events: P(E) + P(not E) = 1', completed: false }
        ]
      }
    ]
  },
  {
    id: 'science-10',
    title: 'Science',
    code: '086',
    chapters: [
      {
        id: 'sci-ch1',
        title: 'Ch 1: Chemical Reactions and Equations',
        subtopics: [
          { id: 's-1-1', title: 'Writing and Balancing Chemical Equations', completed: false },
          { id: 's-1-2', title: 'Combination and Decomposition Reactions (Thermal, Electrolytic, Photolytic)', completed: false },
          { id: 's-1-3', title: 'Displacement and Double Displacement Reactions (Precipitation)', completed: false },
          { id: 's-1-4', title: 'Oxidation, Reduction, Redox, Corrosion and Rancidity', completed: false }
        ]
      },
      {
        id: 'sci-ch2',
        title: 'Ch 2: Acids, Bases and Salts',
        subtopics: [
          { id: 's-2-1', title: 'Chemical Properties of Acids and Bases (Indicators, Reaction with Metals)', completed: false },
          { id: 's-2-2', title: 'pH Scale and Importance of pH in Everyday Life', completed: false },
          { id: 's-2-3', title: 'Bleaching Powder & Baking Soda (Preparation, Formula, Uses)', completed: false },
          { id: 's-2-4', title: 'Washing Soda, Plaster of Paris and Water of Crystallization', completed: false }
        ]
      },
      {
        id: 'sci-ch3',
        title: 'Ch 3: Metals and Non-Metals',
        subtopics: [
          { id: 's-3-1', title: 'Physical and Chemical Properties of Metals and Non-Metals', completed: false },
          { id: 's-3-2', title: 'Reactivity Series of Metals & Displacement Reactions', completed: false },
          { id: 's-3-3', title: 'Ionic Bonds: Formation and Properties of Ionic Compounds', completed: false },
          { id: 's-3-4', title: 'Basic Metallurgical Processes, Roasting, Calcination and Refining', completed: false }
        ]
      },
      {
        id: 'sci-ch4',
        title: 'Ch 4: Carbon and its Compounds',
        subtopics: [
          { id: 's-4-1', title: 'Covalent Bonding in Carbon and Versatile Nature of Carbon (Catenation, Tetravalency)', completed: false },
          { id: 's-4-2', title: 'Saturated and Unsaturated Hydrocarbons (Alkanes, Alkenes, Alkynes)', completed: false },
          { id: 's-4-3', title: 'Functional Groups and Homologous Series', completed: false },
          { id: 's-4-4', title: 'Chemical Properties: Combustion, Oxidation, Addition & Substitution', completed: false },
          { id: 's-4-5', title: 'Ethanol and Ethanoic Acid (Esterification, Saponification)', completed: false },
          { id: 's-4-6', title: 'Soaps, Detergents and Cleansing Action of Soap (Micelle Formation)', completed: false }
        ]
      },
      {
        id: 'sci-ch5',
        title: 'Ch 5: Life Processes',
        subtopics: [
          { id: 's-5-1', title: 'Autotrophic and Heterotrophic Nutrition (Photosynthesis, Alimentary Canal)', completed: false },
          { id: 's-5-2', title: 'Respiration in Plants and Animals (Aerobic vs Anaerobic, ATP, Human Respiratory System)', completed: false },
          { id: 's-5-3', title: 'Transportation in Humans (Heart structure, Double Circulation, Blood vs Lymph)', completed: false },
          { id: 's-5-4', title: 'Transportation in Plants (Xylem and Phloem Mechanisms)', completed: false },
          { id: 's-5-5', title: 'Excretion in Humans (Nephron Structure and Urine Formation) and Plants', completed: false }
        ]
      },
      {
        id: 'sci-ch6',
        title: 'Ch 6: Control and Coordination',
        subtopics: [
          { id: 's-6-1', title: 'Neuron Structure, Synapse and Reflex Arc', completed: false },
          { id: 's-6-2', title: 'Human Brain (Forebrain, Midbrain, Hindbrain Functions)', completed: false },
          { id: 's-6-3', title: 'Plant Hormones (Auxin, Gibberellin, Cytokinin, Abscisic Acid) and Tropisms', completed: false },
          { id: 's-6-4', title: 'Animal Endocrine Hormones (Thyroxine, Growth Hormone, Insulin, Adrenaline)', completed: false }
        ]
      },
      {
        id: 'sci-ch7',
        title: 'Ch 7: How do Organisms Reproduce?',
        subtopics: [
          { id: 's-7-1', title: 'Asexual Reproduction: Fission, Fragmentation, Regeneration, Budding, Spore Formation', completed: false },
          { id: 's-7-2', title: 'Vegetative Propagation and Tissue Culture', completed: false },
          { id: 's-7-3', title: 'Sexual Reproduction in Flowering Plants (Structure of Flower, Pollination, Fertilization)', completed: false },
          { id: 's-7-4', title: 'Human Reproductive System (Male & Female organs, Menstrual Cycle)', completed: false },
          { id: 's-7-5', title: 'Reproductive Health, Contraceptive Methods and STDs', completed: false }
        ]
      },
      {
        id: 'sci-ch8',
        title: 'Ch 8: Heredity',
        subtopics: [
          { id: 's-8-1', title: 'Mendel’s Experiments: Monohybrid Cross (Law of Segregation)', completed: false },
          { id: 's-8-2', title: 'Dihybrid Cross (Law of Independent Assortment) and Phenotypic Ratios', completed: false },
          { id: 's-8-3', title: 'Mechanism of Sex Determination in Human Beings (XX and XY Chromosomes)', completed: false }
        ]
      },
      {
        id: 'sci-ch9',
        title: 'Ch 9: Light - Reflection and Refraction',
        subtopics: [
          { id: 's-9-1', title: 'Spherical Mirrors: Ray Diagrams for Concave and Convex Mirrors', completed: false },
          { id: 's-9-2', title: 'Mirror Formula (1/f = 1/v + 1/u) and Magnification (m = -v/u)', completed: false },
          { id: 's-9-3', title: 'Refraction through Glass Slab & Snell’s Law of Refraction', completed: false },
          { id: 's-9-4', title: 'Lenses: Ray Diagrams for Convex and Concave Lenses', completed: false },
          { id: 's-9-5', title: 'Lens Formula (1/f = 1/v - 1/u) and Power of a Lens (P = 1/f)', completed: false }
        ]
      },
      {
        id: 'sci-ch10',
        title: 'Ch 10: The Human Eye and the Colourful World',
        subtopics: [
          { id: 's-10-1', title: 'Structure and Functioning of the Human Eye & Power of Accommodation', completed: false },
          { id: 's-10-2', title: 'Defects of Vision: Myopia, Hypermetropia, Presbyopia and their Corrections', completed: false },
          { id: 's-10-3', title: 'Refraction of Light through a Triangular Glass Prism & Dispersion', completed: false },
          { id: 's-10-4', title: 'Atmospheric Refraction (Twinkling of Stars, Advance Sunrise & Delayed Sunset)', completed: false },
          { id: 's-10-5', title: 'Scattering of Light: Tyndall Effect and Blue Colour of the Sky', completed: false }
        ]
      },
      {
        id: 'sci-ch11',
        title: 'Ch 11: Electricity',
        subtopics: [
          { id: 's-11-1', title: 'Electric Current, Potential Difference and Ohm’s Law (V = IR)', completed: false },
          { id: 's-11-2', title: 'Factors on which Resistance depends & Resistivity (ρ)', completed: false },
          { id: 's-11-3', title: 'Resistors in Series (R = R₁ + R₂ + ...) and Parallel (1/R = 1/R₁ + 1/R₂ + ...)', completed: false },
          { id: 's-11-4', title: 'Heating Effect of Electric Current: Joule’s Law of Heating (H = I²Rt)', completed: false },
          { id: 's-11-5', title: 'Electric Power (P = VI = I²R = V²/R) and Commercial Unit of Energy (kWh)', completed: false }
        ]
      },
      {
        id: 'sci-ch12',
        title: 'Ch 12: Magnetic Effects of Electric Current',
        subtopics: [
          { id: 's-12-1', title: 'Magnetic Field and Field Lines around a Bar Magnet', completed: false },
          { id: 's-12-2', title: 'Right-Hand Thumb Rule and Field due to Current through Solenoid', completed: false },
          { id: 's-12-3', title: 'Force on a Current-Carrying Conductor & Fleming’s Left-Hand Rule', completed: false },
          { id: 's-12-4', title: 'Domestic Electric Circuits, Earth Wire, Short Circuiting and Overloading', completed: false }
        ]
      },
      {
        id: 'sci-ch13',
        title: 'Ch 13: Our Environment',
        subtopics: [
          { id: 's-13-1', title: 'Ecosystem Components (Biotic and Abiotic) and Trophic Levels', completed: false },
          { id: 's-13-2', title: '10% Law of Energy Transfer and Biological Magnification', completed: false },
          { id: 's-13-3', title: 'Ozone Layer Depletion and Managing Garbage / Waste Disposal', completed: false }
        ]
      }
    ]
  },
  {
    id: 'sst-10',
    title: 'Social Science (SST)',
    code: '087',
    chapters: [
      {
        id: 'sst-his1',
        title: 'History Ch 1: The Rise of Nationalism in Europe',
        subtopics: [
          { id: 'h-1-1', title: 'The French Revolution and the Idea of the Nation (Napoleonic Code)', completed: false },
          { id: 'h-1-2', title: 'The Making of Nationalism in Europe & Liberal Nationalism', completed: false },
          { id: 'h-1-3', title: 'The Age of Revolutions: 1830-1848 and Romantic Imagination', completed: false },
          { id: 'h-1-4', title: 'The Making of Germany and Italy & Strange Case of Britain', completed: false },
          { id: 'h-1-5', title: 'Visualising the Nation (Allegories) & Nationalism and Imperialism', completed: false }
        ]
      },
      {
        id: 'sst-his2',
        title: 'History Ch 2: Nationalism in India',
        subtopics: [
          { id: 'h-2-1', title: 'First World War, Khilafat and Non-Cooperation Movement', completed: false },
          { id: 'h-2-2', title: 'Differing Strands within the Movement (Towns, Countryside, Tribal Rebellion)', completed: false },
          { id: 'h-2-3', title: 'Towards Civil Disobedience: Simon Commission, Salt March & Dandi', completed: false },
          { id: 'h-2-4', title: 'How Participants saw the Movement and Limits of Civil Disobedience', completed: false },
          { id: 'h-2-5', title: 'The Sense of Collective Belonging (Bharat Mata, Folklore, Flag)', completed: false }
        ]
      },
      {
        id: 'sst-his3',
        title: 'History Ch 3: The Making of a Global World',
        subtopics: [
          { id: 'h-3-1', title: 'The Pre-modern World (Silk Routes, Food Travels, Conquest & Disease)', completed: false },
          { id: 'h-3-2', title: 'The Nineteenth Century (1815-1914) World Economy', completed: false }
        ]
      },
      {
        id: 'sst-his4',
        title: 'History Ch 4: Print Culture and the Modern World',
        subtopics: [
          { id: 'h-4-1', title: 'The First Printed Books in China, Japan and Korea', completed: false },
          { id: 'h-4-2', title: 'Print Comes to Europe: Gutenberg’s Printing Press', completed: false },
          { id: 'h-4-3', title: 'The Print Revolution and Its Impact on Religious Debates', completed: false },
          { id: 'h-4-4', title: 'India and the World of Print & Religious Reform / Public Debates', completed: false }
        ]
      },
      {
        id: 'sst-geo1',
        title: 'Geography Ch 1: Resources and Development',
        subtopics: [
          { id: 'g-1-1', title: 'Classification and Planning of Resources in India', completed: false },
          { id: 'g-1-2', title: 'Land Resources, Land Use Pattern and Land Degradation / Conservation', completed: false },
          { id: 'g-1-3', title: 'Soil as a Resource: Classification of Soils (Alluvial, Black, Red & Yellow, Laterite, Arid)', completed: false }
        ]
      },
      {
        id: 'sst-geo2',
        title: 'Geography Ch 2: Forest and Wildlife Resources',
        subtopics: [
          { id: 'g-2-1', title: 'Flora and Fauna in India & IUCN Classification of Species', completed: false },
          { id: 'g-2-2', title: 'Conservation of Forest and Wildlife & Types of Forests (Reserved, Protected, Unclassed)', completed: false },
          { id: 'g-2-3', title: 'Community and Conservation (Chipko Movement, Beej Bachao, JFM)', completed: false }
        ]
      },
      {
        id: 'sst-geo3',
        title: 'Geography Ch 3: Water Resources',
        subtopics: [
          { id: 'g-3-1', title: 'Water Scarcity and Need for Water Conservation and Management', completed: false },
          { id: 'g-3-2', title: 'Multi-purpose River Projects and Integrated Water Resources Management', completed: false },
          { id: 'g-3-3', title: 'Rainwater Harvesting Systems across Indian States', completed: false }
        ]
      },
      {
        id: 'sst-geo4',
        title: 'Geography Ch 4: Agriculture',
        subtopics: [
          { id: 'g-4-1', title: 'Types of Farming: Primitive Subsistence, Intensive Subsistence, Commercial', completed: false },
          { id: 'g-4-2', title: 'Cropping Pattern: Rabi, Kharif, Zaid Seasons', completed: false },
          { id: 'g-4-3', title: 'Major Crops: Rice, Wheat, Millets, Pulses, Sugarcane, Tea, Coffee, Cotton, Jute', completed: false },
          { id: 'g-4-4', title: 'Technological and Institutional Reforms in Indian Agriculture', completed: false }
        ]
      },
      {
        id: 'sst-geo5',
        title: 'Geography Ch 5: Minerals and Energy Resources',
        subtopics: [
          { id: 'g-5-1', title: 'Mode of Occurrence and Classification of Minerals', completed: false },
          { id: 'g-5-2', title: 'Ferrous and Non-Ferrous Minerals Distribution', completed: false },
          { id: 'g-5-3', title: 'Conventional Sources of Energy (Coal, Petroleum, Natural Gas, Electricity)', completed: false },
          { id: 'g-5-4', title: 'Non-Conventional Energy (Solar, Wind, Biogas, Tidal, Geo-Thermal)', completed: false }
        ]
      },
      {
        id: 'sst-geo6',
        title: 'Geography Ch 6: Manufacturing Industries',
        subtopics: [
          { id: 'g-6-1', title: 'Importance of Manufacturing & Location Factors of Industries', completed: false },
          { id: 'g-6-2', title: 'Agro-based Industries (Textiles, Sugar) and Mineral-based (Iron & Steel, Aluminium, Chemical)', completed: false },
          { id: 'g-6-3', title: 'Industrial Pollution and Environmental Degradation Control', completed: false }
        ]
      },
      {
        id: 'sst-geo7',
        title: 'Geography Ch 7: Lifelines of National Economy',
        subtopics: [
          { id: 'g-7-1', title: 'Transport: Roadways, Railways, Pipelines, Waterways and Major Sea Ports', completed: false },
          { id: 'g-7-2', title: 'Airways, Communication Networks, International Trade and Tourism', completed: false }
        ]
      },
      {
        id: 'sst-civ1',
        title: 'Civics Ch 1: Power Sharing',
        subtopics: [
          { id: 'c-1-1', title: 'Case Studies: Belgium and Sri Lanka (Majoritarianism vs Accommodation)', completed: false },
          { id: 'c-1-2', title: 'Why is Power Sharing Desirable? (Prudential and Moral Reasons)', completed: false },
          { id: 'c-1-3', title: 'Forms of Power Sharing (Horizontal, Vertical, Social Groups, Political Parties)', completed: false }
        ]
      },
      {
        id: 'sst-civ2',
        title: 'Civics Ch 2: Federalism',
        subtopics: [
          { id: 'c-2-1', title: 'What is Federalism? Key Features of Federalism', completed: false },
          { id: 'c-2-2', title: 'Coming Together vs Holding Together Federations', completed: false },
          { id: 'c-2-3', title: 'What makes India a Federal Country? (Union, State, Concurrent Lists)', completed: false },
          { id: 'c-2-4', title: 'Decentralisation in India: Panchayati Raj & Municipalities (1992 Amendment)', completed: false }
        ]
      },
      {
        id: 'sst-civ3',
        title: 'Civics Ch 3: Gender, Religion and Caste',
        subtopics: [
          { id: 'c-3-1', title: 'Gender and Politics: Sexual Division of Labour and Feminist Movements', completed: false },
          { id: 'c-3-2', title: 'Religion, Communalism and Secular State in Indian Constitution', completed: false },
          { id: 'c-3-3', title: 'Caste and Politics: Caste Inequalities, Politics in Caste and Caste in Politics', completed: false }
        ]
      },
      {
        id: 'sst-civ4',
        title: 'Civics Ch 4: Political Parties',
        subtopics: [
          { id: 'c-4-1', title: 'Why do we need Political Parties? Functions and Necessity', completed: false },
          { id: 'c-4-2', title: 'How Many Parties should we have? National vs State Parties', completed: false },
          { id: 'c-4-3', title: 'Challenges to Political Parties (Dynastic Succession, Money & Muscle Power)', completed: false },
          { id: 'c-4-4', title: 'How can Parties be Reformed? Anti-Defection Law, ECI regulations', completed: false }
        ]
      },
      {
        id: 'sst-civ5',
        title: 'Civics Ch 5: Outcomes of Democracy',
        subtopics: [
          { id: 'c-5-1', title: 'How do we assess Democracy’s Outcomes? Accountable, Responsive & Legitimate Govt', completed: false },
          { id: 'c-5-2', title: 'Economic Growth, Reduction of Inequality and Poverty', completed: false },
          { id: 'c-5-3', title: 'Accommodation of Social Diversity and Dignity & Freedom of the Citizens', completed: false }
        ]
      },
      {
        id: 'sst-eco1',
        title: 'Economics Ch 1: Development',
        subtopics: [
          { id: 'e-1-1', title: 'What Development Promises - Different People, Different Goals', completed: false },
          { id: 'e-1-2', title: 'Income and Other Goals & National Development', completed: false },
          { id: 'e-1-3', title: 'How to Compare Different Countries? (Per Capita Income, World Bank Criteria)', completed: false },
          { id: 'e-1-4', title: 'Public Facilities, Human Development Index (HDI) and Sustainability of Development', completed: false }
        ]
      },
      {
        id: 'sst-eco2',
        title: 'Economics Ch 2: Sectors of the Indian Economy',
        subtopics: [
          { id: 'e-2-1', title: 'Sectors of Economic Activities: Primary, Secondary and Tertiary', completed: false },
          { id: 'e-2-2', title: 'Comparing the Three Sectors and Historical Changes in Sectors', completed: false },
          { id: 'e-2-3', title: 'Rising Importance of the Tertiary Sector in India', completed: false },
          { id: 'e-2-4', title: 'Disguised Unemployment and How to Create More Employment (MGNREGA 2005)', completed: false },
          { id: 'e-2-5', title: 'Organised vs Unorganised Sectors, Public vs Private Sectors', completed: false }
        ]
      },
      {
        id: 'sst-eco3',
        title: 'Economics Ch 3: Money and Credit',
        subtopics: [
          { id: 'e-3-1', title: 'Money as a Medium of Exchange & Double Coincidence of Wants', completed: false },
          { id: 'e-3-2', title: 'Modern Forms of Money: Currency, Demand Deposits, Cheques', completed: false },
          { id: 'e-3-3', title: 'Loan Activities of Banks and Terms of Credit (Collateral, Interest Rate)', completed: false },
          { id: 'e-3-4', title: 'Formal vs Informal Sources of Credit in India and Role of RBI', completed: false },
          { id: 'e-3-5', title: 'Self-Help Groups (SHGs) for the Poor', completed: false }
        ]
      },
      {
        id: 'sst-eco4',
        title: 'Economics Ch 4: Globalisation and the Indian Economy',
        subtopics: [
          { id: 'e-4-1', title: 'Production Across Countries: Multinational Corporations (MNCs)', completed: false },
          { id: 'e-4-2', title: 'Interlinking Production Across Countries and Foreign Trade', completed: false },
          { id: 'e-4-3', title: 'What is Globalisation? Factors Enabling Globalisation (Technology & Liberalisation)', completed: false },
          { id: 'e-4-4', title: 'World Trade Organisation (WTO) and Impact of Globalisation in India', completed: false }
        ]
      }
    ]
  },
  {
    id: 'eng-10',
    title: 'English Language & Literature',
    code: '184',
    chapters: [
      {
        id: 'eng-ch1',
        title: 'First Flight: Prose',
        subtopics: [
          { id: 'en-p-1', title: 'A Letter to God (Lencho & Postmaster)', completed: false },
          { id: 'en-p-2', title: 'Nelson Mandela: Long Walk to Freedom', completed: false },
          { id: 'en-p-3', title: 'Two Stories about Flying (His First Flight & Black Aeroplane)', completed: false },
          { id: 'en-p-4', title: 'From the Diary of Anne Frank', completed: false },
          { id: 'en-p-5', title: 'Glimpses of India (Baker from Goa, Coorg, Tea from Assam)', completed: false },
          { id: 'en-p-6', title: 'Mijbil the Otter', completed: false },
          { id: 'en-p-7', title: 'Madam Rides the Bus (Valli)', completed: false },
          { id: 'en-p-8', title: 'The Sermon at Benares (Kisa Gotami & Buddha)', completed: false },
          { id: 'en-p-9', title: 'The Proposal (Anton Chekhov Drama)', completed: false }
        ]
      },
      {
        id: 'eng-ch2',
        title: 'First Flight: Poetry',
        subtopics: [
          { id: 'en-po-1', title: 'Dust of Snow & Fire and Ice (Robert Frost)', completed: false },
          { id: 'en-po-2', title: 'A Tiger in the Zoo (Leslie Norris)', completed: false },
          { id: 'en-po-3', title: 'How to Tell Wild Animals & The Ball Poem', completed: false },
          { id: 'en-po-4', title: 'Amanda! (Robin Klein)', completed: false },
          { id: 'en-po-5', title: 'The Trees (Adrienne Rich)', completed: false },
          { id: 'en-po-6', title: 'Fog (Carl Sandburg)', completed: false },
          { id: 'en-po-7', title: 'The Tale of Custard the Dragon (Ogden Nash)', completed: false },
          { id: 'en-po-8', title: 'For Anne Gregory (W.B. Yeats)', completed: false }
        ]
      },
      {
        id: 'eng-ch3',
        title: 'Footprints Without Feet: Supplementary',
        subtopics: [
          { id: 'en-fp-1', title: 'A Triumph of Surgery (Tricki & Dr. Herriot)', completed: false },
          { id: 'en-fp-2', title: 'The Thief’s Story (Hari Singh & Anil)', completed: false },
          { id: 'en-fp-3', title: 'The Midnight Visitor (Ausable)', completed: false },
          { id: 'en-fp-4', title: 'A Question of Trust (Horace Danby)', completed: false },
          { id: 'en-fp-5', title: 'Footprints Without Feet (Griffin the Scientist)', completed: false },
          { id: 'en-fp-6', title: 'The Making of a Scientist (Richard Ebright)', completed: false },
          { id: 'en-fp-7', title: 'The Necklace (Matilda Loisel)', completed: false },
          { id: 'en-fp-8', title: 'Bholi (Sulekha & Education empowerment)', completed: false },
          { id: 'en-fp-9', title: 'The Book That Saved the Earth (Martians & Mother Goose)', completed: false }
        ]
      },
      {
        id: 'eng-ch4',
        title: 'Grammar & Writing Skills',
        subtopics: [
          { id: 'en-gr-1', title: 'Tenses & Modals practice', completed: false },
          { id: 'en-gr-2', title: 'Subject-Verb Concord & Determiners', completed: false },
          { id: 'en-gr-3', title: 'Reported Speech: Commands, Requests, Statements, Questions', completed: false },
          { id: 'en-gr-4', title: 'Formal Letter (Complaint, Inquiry, Editor, Placing Order)', completed: false },
          { id: 'en-gr-5', title: 'Analytical Paragraph (Map, Chart, Graph interpretation)', completed: false }
        ]
      }
    ]
  }
];
