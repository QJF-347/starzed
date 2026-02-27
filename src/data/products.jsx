import React from 'react';
import { Heart, Users, Building, Briefcase, Shield, Home, Key, PiggyBank, GraduationCap, Anchor, Car, Truck, Package, AlertTriangle, FileText, Plane, Trees, Dog, TrendingUp, Factory, UserCheck, HandCoins, Sprout } from 'lucide-react';

export const products = [
    // --- Medical Insurance ---
    {
        id: 'group-medical',
        title: 'Group Medical',
        category: 'Medical Insurance',
        shortDescription: 'Comprehensive health cover for employees working in an organization',
        description: 'Group Medical insurance provides comprehensive healthcare coverage for employees, ensuring access to quality medical services and promoting workplace wellness.',
        icon: <Users size={48} />,
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
        features: [
            'Comprehensive Health Coverage: Full medical benefits for employees',
            'Corporate Wellness: Health and wellness programs included',
            'Flexible Plans: Customizable coverage options',
            'Network Access: Wide hospital and clinic network'
        ]
    },
    {
        id: 'executive-medical-scheme',
        title: 'Executive Medical Scheme',
        category: 'Medical Insurance',
        shortDescription: 'This cover is tailored for executives, senior officers, politicians, Business people & professionals',
        description: 'Executive Medical Scheme offers premium healthcare coverage designed for high-level executives and professionals with enhanced benefits and personalized service.',
        icon: <Briefcase size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Premium Coverage: Enhanced medical benefits for executives',
            'Personalized Service: Dedicated healthcare support',
            'Global Coverage: International medical assistance',
            'VIP Treatment: Priority access to healthcare facilities'
        ]
    },
    {
        id: 'family-health-cover',
        title: 'Family Health Cover',
        category: 'Medical Insurance',
        shortDescription: 'Family-oriented health insurance with wide benefits for cater for family health needs',
        description: 'Family Health Cover provides comprehensive medical protection for your entire family with extensive benefits and affordable premiums.',
        icon: <Heart size={48} />,
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
        features: [
            'Family Coverage: All family members included',
            'Wide Benefits: Comprehensive medical services',
            'Affordable Premiums: Cost-effective family protection',
            'Preventive Care: Regular check-ups and screenings'
        ]
    },
    {
        id: 'junior-health-cover',
        title: 'Junior Health Cover',
        category: 'Medical Insurance',
        shortDescription: 'Affordable health plan designed for children and young dependents aged 0 to 18 years',
        description: 'Junior Health Cover is specifically designed for children and young dependents, providing comprehensive medical coverage at affordable rates.',
        icon: <GraduationCap size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Child-Focused: Specialized coverage for children',
            'Affordable: Budget-friendly premiums',
            'Comprehensive: Full medical services for minors',
            'Pediatric Care: Specialized children healthcare'
        ]
    },
    {
        id: 'individual-insurance-cover',
        title: 'Individual Insurance Cover',
        category: 'Medical Insurance',
        shortDescription: 'General medical insurance for individuals or families',
        description: 'Individual Insurance Cover provides flexible medical protection tailored to personal or family needs with comprehensive benefits.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Flexible Coverage: Customizable to individual needs',
            'Comprehensive Benefits: Full medical protection',
            'Family Options: Add family members easily',
            'Affordable Plans: Various premium options'
        ]
    },
    {
        id: 'critical-illness-cover',
        title: 'Critical Illness Cover',
        category: 'Medical Insurance',
        shortDescription: 'Cover against life-threatening critical illnesses like cancer, paralysis, heart problems, stroke, etc',
        description: 'Critical Illness Cover provides financial protection against life-threatening illnesses with lump sum payouts upon diagnosis.',
        icon: <AlertTriangle size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Critical Coverage: Protection against major illnesses',
            'Lump Sum Payout: Immediate financial support',
            'Wide Range: Covers cancer, heart conditions, stroke',
            'Recovery Support: Financial aid during recovery'
        ]
    },

    // --- Life & Personal Insurance ---
    {
        id: 'whole-life-assurance',
        title: 'Whole Life Assurance',
        category: 'Life & Personal Insurance',
        shortDescription: 'Long-term financial protection for loved ones in case of death or total disability',
        description: 'Whole Life Assurance provides lifelong financial protection for your loved ones with guaranteed payouts and cash value accumulation.',
        icon: <Heart size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Lifelong Coverage: Protection for entire life',
            'Guaranteed Payout: Death benefit assured',
            'Cash Value: Investment component grows over time',
            'Estate Planning: Helps with wealth transfer'
        ]
    },
    {
        id: 'group-life-cover',
        title: 'Group Life Cover',
        category: 'Life & Personal Insurance',
        shortDescription: 'Life insurance provided for employee groups',
        description: 'Group Life Cover offers life insurance protection for employee groups with affordable premiums and comprehensive benefits.',
        icon: <Users size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Group Protection: Coverage for employee groups',
            'Affordable Premiums: Lower group rates',
            'Employer Benefit: Attractive employee benefit',
            'Easy Administration: Simplified group management'
        ]
    },
    {
        id: 'group-personal-accident',
        title: 'Group Personal Accident',
        category: 'Life & Personal Insurance',
        shortDescription: 'Accident cover for employee groups, ensuring protection at work, or travel as a result of bodily injury',
        description: 'Group Personal Accident provides comprehensive accident protection for employee groups covering work-related and travel incidents.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Accident Protection: Comprehensive coverage for injuries',
            'Work & Travel: Protection during work and travel',
            'Group Coverage: All employees included',
            'Quick Claims: Fast claim processing'
        ]
    },
    {
        id: 'personal-accident-cover',
        title: 'Personal Accident Cover',
        category: 'Life & Personal Insurance',
        shortDescription: 'Personal accident protection against injury, loss of income due to accidents, disability, or death',
        description: 'Personal Accident Cover provides financial protection against accidents with coverage for injury, disability, and death benefits.',
        icon: <AlertTriangle size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Accident Coverage: Protection against injuries',
            'Income Protection: Compensation for lost income',
            'Disability Benefits: Coverage for permanent disability',
            'Death Benefit: Financial support for beneficiaries'
        ]
    },
    {
        id: 'pensions',
        title: 'Pensions',
        category: 'Life & Personal Insurance',
        shortDescription: 'Retirement savings and income planning product to secure when one outlives their incomes',
        description: 'Pensions provide retirement savings and income planning to ensure financial security when you outlive your working income.',
        icon: <PiggyBank size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Retirement Planning: Secure your financial future',
            'Regular Income: Pension payments during retirement',
            'Investment Growth: Funds grow over time',
            'Flexible Options: Various pension plans available'
        ]
    },
    {
        id: 'savings-investment',
        title: 'Savings & Investment',
        category: 'Life & Personal Insurance',
        shortDescription: 'Savings and investment product for financial growth combined with life insurance cover, also known as endowment policies',
        description: 'Savings & Investment combines financial growth with life insurance protection, offering both investment returns and life coverage.',
        icon: <TrendingUp size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Investment Growth: Returns on savings',
            'Life Coverage: Insurance protection included',
            'Endowment Benefits: Maturity payouts available',
            'Flexible Terms: Various saving periods'
        ]
    },

    // --- Property Insurance ---
    {
        id: 'domestic-package',
        title: 'Domestic Package',
        category: 'Property Insurance',
        shortDescription: 'Insurance for home and domestic property against risks including domestic employees and public liability',
        description: 'Domestic Package provides comprehensive insurance for homes and domestic property including employee and liability coverage.',
        icon: <Home size={48} />,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        features: [
            'Home Protection: Comprehensive property coverage',
            'Domestic Employees: Coverage for household staff',
            'Public Liability: Protection against third-party claims',
            'All Risks: Wide range of perils covered'
        ]
    },
    {
        id: 'fire-perils-theft-burglary',
        title: 'Fire & Perils / Theft / Burglary',
        category: 'Property Insurance',
        shortDescription: 'Cover against fire, theft, and burglary for assets and property in business and other work related places',
        description: 'Fire & Perils / Theft / Burglary provides comprehensive protection for business assets against fire, theft, and burglary risks.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Fire Protection: Coverage against fire damage',
            'Theft Coverage: Protection against theft',
            'Burglary Protection: Security against break-ins',
            'Business Assets: Coverage for work property'
        ]
    },
    {
        id: 'fire-domestic',
        title: 'Fire – Domestic',
        category: 'Property Insurance',
        shortDescription: 'Fire protection for homes and other domestic properties',
        description: 'Fire – Domestic provides specialized fire protection coverage for homes and domestic properties against fire-related damages.',
        icon: <Home size={48} />,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        features: [
            'Fire Coverage: Protection against fire damage',
            'Domestic Focus: Specialized for homes',
            'Rebuilding Costs: Coverage for reconstruction',
            'Contents Protection: Personal items covered'
        ]
    },
    {
        id: 'fire-industrial',
        title: 'Fire – Industrial',
        category: 'Property Insurance',
        shortDescription: 'Fire protection for industrial property',
        description: 'Fire – Industrial provides comprehensive fire protection for industrial properties including factories, warehouses, and equipment.',
        icon: <Factory size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Industrial Coverage: Protection for factories',
            'Equipment Protection: Machinery and tools covered',
            'Business Interruption: Coverage for lost income',
            'Specialized Risks: Industrial-specific perils'
        ]
    },
    {
        id: 'fire-building-stocks',
        title: 'Fire, Building & Stocks',
        category: 'Property Insurance',
        shortDescription: 'Insurance for business buildings and the goods (stock) inside against fire and related risks',
        description: 'Fire, Building & Stocks provides comprehensive coverage for business buildings and inventory against fire and related perils.',
        icon: <Building size={48} />,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        features: [
            'Building Protection: Coverage for business structures',
            'Stock Coverage: Protection for inventory and goods',
            'Fire Risks: Comprehensive fire protection',
            'Business Assets: Complete property coverage'
        ]
    },
    {
        id: 'wiba-employers-liability',
        title: "WIBA, Employer's Liability",
        category: 'Property Insurance',
        shortDescription: "Covers employees if they get injured or sick while working — WIBA pays them directly as required by law, while Employer's Liability protects the company if workers take legal action",
        description: "WIBA, Employer's Liability provides mandatory coverage for workplace injuries and protects employers from legal action related to employee claims.",
        icon: <UserCheck size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'WIBA Coverage: Mandatory workplace injury protection',
            'Employer Liability: Legal protection for companies',
            'Employee Protection: Direct payments to injured workers',
            'Legal Compliance: Meets statutory requirements'
        ]
    },

    // --- Liability Insurance ---
    {
        id: 'fidelity-guarantee',
        title: 'Fidelity Guarantee',
        category: 'Liability Insurance',
        shortDescription: 'Protection against employee dishonesty or fraud leading to financial loss',
        description: 'Fidelity Guarantee provides protection against financial losses resulting from employee dishonesty, fraud, or theft.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
        features: [
            'Employee Fraud: Protection against dishonest acts',
            'Financial Loss: Coverage for monetary losses',
            'Theft Protection: Coverage for employee theft',
            'Business Security: Financial protection for companies'
        ]
    },
    {
        id: 'professional-indemnity',
        title: 'Professional Indemnity (consultancy)',
        category: 'Liability Insurance',
        shortDescription: 'Liability cover for professionals against errors or negligence',
        description: 'Professional Indemnity provides liability coverage for professionals against claims of errors, negligence, or malpractice in their professional services.',
        icon: <Briefcase size={48} />,
        image: 'https://images.unsplash.com/photo-1507679799987-c7377bd5871f?w=800&q=80',
        features: [
            'Professional Protection: Coverage for professional errors',
            'Negligence Claims: Protection against negligence lawsuits',
            'Legal Defense: Coverage for legal costs',
            'Professional Security: Peace of mind for practitioners'
        ]
    },
    {
        id: 'public-liability',
        title: 'Public liability',
        category: 'Liability Insurance',
        shortDescription: 'Pays if a customer, visitor, or member of the public is injured or their property is damaged while dealing with your business',
        description: 'Public Liability provides coverage when third parties are injured or their property is damaged due to your business activities.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Third Party Protection: Coverage for public injuries',
            'Property Damage: Protection for third-party property',
            'Business Liability: Essential for customer-facing businesses',
            'Legal Compliance: Meets regulatory requirements'
        ]
    },
    {
        id: 'political-violence-terrorism',
        title: 'Political Violence & Terrorism',
        category: 'Liability Insurance',
        shortDescription: 'Protection against losses from political violence or terrorism',
        description: 'Political Violence & Terrorism provides coverage for losses resulting from acts of terrorism, political violence, and civil unrest.',
        icon: <AlertTriangle size={48} />,
        image: 'https://images.unsplash.com/photo-1582132717841-38cb4402662c?w=800&q=80',
        features: [
            'Terrorism Cover: Protection against terrorist acts',
            'Political Violence: Coverage for civil unrest',
            'Business Continuity: Ensures operations can continue',
            'Asset Protection: Safeguards business assets'
        ]
    },
    {
        id: 'riot-strike-civil-commotion',
        title: 'Riot, Strike & Civil Commotion',
        category: 'Liability Insurance',
        shortDescription: 'Cover against losses due to riots, strikes, and civil commotion',
        description: 'Riot, Strike & Civil Commotion provides protection against losses resulting from labor disputes, riots, and civil disturbances.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1582132717841-38cb4402662c?w=800&q=80',
        features: [
            'Riot Protection: Coverage for riot-related losses',
            'Strike Coverage: Protection during labor strikes',
            'Civil Commotion: Coverage for civil disturbances',
            'Business Security: Protects against social unrest'
        ]
    },
    {
        id: 'carriers-liability',
        title: "Carrier's Liability",
        category: 'Liability Insurance',
        shortDescription: 'Liability cover for goods transported by carriers',
        description: "Carrier's Liability provides coverage for carriers against liability for loss or damage to goods in their custody during transport.",
        icon: <Truck size={48} />,
        image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80',
        features: [
            'Goods Protection: Coverage for transported goods',
            'Carrier Liability: Protection for transport companies',
            'Transit Coverage: Protection during transportation',
            'Cargo Security: Financial protection for cargo'
        ]
    },

    // --- Motor Insurance ---
    {
        id: 'motor-private',
        title: 'Motor – Private',
        category: 'Motor Insurance',
        shortDescription: 'Private car insurance against accidents, theft, or damage and third-party risks',
        description: 'Motor – Private provides comprehensive insurance coverage for private cars against accidents, theft, damage, and third-party liabilities.',
        icon: <Car size={48} />,
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
        features: [
            'Comprehensive Coverage: Full protection for private vehicles',
            'Accident Protection: Coverage for collision and damage',
            'Theft Protection: Security against vehicle theft',
            'Third Party Liability: Protection against third-party claims'
        ]
    },
    {
        id: 'motor-commercial',
        title: 'Motor – Commercial',
        category: 'Motor Insurance',
        shortDescription: 'Insurance cover for commercial vehicles and fleets',
        description: 'Motor – Commercial provides specialized insurance coverage for commercial vehicles and fleets with comprehensive protection options.',
        icon: <Truck size={48} />,
        image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80',
        features: [
            'Fleet Coverage: Protection for multiple commercial vehicles',
            'Business Use: Coverage for business operations',
            'Comprehensive Protection: Full coverage for commercial risks',
            'Flexible Options: Customizable for business needs'
        ]
    },
    {
        id: 'psv-motor-vehicle',
        title: 'PSV Motor Vehicle Insurance',
        category: 'Motor Insurance',
        shortDescription: 'General cover for all types of motor vehicles and third-party risks',
        description: 'PSV Motor Vehicle Insurance provides comprehensive coverage for public service vehicles and general motor vehicle risks.',
        icon: <Car size={48} />,
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
        features: [
            'PSV Coverage: Specialized for public service vehicles',
            'Third Party Protection: Comprehensive liability coverage',
            'Public Transport: Coverage for passenger vehicles',
            'Regulatory Compliance: Meets PSV requirements'
        ]
    },
    {
        id: 'motorcycle-insurance',
        title: 'Motorcycle Insurance',
        category: 'Motor Insurance',
        shortDescription: 'Protection for motorcycles against accidents, theft, or damage and third-party risks',
        description: 'Motorcycle Insurance provides comprehensive protection for motorcycles against accidents, theft, damage, and third-party liabilities.',
        icon: <Car size={48} />,
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
        features: [
            'Bike Protection: Comprehensive motorcycle coverage',
            'Accident Coverage: Protection for rider and bike',
            'Theft Protection: Security against motorcycle theft',
            'Third Party Liability: Protection for third-party claims'
        ]
    },
    {
        id: 'cash-in-transit',
        title: 'Cash in Transit',
        category: 'Motor Insurance',
        shortDescription: 'Insurance for cash being transported from one place to another like from the shop to the bank',
        description: 'Cash in Transit provides specialized insurance coverage for cash and valuables during transportation between locations.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'Cash Protection: Coverage for cash during transport',
            'Valuables Coverage: Protection for valuable items',
            'Transit Security: Coverage during transportation',
            'Business Protection: Essential for cash businesses'
        ]
    },

    // --- Business & Financial Insurance ---
    {
        id: 'businessmans-combined-cover',
        title: "Businessman's Combined Cover",
        category: 'Business & Financial Insurance',
        shortDescription: 'Comprehensive insurance cover for businessmen combining multiple risks',
        description: "Businessman's Combined Cover provides comprehensive insurance coverage for businessmen, combining multiple risks into one convenient policy.",
        icon: <Briefcase size={48} />,
        image: 'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?w=800&q=80',
        features: [
            'Comprehensive Coverage: Multiple risks in one policy',
            'Business Protection: Complete business security',
            'Convenience: Single policy for multiple covers',
            'Cost Effective: Combined coverage savings'
        ]
    },
    {
        id: 'contractors-all-risk',
        title: "Contractor's All Risk (CAR)",
        category: 'Business & Financial Insurance',
        shortDescription: "Contractor's All Risk (CAR) insurance for construction projects against natural calamities and third party risks",
        description: "Contractor's All Risk (CAR) provides comprehensive coverage for construction projects against natural calamities and third-party risks.",
        icon: <Building size={48} />,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        features: [
            'Construction Coverage: Protection for building projects',
            'Natural Calamities: Coverage for natural disasters',
            'Third Party Risks: Liability protection',
            'Project Security: Comprehensive construction protection'
        ]
    },
    {
        id: 'bid-bond',
        title: 'Bid Bond',
        category: 'Business & Financial Insurance',
        shortDescription: 'Bid bond insurance required during tendering and bidding processes to secure the tenderer against financial implications',
        description: 'Bid Bond provides insurance security required during tendering and bidding processes to protect against financial implications.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1586282391129-59aef09a9632?w=800&q=80',
        features: [
            'Tender Security: Protection during bidding',
            'Financial Security: Guarantees bid commitments',
            'Contractor Support: Essential for contractors',
            'Bidding Protection: Secures tender process'
        ]
    },
    {
        id: 'mortgages',
        title: 'Mortgages',
        category: 'Business & Financial Insurance',
        shortDescription: 'Insurance solutions related to mortgages and home financing',
        description: 'Mortgages provide insurance solutions related to mortgages and home financing, protecting both lenders and borrowers.',
        icon: <Home size={48} />,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        features: [
            'Mortgage Protection: Coverage for home loans',
            'Home Financing: Insurance for property financing',
            'Lender Security: Protection for financial institutions',
            'Borrower Protection: Coverage for homeowners'
        ]
    },
    {
        id: 'public-liability-business',
        title: 'Public Liability',
        category: 'Business & Financial Insurance',
        shortDescription: 'Insurance package tailored for SMEs, Businesses, individual enterprises and corporate institutions against risks exposed to third-parties',
        description: 'Public Liability provides tailored insurance packages for SMEs, businesses, and corporate institutions against third-party risks.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        features: [
            'SME Protection: Coverage for small businesses',
            'Third Party Risks: Protection against public liability',
            'Business Security: Comprehensive coverage',
            'Corporate Protection: Coverage for institutions'
        ]
    },
    {
        id: 'school-combined-cover',
        title: 'School Combined Cover',
        category: 'Business & Financial Insurance',
        shortDescription: 'Comprehensive school insurance package covering property, liability, and students',
        description: 'School Combined Cover provides comprehensive insurance package for educational institutions covering property, liability, and students.',
        icon: <GraduationCap size={48} />,
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
        features: [
            'Educational Coverage: Protection for schools',
            'Property Protection: Building and facilities coverage',
            'Student Protection: Coverage for students',
            'Liability Protection: Comprehensive liability coverage'
        ]
    },

    // --- Agriculture Insurance ---
    {
        id: 'crop-insurance',
        title: 'Crop insurance',
        category: 'Agriculture insurance',
        shortDescription: 'Protects farmers against loss of crops due too drought, floods, pests, diseases, fire, hail',
        description: 'Crop insurance protects farmers against loss of crops due to drought, floods, pests, diseases, fire, and hail.',
        icon: <Sprout size={48} />,
        image: 'https://images.unsplash.com/photo-1500698213562-23164b8c78b4?w=800&q=80',
        features: [
            'Crop Protection: Coverage for crop losses',
            'Weather Protection: Coverage for natural events',
            'Pest & Disease: Protection against crop damage',
            'Farmer Security: Financial protection for farmers'
        ]
    },
    {
        id: 'livestock-insurance',
        title: 'Livestock insurance',
        category: 'Agriculture insurance',
        shortDescription: 'Covers animals (cows, goats, sheep) against death from diseases, accidents, theft',
        description: 'Livestock insurance covers animals such as cows, goats, and sheep against death from diseases, accidents, and theft.',
        icon: <Dog size={48} />,
        image: 'https://images.unsplash.com/photo-1548191019-601a6c77c4dc?w=800&q=80',
        features: [
            'Animal Protection: Coverage for livestock',
            'Disease Coverage: Protection against animal diseases',
            'Accident Protection: Coverage for animal accidents',
            'Theft Protection: Security against livestock theft'
        ]
    },
    {
        id: 'index-based-insurance',
        title: 'Index based insurance',
        category: 'Agriculture insurance',
        shortDescription: 'Payouts triggered by weather (rainfall, drought) or pasture conditions, not by farm visits',
        description: 'Index based insurance provides payouts triggered by weather conditions such as rainfall, drought, or pasture conditions, without requiring farm visits.',
        icon: <Trees size={48} />,
        image: 'https://images.unsplash.com/photo-1500698213562-23164b8c78b4?w=800&q=80',
        features: [
            'Weather Based: Payouts triggered by weather conditions',
            'Automated Process: No farm visits required',
            'Quick Payouts: Fast claim processing',
            'Objective Assessment: Based on weather indices'
        ]
    },
    {
        id: 'green-house-specialty-cover',
        title: 'Green house and specialty cover',
        category: 'Agriculture insurance',
        shortDescription: 'Protects greenhouses, equipment, and high value crops',
        description: 'Green house and specialty cover protects greenhouses, equipment, and high value crops with specialized insurance protection.',
        icon: <Trees size={48} />,
        image: 'https://images.unsplash.com/photo-1586282391129-59aef09a9632?w=800&q=80',
        features: [
            'Greenhouse Protection: Coverage for greenhouse structures',
            'Equipment Coverage: Protection for agricultural equipment',
            'High Value Crops: Coverage for specialty crops',
            'Specialized Protection: Tailored for agricultural needs'
        ]
    },
    {
        id: 'pet-insurance',
        title: 'Pet insurance',
        category: 'Agriculture insurance',
        shortDescription: 'Covers domestic animals (dogs, cats) against illnesses, accidents, surgery costs or theft',
        description: 'Pet insurance covers domestic animals such as dogs and cats against illnesses, accidents, surgery costs, or theft.',
        icon: <Dog size={48} />,
        image: 'https://images.unsplash.com/photo-1548191019-601a6c77c4dc?w=800&q=80',
        features: [
            'Pet Health: Coverage for pet illnesses',
            'Accident Coverage: Protection for pet accidents',
            'Surgery Coverage: Coverage for medical procedures',
            'Theft Protection: Security against pet theft'
        ]
    },

    // --- Travel insurance ---
    {
        id: 'single-trip-cover',
        title: 'Single trip cover',
        category: 'Travel insurance',
        shortDescription: 'One off protection for your next journey',
        description: 'Single trip cover provides one-off protection for your next journey with comprehensive travel insurance benefits.',
        icon: <Plane size={48} />,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
        features: [
            'Single Journey: Coverage for one trip',
            'Comprehensive Protection: Full travel coverage',
            'Trip Security: Protection for travel risks',
            'Flexible Coverage: Tailored for specific trips'
        ]
    },
    {
        id: 'annual-multi-trip-cover',
        title: 'Annual multi trip cover',
        category: 'Travel insurance',
        shortDescription: 'Unlimited trips in a year (for frequent travellers)',
        description: 'Annual multi trip cover provides unlimited trips in a year, ideal for frequent travelers with comprehensive protection.',
        icon: <Plane size={48} />,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
        features: [
            'Unlimited Trips: Coverage for multiple journeys',
            'Annual Coverage: Protection for one year',
            'Frequent Traveler: Ideal for regular travelers',
            'Comprehensive Protection: Full travel security'
        ]
    },
    {
        id: 'schengen-travel-plan',
        title: 'Schengen Travel plan',
        category: 'Travel insurance',
        shortDescription: 'Embassy approved cover for your Europe visa application',
        description: 'Schengen Travel plan provides embassy approved cover for your Europe visa application with comprehensive travel protection.',
        icon: <Plane size={48} />,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
        features: [
            'Visa Requirement: Embassy approved coverage',
            'Europe Travel: Coverage for Schengen area',
            'Visa Support: Documentation for visa application',
            'Comprehensive Protection: Full travel coverage'
        ]
    },
    {
        id: 'student-travel-plan',
        title: 'Student Travel plan',
        category: 'Travel insurance',
        shortDescription: 'Protection for students studying abroad',
        description: 'Student Travel plan provides specialized protection for students studying abroad with comprehensive coverage benefits.',
        icon: <Plane size={48} />,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
        features: [
            'Student Protection: Coverage for studying abroad',
            'Educational Travel: Specialized for students',
            'Comprehensive Coverage: Full protection benefits',
            'International Support: Coverage for overseas study'
        ]
    },
    {
        id: 'corporate-group-travel-plan',
        title: 'Corporate/group travel plan',
        category: 'Travel insurance',
        shortDescription: 'Tailored for organizations sending teams overseas',
        description: 'Corporate/group travel plan provides tailored coverage for organizations sending teams overseas with comprehensive protection.',
        icon: <Plane size={48} />,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
        features: [
            'Corporate Coverage: Protection for business travel',
            'Group Travel: Coverage for teams',
            'Business Protection: Tailored for organizations',
            'Overseas Support: International coverage'
        ]
    }
];

export const getProductIds = () => products.map(p => p.id);

export const getProductById = (id) => products.find(p => p.id === id);

export const getProductsByCategory = (category) => products.filter(p => p.category === category);
