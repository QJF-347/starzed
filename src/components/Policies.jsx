import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PolicyCard from './PolicyCard';
import './Policies.css';

const Policies = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const response = await api.getPolicies();
                setPolicies(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPolicies();
    }, []);

    if (loading) {
        return (
            <section className="section services-section" id="policies">
                <div className="container">
                    <div className="text-center">
                        <p>Loading policies...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="section services-section" id="policies">
                <div className="container">
                    <div className="text-center">
                        <p>Error loading policies: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section services-section" id="policies">
            <div className="container">
                <div className="section-header text-center">
                    <span className="subtitle">Our Expertise</span>
                    <h2 className="title">Comprehensive Insurance Policies</h2>
                    <p className="description">
                        We offer a wide range of insurance solutions tailored to meet your unique needs.
                    </p>
                </div>

                <div className="services-grid">
                    {policies.map((policy) => (
                        <PolicyCard key={policy._id} policy={policy} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Policies;
