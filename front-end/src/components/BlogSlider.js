import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { motion } from "framer-motion";

const BlogSlider = () => {
    const [blogArticles, setBlogArticles] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:9999/api/blog');
                setBlogArticles(response.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, []);

    const scrollToContent = () => {
        const contentSection = document.getElementById("blog-content");
        if (contentSection) {
            contentSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div style={{ position: 'relative', textAlign: 'center', backgroundColor: '#fff' }}>
            <div style={{
                position: 'relative',
                height: '1000px',
                backgroundImage: 'url("/R.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                }}></div>

                {/* Vòng tròn lớn màu xám đen */}
                <div style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '50%',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: '0'
                }}></div>

                <div style={{ position: 'relative', textAlign: 'center', color: '#fff', padding: '50px 20px' }}>
                    <h1 style={{
                        fontSize: '55px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        marginBottom: '10px',
                        position: 'relative',
                        zIndex: '1'
                    }}>

                        TIN TỨC

                    </h1>

                    {/* Đường kẻ với icon */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '30px 0',
                        position: 'relative',
                        zIndex: '1'
                    }}>
                        <div style={{
                            width: '100px',
                            height: '2px',
                            backgroundColor: '#fff'
                        }}></div>
                        <div style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: '#fff',
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            margin: '0 10px'
                        }}></div>
                        <div style={{
                            width: '100px',
                            height: '2px',
                            backgroundColor: '#fff'
                        }}></div>
                    </div>

                    <p style={{
                        fontSize: '20px',
                        fontWeight: '500',
                        maxWidth: '400px',
                        margin: '0 auto 20px',
                        lineHeight: '1.5',
                        position: 'relative',
                        zIndex: '1'
                    }}>
                        Tận hưởng những khoảnh khắc trọn vẹn cùng Jollibee
                    </p>

                    <motion.div
                        style={{
                            margin: '20px auto 0',
                            cursor: 'pointer',
                            position: 'relative',
                            zIndex: '1',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        onClick={scrollToContent}
                    >
                        {/* SVG Double Chevron */}
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 8L12 14L18 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 14L12 20L18 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>

                </div>
            </div>

            <div id="blog-content" style={{ paddingTop: '90px' }}>
                <Container>
                    <Row>
                        {blogArticles.map(article => (
                            <Col md={4} key={article._id} style={{ marginBottom: '30px' }}>
                                <Card style={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                    transition: 'transform 0.3s ease-in-out',
                                    cursor: 'pointer',
                                    width: '100%',
                                    height: '100%'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <Card.Img variant="top" src={article.img} alt={article.title} style={{ height: '400px', objectFit: 'cover' }} />
                                    <Card.Body style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        padding: '20px',
                                        height: '200px'
                                    }}>
                                        <Card.Title style={{ fontSize: '22px', fontWeight: 'bold', color: '#333' }}>{article.title}</Card.Title>
                                        <Card.Text style={{ fontSize: '16px', color: '#666', flexGrow: 1, overflow: 'hidden' }}>
                                            {article.content.substring(0, 150)}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default BlogSlider;
