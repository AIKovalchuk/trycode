import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../../provider/auth/Auth';

const Signup: React.FC = () => {
    const { signup } = useAuth();
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const history = useHistory();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            email: { value: string };
            password: { value: string };
        };

        const email = target.email.value;
        const password = target.password.value;

        try {
            setError('');
            setLoading(true);
            await signup(email, password);
            history.push('/');
        } catch {
            setError('Failed to log in');
        }

        setLoading(false);
    };

    return (
        <Row className="d-flex align-items-center justify-content-center">
            <Col md="auto">
                <Card body style={{ width: '18rem' }}>
                    {error && <Alert variant={'warning'}>{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Card>
                <div className="w-100 text-center mt-2">
                    Need an account? <Link to="/login">Login</Link>
                </div>
            </Col>
        </Row>
    );
};

export default Signup;
