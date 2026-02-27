export const blogs = [
    {
        id: 1,
        title: "Understanding Motor Insurance: Comprehensive vs Third Party",
        excerpt: "When buying motor insurance, the choices can be confusing. We break down the differences to help you choose the right cover.",
        category: "Motor Insurance",
        author: "James Kariuki",
        date: "May 12, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "Why Health Insurance is Essential for Your Family",
        excerpt: "Medical emergencies can happen anytime. Discover why having a solid health insurance plan is crucial for your family's financial security.",
        category: "Health Insurance",
        author: "Sarah Wanjiku",
        date: "April 28, 2026",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Protecting Your Business from Unforeseen Risks",
        excerpt: "Every business faces risks. Learn about the different types of business insurance covers and how they can safeguard your enterprise.",
        category: "Business Insurance",
        author: "David Ochieng",
        date: "April 15, 2026",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 4,
        title: "The Importance of Life Assurance for Peace of Mind",
        excerpt: "Life assurance isn't just about covering risks; it's about providing a safety net for your loved ones. Here is what you need to know.",
        category: "Life Assurance",
        author: "Grace Mutuku",
        date: "March 30, 2026",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=800"
    }
];

export const getFeaturedBlog = () => blogs[0];
export const getRecentBlogs = () => blogs.slice(1);
export const getBlogById = (id) => blogs.find(blog => blog.id === id);
