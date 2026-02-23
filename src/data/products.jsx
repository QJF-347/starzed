import React from 'react';
import { Car, Heart, Users, Building, Briefcase, Shield, Home, Key, PiggyBank, Briefcase as BriefcaseIcon, GraduationCap, Anchor, HardHat } from 'lucide-react';

export const products = [
    // --- Motor Insurance ---
    {
        id: 'motor-vehicle-insurance',
        title: 'Motor Vehicle Insurance',
        category: 'Motor Insurance',
        shortDescription: 'Comprehensive coverage for your vehicle against accidents, theft, and liabilities.',
        description: 'Our Motor Vehicle Insurance offering provides complete peace of mind on the road. Whether you own a private car, a commercial vehicle, or a fleet, we have tailored solutions to meet your specific needs.',
        icon: <Car size={48} />,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUpczvpD_qOYevwqnH_u1M27jsCq02ff809A&s',
        features: [
            'Comprehensive Cover: Protection against accidental damage, fire, and theft.',
            'Third Party Liability: Coverage for bodily injury and property damage to third parties.',
            'Passenger Liability: Cover for passengers in your vehicle.',
            'Emergency Medical Expenses: Coverage for medical expenses following an accident.'
        ]
    },
    {
        id: 'motor-private',
        title: 'Motor Private',
        category: 'Motor Insurance',
        shortDescription: 'Insurance designed specifically for private vehicle owners.',
        description: 'Motor Private insurance is designed for individuals who use their vehicles for social, domestic, and pleasure purposes. It offers extensive protection for your personal car.',
        icon: <Car size={48} />,
        image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Loss or Damage: Protection against fire, theft, and accidental damage.',
            'Third Party Risks: Legal liability for death, injury, or property damage.',
            'Windscreen Cover: Replacement or repair of damaged windscreens.',
            'Entertainment Unit Cover: Protection for your car radio and music system.'
        ]
    },
    {
        id: 'motor-commercial',
        title: 'Motor Commercial',
        category: 'Motor Insurance',
        shortDescription: 'Coverage for vehicles used for business and commercial purposes.',
        description: 'Keep your business moving with our Motor Commercial insurance. This policy covers vehicles used for transporting goods or passengers for hire or reward.',
        icon: <Briefcase size={48} />,
        image: 'https://images.unsplash.com/photo-1549461129-3ae8e658393c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Own Damage: Cover for repair costs due to accidents.',
            'Third Party Liability: Mandatory coverage for commercial operations.',
            'Passenger Legal Liability: Protection against claims from passengers.',
            'Anti-Theft Device: Discounts for installed tracking devices.'
        ]
    },
    {
        id: 'motor-cycle',
        title: 'Motor Cycle',
        category: 'Motor Insurance',
        shortDescription: 'Specialized insurance for motorcycles and bodabodas.',
        description: 'Affordable and reliable coverage for motorcycle owners. Whether for personal use or business, we ensure you are protected on every ride.',
        icon: <Car size={48} />,
        image: 'https://images.unsplash.com/photo-1558981403-c5f91ed9c251?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Third Party Only: Basic mandatory cover.',
            'Comprehensive: Full protection including theft and fire.',
            'Rider Personal Accident: Coverage for the rider in case of injury.'
        ]
    },
    {
        id: 'riot-strike-civil-commotion',
        title: 'Riot/Strike/Civil Commotion',
        category: 'Motor Insurance',
        shortDescription: 'Additional protection against political risks and civil unrest.',
        description: 'Standard policies often exclude riots and strikes. This extension ensures your vehicle is protected during times of civil instability or political unrest.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Riot Coverage: Damage caused during riots.',
            'Strike Coverage: Damage caused by striking workers.',
            'Civil Commotion: Protection during public disturbances.'
        ]
    },

    // --- Accidental & Medical Insurance ---
    {
        id: 'life-assurance',
        title: 'Life Assurance',
        category: 'Accidental & Medical Insurance',
        shortDescription: 'Secure your family\'s future with our life assurance plans.',
        description: 'Life Assurance provides a financial safety net for your loved ones in the event of your passing. It ensures that your family can maintain their standard of living and meet financial obligations.',
        icon: <Users size={48} />,
        image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Term Life: Affordable protection for a specific period.',
            'Whole Life: Permanent coverage with a savings component.',
            'Beneficiary Support: Quick payout to your nominated beneficiaries.'
        ]
    },
    {
        id: 'personal-accident',
        title: 'Personal Accident',
        category: 'Accidental & Medical Insurance',
        shortDescription: 'Financial protection against accidental injury or death.',
        description: 'Personal Accident insurance provides compensation in the event of injuries, disability, or death resulting from an accident. It acts as a financial safety net for you and your beneficiaries.',
        icon: <Heart size={48} />,
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Accidental Death: Lump sum payment to beneficiaries.',
            'Permanent Total Disability: Compensation for life-long disability.',
            'Medical Expenses Reimbursement: Coverage for accident-related medical bills.'
        ]
    },
    {
        id: 'medical-insurance-cover',
        title: 'Medical Insurance Cover',
        category: 'Accidental & Medical Insurance',
        shortDescription: 'Comprehensive health coverage for you and your family.',
        description: 'Health is wealth. Our Medical Insurance Cover ensures you have access to quality healthcare without the financial burden. We cover inpatient and outpatient services.',
        icon: <Heart size={48} />,
        image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Inpatient Cover: Hospitalization fees, surgery, and doctor\'s fees.',
            'Outpatient Cover: Consultation, laboratories, and pharmacy.',
            'Maternity Cover: Pre-natal, delivery, and post-natal care.'
        ]
    },
    {
        id: 'salamasure-uap',
        title: 'Salamasure – UAP',
        category: 'Accidental & Medical Insurance',
        shortDescription: 'A comprehensive medical and personal accident solution by UAP.',
        description: 'Salamasure offers a blend of medical and personal accident coverage, ensuring you are protected against unforeseen health and accident-related expenses.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Combined Coverage: Medical and personal accident benefits.',
            'Flexible Limits: Choose a plan that fits your budget.',
            'Wide Provider Network: Access to leading hospitals.'
        ]
    },
    {
        id: 'uap-afyaimara-family-cover',
        title: 'UAP AfyaImara Family Cover',
        category: 'Accidental & Medical Insurance',
        shortDescription: 'Premium family health cover for complete peace of mind.',
        description: 'AfyaImara Family Cover is designed to take care of your family’s health needs. It offers extensive inpatient and outpatient benefits with a wide network of providers.',
        icon: <Users size={48} />,
        image: 'https://images.unsplash.com/photo-1536640712247-3a97c6c475fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Family Shared Limit: Optimize cover for the whole family.',
            'Chronic Disease Management: Coverage for managing chronic conditions.',
            'Annual Health Checkups: Preventive care included.'
        ]
    },
    {
        id: 'group-life-cover',
        title: 'Group Life Cover',
        category: 'Accidental & Medical Insurance',
        shortDescription: 'Life insurance for employees or groups.',
        description: 'A policy designed for employers to provide life insurance coverage to their employees. It pays out a lump sum to beneficiaries in case of death in service.',
        icon: <BriefcaseIcon size={48} />,
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Death in Service Benefit: Financial support for employee families.',
            'Critical Illness Rider: Optional add-on for critical illnesses.',
            'Funeral Expense Benefit: Assistance with funeral costs.'
        ]
    },
    {
        id: 'group-medical',
        title: 'Group Medical',
        category: 'Accidental & Medical Insurance',
        shortDescription: 'Health insurance solution for registered groups and companies.',
        description: 'Ensure your team is healthy and productive with our Group Medical schemes. Tailored for companies, chamas, and associations.',
        icon: <Users size={48} />,
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Customizable Limits: Tailor benefits to your budget.',
            'Inpatient & Outpatient: Comprehensive healthcare access.',
            'Maternity & Optical: Optional benefits available.'
        ]
    },
    {
        id: 'group-personal-accident',
        title: 'Group Personal Accident',
        category: 'Accidental & Medical Insurance',
        shortDescription: 'Accident coverage for groups and employees.',
        description: 'Provides compensation to a group of people (e.g., employees) in the event of accidental injury, disability, or death. Ideally suited for companies.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            '24-hour Coverage: Protection on and off the job.',
            'Temporary Total Disability: Weekly income replacement.',
            'Medical Expenses: Coverage for accident-related treatment.'
        ]
    },
    {
        id: 'critical-illness-cover',
        title: 'Critical Illness Cover',
        category: 'Accidental & Medical Insurance',
        shortDescription: 'Support when diagnosed with a serious illness.',
        description: 'Diagnosis of a critical illness can be financially draining. This cover provides a lump sum payout upon diagnosis of specified critical illnesses like cancer, heart attack, or stroke.',
        icon: <Heart size={48} />,
        image: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Lump Sum Payout: Use the funds for treatment or lifestyle adjustments.',
            'Wide Coverage: Covers major critical illnesses.',
            'Financial Security: Protects your savings during recovery.'
        ]
    },
    {
        id: 'afyaimara-executive',
        title: 'AfyaImara Executive',
        category: 'Accidental & Medical Insurance',
        shortDescription: 'Executive healthcare for senior management and individuals desiring top-tier cover.',
        description: 'A premium health insurance package offering high limits, access to top-tier hospitals, and comprehensive benefits for discerning clients.',
        icon: <BriefcaseIcon size={48} />,
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'High Benefit Limits: Adequate cover for major procedures.',
            'Overseas Treatment: Coverage for treatment abroad if needed.',
            'Executive Checkups: Comprehensive annual health screenings.'
        ]
    },
    {
        id: 'afyaimara-junior',
        title: 'AfyaImara Junior',
        category: 'Accidental & Medical Insurance',
        shortDescription: 'Dedicated health cover for children.',
        description: 'Ensure your children have access to the best medical care. AfyaImara Junior is a standalone cover for children, offering inpatient and outpatient benefits.',
        icon: <Heart size={48} />,
        image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Child-Centric Benefits: Vaccinations and pediatrician visits.',
            'No Co-payment: Full coverage for specified services.',
            'School Accident Cover: Protection while at school.'
        ]
    },
    {
        id: 'afyaimara-county',
        title: 'AfyaImara County',
        category: 'Accidental & Medical Insurance',
        shortDescription: 'Affordable health cover tailored for county regions.',
        description: 'A customized health insurance solution designed to be accessible and affordable for residents in various counties, ensuring medical care is within reach.',
        icon: <Home size={48} />,
        image: 'https://images.unsplash.com/photo-1591115765373-520b7a21769b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'County Hospital Network: Access to local accredited hospitals.',
            'Affordable Premiums: Cost-effective healthcare solution.',
            'Essential Benefits: Covers core medical needs.'
        ]
    },

    // --- Non-Motor Insurance ---
    {
        id: 'mortgages',
        title: 'Mortgages',
        category: 'Non-Motor Insurance',
        shortDescription: 'Mortgage protection features and partnerships.',
        description: 'We offer Mortgage Protection insurance which pays off the outstanding mortgage balance in the event of death or permanent disability, securing your family\'s home.',
        icon: <Home size={48} />,
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Loan Coverage: Covers the outstanding loan balance.',
            'Disability Benefit: Payout in case of permanent disability.',
            'Joint Lives: Coverage for spouses/partners.'
        ]
    },
    {
        id: 'savings-and-investments',
        title: 'Savings and Investments',
        category: 'Non-Motor Insurance',
        shortDescription: 'Grow your wealth with our investment-linked insurance plans.',
        description: 'Secure your financial future with our range of savings and investment products. Whether saving for education, a home, or wealth accumulation.',
        icon: <PiggyBank size={48} />,
        image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Guaranteed Returns: Secure growth for your savings.',
            'Flexible Contributions: Save at your own pace.',
            'Tax Benefits: Enjoy tax relief on contributions.'
        ]
    },
    {
        id: 'pensions',
        title: 'Pensions',
        category: 'Non-Motor Insurance',
        shortDescription: 'Retirement planning solutions for individuals and groups.',
        description: 'Plan for a comfortable retirement with our pension schemes. We offer individual pension plans and corporate schemes to ensure financial independence in your golden years.',
        icon: <Users size={48} />,
        image: 'https://images.unsplash.com/photo-1473186578172-c141e6798ee4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Tax Efficient: Contributions are tax-deductible.',
            'Compound Growth: Maximize returns over time.',
            'Flexible Pay-out Options: Lump sum or annuity options.'
        ]
    },
    {
        id: 'consultancies',
        title: 'Consultancies',
        category: 'Non-Motor Insurance',
        shortDescription: 'Expert insurance and risk management consultancy.',
        description: 'Benefit from our expertise. We provide risk management audits, insurance portfolio reviews, and claims consultancy services.',
        icon: <BriefcaseIcon size={48} />,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Risk Audits: Identify gaps in your coverage.',
            'Portfolio Review: Optimize your insurance spend.',
            'Claims Advocacy: Professional support for complex claims.'
        ]
    },
    {
        id: 'fire-building-stocks-wiba-employers-liability',
        title: 'Fire / WIBA / Employers Liability',
        category: 'Non-Motor Insurance',
        shortDescription: 'Combined business protection package.',
        description: 'A comprehensive package for businesses combining Fire protection for assets and WIBA/Employers Liability for staff. Convenient and cost-effective.',
        icon: <Building size={48} />,
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Asset Protection: Fire and perils cover.',
            'Staff Protection: WIBA compliance.',
            'Liability: Employers liability coverage.'
        ]
    },
    {
        id: 'fire-perils-theft-burglary',
        title: 'Fire / Perils / Theft / Burglary',
        category: 'Non-Motor Insurance',
        shortDescription: 'Protect your business assets from fire and theft.',
        description: 'Essential coverage for any business, protecting your physical assets against fire, natural disasters, and burglary.',
        icon: <Key size={48} />,
        image: 'https://images.unsplash.com/photo-1555854816-802b178396e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Fire & Allied Perils: Comprehensive damage protection.',
            'Burglary: Coverage against forced entry theft.',
            'Business Interruption: Optional loss of profit cover.'
        ]
    },
    {
        id: 'cash-in-transit',
        title: 'Cash in Transit',
        category: 'Non-Motor Insurance',
        shortDescription: 'Insurance for money in transit or in the safe.',
        description: 'Protects against loss of money while being transported to/from the bank, or while kept in a locked safe or drawers at the business premises.',
        icon: <BriefcaseIcon size={48} />,
        image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Transit Cover: Money moving between premises and bank.',
            'Safe Cover: Money secured in a safe.',
            'Infidelity Cover: Theft by employees (optional).'
        ]
    },
    {
        id: 'fire-industrial',
        title: 'Fire Industrial',
        category: 'Non-Motor Insurance',
        shortDescription: 'Heavy-duty fire protection for factories and plants.',
        description: 'Specialized fire insurance for industrial risks, factories, and manufacturing plants, covering machinery, stock, and buildings.',
        icon: <Building size={48} />,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Industrial All Risks: Comprehensive plant coverage.',
            'Stock Declaration: Floating policy for fluctuating stock.',
            'Spontaneous Combustion: Coverage for specific industrial risks.'
        ]
    },
    {
        id: 'fire-domestic',
        title: 'Fire Domestic (Domestic Package)',
        category: 'Non-Motor Insurance',
        shortDescription: 'Complete home insurance package.',
        description: 'Protect your home, contents, and domestic staff with our Domestic Package. Covers fire, theft, and liability.',
        icon: <Home size={48} />,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Building & Contents: Comprehensive home protection.',
            'Domestic Workers: WIBA cover related to domestic staff.',
            'Occupiers Liability: Protection against third party claims.'
        ]
    },
    {
        id: 'contractors-all-risk',
        title: 'Contractors All Risk (CAR)',
        category: 'Non-Motor Insurance',
        shortDescription: 'Coverage for construction projects.',
        description: 'All-risk coverage for construction projects, protecting the works, third party liability, and construction equipment.',
        icon: <HardHat size={48} />,
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Project Works: Damage to the building under construction.',
            'Third Party Liability: Injury or damage to public.',
            'Tools and Plant: Theft or damage to equipment.'
        ]
    },
    {
        id: 'political-violence-terrorism',
        title: 'Political Violence / Terrorism',
        category: 'Non-Motor Insurance',
        shortDescription: 'Protection against terrorism and political violence.',
        description: ' safeguard your assets/businesses against loss or damage caused by acts of terrorism, sabotage, riots, strikes, and civil commotion.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1582132717841-38cb4402662c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Terrorism Cover: Damage from terrorist acts.',
            'Sabotage: Protection against malicious damage.',
            'Business Interruption: Loss of revenue due to events.'
        ]
    },
    {
        id: 'fidelity-guarantee',
        title: 'Fidelity Guarantee',
        category: 'Non-Motor Insurance',
        shortDescription: 'Protection against employee dishonesty.',
        description: 'Indemnifies the employer against direct pecuniary loss sustained through acts of fraud or dishonesty by employees.',
        icon: <Key size={48} />,
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Employee Fraud: Theft or embezzlement.',
            'Stock Theft: Misappropriation of goods.',
            'Positions Guaranteed: Cover specific roles or all staff.'
        ]
    },
    {
        id: 'professional-indemnity',
        title: 'Professional Indemnity',
        category: 'Non-Motor Insurance',
        shortDescription: 'Liability protection for professionals.',
        description: 'Essential for professionals (doctors, lawyers, architects, etc.) to protect against claims of negligence or errors in their professional services.',
        icon: <BriefcaseIcon size={48} />,
        image: 'https://images.unsplash.com/photo-1507679799987-c7377bd5871f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Negligence Claims: Defense and settlement costs.',
            'Errors & Omissions: Coverage for mistakes.',
            'Defamation: Protection against libel/slander claims.'
        ]
    },
    {
        id: 'businessmans-combined-cover',
        title: 'Businessman\'s Combined Cover',
        category: 'Non-Motor Insurance',
        shortDescription: 'All-in-one policy for SMEs.',
        description: 'A bundled policy designed for small to medium businesses, combining Fire, Burglary, WIBA, and other essential covers into one simple policy.',
        icon: <Briefcase size={48} />,
        image: 'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Simplified Management: One policy document.',
            'Cost Effective: Cheaper than separate policies.',
            'Comprehensive: Covers key business risks.'
        ]
    },
    {
        id: 'biasharasure-old-mutual',
        title: 'BiasharaSure – Old Mutual',
        category: 'Non-Motor Insurance',
        shortDescription: 'Customized business protection from Old Mutual.',
        description: 'BiasharaSure is a flexible business insurance package tailored for SMEs, covering assets, liability, and employees.',
        icon: <Briefcase size={48} />,
        image: 'https://images.unsplash.com/photo-1442504028989-ab58b5f29a4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Flexible Modules: Pick what you need.',
            'Business Continuity: Supports recovery after loss.',
            'Trusted Partner: Backed by Old Mutual.'
        ]
    },
    {
        id: 'school-combined-cover',
        title: 'School Combined Cover',
        category: 'Non-Motor Insurance',
        shortDescription: 'Comprehensive insurance for educational institutions.',
        description: 'Specifically designed for schools and colleges, covering buildings, students (personal accident), staff (WIBA), and liability.',
        icon: <GraduationCap size={48} />,
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Assets Cover: Classrooms and facilities.',
            'Student Accident: Medical cover for students.',
            'Public Liability: Protection for events and visitors.'
        ]
    },
    {
        id: 'bid-bond',
        title: 'Bid Bond',
        category: 'Non-Motor Insurance',
        shortDescription: 'Tender security for contractors.',
        description: 'A guarantee required during the tendering process to ensure that the bidder will accept the contract if awarded.',
        icon: <Shield size={48} />,
        image: 'https://images.unsplash.com/photo-1586282391129-59aef09a9632?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Tender Compliance: Meets standard tender requirements.',
            'Quick Processing: Fast turnaround for deadlines.',
            'Competitive Rates: Affordable security.'
        ]
    },
    {
        id: 'carriers-liability',
        title: 'Carriers Liability',
        category: 'Non-Motor Insurance',
        shortDescription: 'Protection for transporters.',
        description: 'Covers the liability of a transporter for loss or damage to goods while in their custody during transit.',
        icon: <Car size={48} />,
        image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        features: [
            'Goods in Transit: Coverage for client goods.',
            'Theft & Accident: Protection against road risks.',
            'Legal Liability: Compensation for cargo owners.'
        ]
    }
];

export const getProductIds = () => products.map(p => p.id);

export const getProductById = (id) => products.find(p => p.id === id);

export const getProductsByCategory = (category) => products.filter(p => p.category === category);
