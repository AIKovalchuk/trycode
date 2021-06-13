import React from 'react';
import { Container } from 'react-bootstrap';
import Header from '../components/header/header';

export const Page: React.FC = ({ children }) => {
    return (
        <Container style={{ minHeight: '100vh' }} fluid>
            <Header />
            {children}
        </Container>
    );
};
